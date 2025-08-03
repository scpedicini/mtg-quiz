/** @typedef {import('./types.js').Card} Card */
/** @typedef {import('./types.js').CardPack} CardPack */
/** @typedef {import('./types.js').Edition} Edition */
/** @typedef {import('./types.js').Ranking} Ranking */
/** @typedef {import('./types.js').GameSystem} GameSystem */

/** @type {HTMLCanvasElement} */
let MtgCanvas;
/** @type {CanvasRenderingContext2D} */
let MtgContext;
/** @type {HTMLImageElement} */
let GenericBlankCard;
/** @type {HTMLImageElement} */
let BlankCard;
/** @type {HTMLImageElement} */
let CurrentCard;
/** @type {Ranking[]} */
let RankingSystem;
/** @type {JQuery} */
let ProgressBar;

// console.log = () => { };

// TODO Add include color border option (adjusts offsets by slight amount)
// TODO Fix split cards such as Bushi Tenderfoot in Champions of Kamigawa
// TODO Highscores

// easy way to strip out console log statements in "release mode"
// console.log = () => { };

// device detection
const isMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
	|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))

const hasTouch = !!('ontouchstart' in window || navigator.msMaxTouchPoints);

let bloodhoundInstance = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.whitespace,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	local: [
		'Waiting...'
	]
});

bloodhoundInstance.initialize(true);

const STATE_NA = "STATE_NA";
const STATE_LOADINGCARD = "STATE_LOADINGCARD";
const STATE_LOADINGEDITION = "STATE_LOADINGEDITION";
const STATE_WAITFORGUESS = "STATE_WAITFORGUESS";

// An edition has been loaded and game is ready to start.
const STATE_READY = "STATE_READY";

// User can press "next card" to see next card
const STATE_GOTONEXTCARD = "STATE_GOTONEXTCARD";

const STATE_SHOWCARD = "STATE_SHOWCARD";

/** @type {GameSystem} */
const GameSystem =
{
	"ShowBorders": false,
	"LastTime": 0,
	"Timer": 0,
	"MaxSeconds": 12,
	"GradeQuestions": 8,
	"CorrectCard": "",
	"MultiverseId": 0,
	"UseScryfall": false,
	"ScryfallId": "",
	"State": STATE_NA,
	"Pack": undefined,
	"TotalAnswered": 0,
	"TotalCorrect": 0,
	"Edition": undefined
};

document.addEventListener('DOMContentLoaded', Initialize);

async function LoadEssential()
{
	console.log("LoadEssential");
	BlankCard = new Image();
	BlankCard.src = "assets/BlankCard-Smaller.png";
	GenericBlankCard = BlankCard;

	/** @returns {Promise<Ranking[]>} */
	let fetchRankingsCb = (async () => {
		let response = await fetch('cards/rankings.json');
		let resptext = await response.json();
		return resptext;
	})();

	let [, rankingSystem] = await Promise.all([BlankCard.decode(), fetchRankingsCb]);
	RankingSystem = rankingSystem;

	console.log("LoadEssential Finished");
}


async function Initialize()
{

	let promiseLoader = LoadEssential();

	ProgressBar = $('.progress-bar');

	document.getElementById('spinner').hidden = true;

	let editionBox =$(`#EditionBox`);
	editionBox.prop('disabled', true);

	MtgCanvas = document.getElementById('MtgCanvas');
	MtgContext = MtgCanvas.getContext('2d');

	$('canvas#MtgCanvas').on('click', () => ClickedCard());


	$(".typeahead").typeahead({
			minLength: 3,
			highlight: true,
			hint: true,
		},
		{
			name: 'cards',
			source: bloodhoundInstance,
		});


	CurrentCard = new Image();
	// CurrentCard.crossOrigin = "anonymous";

	// same as CurrentCard.onload = function()
	$(CurrentCard).on('load',() => {
		CardLoaded()
	});

	let userInput = $('#UserInput');
	// Check the user input to see if they are correct
	userInput.on('input',  (e) => CheckCorrect(e))
		.on('typeahead:selected', (e) => CheckCorrect(e))
		.on('typeahead:autocompleted', (e) => CheckCorrect(e));

	userInput.on('keypress', (e) => InputKeypress(e))


	// add the elements

	/** @type {Edition[]} */
	AvailableEditions = AvailableEditions.filter(v => v.Disabled === undefined || v.Disabled === false);

	AvailableEditions.forEach(v => {
		$('<option />', {
			value: v.Edition,
			text: v.Edition,
		}).appendTo($('#EditionBox'));
	});

	$('#ActionBtn').on('click', () => ButtonPressed());

	// Add event handler for Scryfall checkbox
	$('#useScryfallCheck').on('change', (e) => {
		GameSystem.UseScryfall = e.target.checked;
		console.log("UseScryfall set to: " + GameSystem.UseScryfall);
	});

	editionBox.on('change', (e) => LoadEdition(e.target.value));

	let edName = AvailableEditions[Math.floor(Math.random() * AvailableEditions.length)].Edition;
	editionBox.val(edName);

	await promiseLoader;
	LoadEdition(edName);
}

/**
 * @param {string} state - The game state to transition to
 */
function SetState(state)
{
	GameSystem.State = state;
	console.log("Transitioning to " + state);
	ConfigureButton();

	//document.querySelector('#UserInput').placeholder = "";

	if(state === STATE_LOADINGEDITION) {
		document.querySelector('#UserInput').placeholder = '';
	}
	else if(state === STATE_READY) {
		console.log('STATE_READY');
		document.querySelector('#UserInput').placeholder = 'Press Play to Start!';
		SetTimerProgressBarToFull();
		ToggleClasses(ProgressBar, ['bg-success', 'bg-danger', 'glow'], 'bg-info');
	}
	else if(state === STATE_GOTONEXTCARD) {
		ToggleClasses(ProgressBar, 'glow');

		if(GameSystem.TotalAnswered >= GameSystem.GradeQuestions) {
			let accuracy = Math.round( (GameSystem.TotalCorrect / GameSystem.TotalAnswered) * 100 );
			$('#ranking-header').text(`Your Accuracy: ${accuracy}%`);
			/** @type {Ranking} */
			let rank = RankingSystem.find(r => accuracy >= r.MinScore);
			$('#ranking-position').text(rank.Name);
			$('#ranking-desc').text(rank.Description);
		}
		else {
			$('#ranking-header').text(`Questions Left: ${GameSystem.GradeQuestions - GameSystem.TotalAnswered}`);
		}
	}
	else if(state === STATE_LOADINGCARD) {
		// show the spinner
		SetValid();
		DrawBlank();
		ShowSpinner();
		ShowNewCard();
		FocusInput();
	}
	else if(state === STATE_WAITFORGUESS) {

		document.querySelector('#UserInput').placeholder = "What card is this?";
		// start the progress bar
		ToggleClasses(ProgressBar, 'progress-bar-elapsing', 'progress-bar-full');

		ProgressBar.css('width', '100%')
		ToggleClasses(ProgressBar, undefined, 'glow');

		ToggleClasses(ProgressBar, 'progress-bar-full', 'progress-bar-elapsing')

		StartTimer();
	}

}


function ButtonPressed()
{
	if(GameSystem.State === STATE_GOTONEXTCARD) // clicked Next Card
	{
		SetState(STATE_LOADINGCARD);
	}
	else if(GameSystem.State === STATE_READY) // clicked play for first time
	{
		SetState(STATE_LOADINGCARD);
	}
	else if(GameSystem.State === STATE_WAITFORGUESS) // player gave up
	{
		ShowCorrect();
	}
}

function ConfigureButton()
{
	let btn = $('#ActionBtn');

	if(GameSystem.State === STATE_WAITFORGUESS) {
		btn.prop('disabled', false);
		btn.text("Give Up");
	}
	else if(GameSystem.State === STATE_READY) {
		btn.prop('disabled', false);
		btn.text("Play");
	}
	else if(GameSystem.State === STATE_GOTONEXTCARD) {
		btn.prop('disabled', false);
		btn.text('Next Card');
	}
	else if(GameSystem.State === STATE_LOADINGCARD || GameSystem.State === STATE_LOADINGEDITION) {
		btn.prop('disabled', true);
		btn.text('Wait...');
	}

}



function ShowSpinner()
{
	let spinner = $(`#spinner`);
	spinner.removeClass('rotate');
	document.getElementById('spinner').hidden = false;
	spinner.css('display', 'block');

	let x = window.scrollX + MtgCanvas.getBoundingClientRect().left; //+ (MtgCanvas.width * 0.3); //+ 60;
	let y = window.scrollY + MtgCanvas.getBoundingClientRect().top; //+ (MtgCanvas.height * 0.15); //50;

	let x_offset = MtgCanvas.width < 225 ? 60 : 80;
	let y_offset = MtgCanvas.height < 320 ? 50 : 75;

	x += x_offset;
	y += y_offset;

	spinner.css('left', x)
	spinner.css('top', y)
	setTimeout( () => spinner.addClass('rotate'), 100);
}

function HideSpinner()
{
	let spinner = $(`#spinner`);
	document.getElementById('spinner').hidden = true;
	spinner.removeClass('rotate');
}

/**
 * @param {string} imageUri - The URI of the image to load
 * @returns {Promise<HTMLImageElement>} The loaded image
 */
async function LoadImage(imageUri)
{
	let img = new Image();
	img.src = imageUri;
	await img.decode();
	console.log("Finished loading image " + imageUri);
	return img;
}

/**
 * @param {string} editionName - The name of the edition to load
 */
async function LoadEdition(editionName)
{
	console.log("Loading edition " + editionName);
	$('.typeahead').typeahead('val','');

	let editionBox =$(`#EditionBox`);
	editionBox.prop('disabled', true);
	SetState(STATE_LOADINGEDITION);

	DrawBlank();
	ShowSpinner();

	/** @type {Edition} */
	let edition = AvailableEditions.find(c => c.Edition === editionName);
	GameSystem.Edition = edition;

	let cardJsonFile = "cards/" + edition.Filename;

	let response = await fetch(cardJsonFile);
	/** @type {CardPack} */
	let pack = JSON.parse(await response.text());
	GameSystem.Pack = pack;

	if(pack.Blank !== undefined) {
		BlankCard = await LoadImage("assets/" + pack.Blank);
	}
	else {
		BlankCard = GenericBlankCard;
	}

	MtgCanvas.width = BlankCard.width;
	MtgCanvas.height = BlankCard.height;
	$('canvas#MtgCanvas').css('cursor', 'pointer');

	DrawBlank();



	// TODO allow for removal of apostrophes or possibly when typing them they aren't included
	/** @type {string[]} */
	let suggestions = pack.Cards.map(p => p.Name);

	bloodhoundInstance.clear();
	bloodhoundInstance.clearPrefetchCache();
	bloodhoundInstance.clearRemoteCache();
	bloodhoundInstance.local = suggestions;
	bloodhoundInstance.initialize(true);

	if(!isMobile && !hasTouch)
		$('.tt-menu').remove();

	SetState(STATE_READY);
	HideSpinner();

	editionBox.prop('disabled', false);
}


function StartTimer()
{
	GameSystem.LastTime = Date.now();
	GameSystem.Timer = GameSystem.MaxSeconds;
	TimerCallback();
}

function SetTimerProgressBarToFull()
{
	ToggleClasses(ProgressBar, "progress-bar-elapsing", "progress-bar-full");
	setTimeout(() => ProgressBar.css('width', '100%'), 0);
}

function TimerCallback()
{
	let now = Date.now();
	let elapsed = ( now - GameSystem.LastTime ) / 1000.0;
	GameSystem.LastTime = now;
	GameSystem.Timer -= elapsed;

	if(GameSystem.Timer <= 0 && ProgressBar.width() <= 0) {
		ShowCorrect();
	}
	else if(GameSystem.State === STATE_WAITFORGUESS) {
		let width = ( Math.max(0, GameSystem.Timer / GameSystem.MaxSeconds) * 100 );
		ProgressBar.width( `${width}%`);

		let addedClass = undefined;
		if (GameSystem.Timer < (GameSystem.MaxSeconds * 0.3))
			addedClass = 'bg-danger';
		else
			addedClass = 'bg-success'

		ToggleClasses(ProgressBar, ["bg-success", "bg-info", "bg-danger"], addedClass);

		setTimeout(TimerCallback, 50);
	}
}



function InputKeypress(e)
{
	if(e.originalEvent.key === "Enter" && GameSystem.State === STATE_GOTONEXTCARD)
	{
		SetState(STATE_LOADINGCARD);
	}
}

/**
 * @param {JQuery.Event} e - The input event
 */
function CheckCorrect(e)
{
	if(GameSystem.State === STATE_WAITFORGUESS) {
		let inputValue = e.target.value.trim().toUpperCase();
		//console.log("Checking: " + inputValue);
		if (inputValue === GameSystem.CorrectCard.toUpperCase()) {
			SetValid(true);
			GameSystem.TotalCorrect++;
			ShowCorrect();
		}
	}
}

/**
 * @param {boolean} [valid] - Whether the input is valid
 */
function SetValid(valid)
{
	let el = $('#UserInput');
	el.removeClass('is-valid');
	el.removeClass('is-invalid');

	if (valid !== undefined)
	{
		let prefix = valid ? '' : 'in';
		el.addClass('is-'+prefix+'valid');
	}
}



async function ShowCorrect()
{
	MtgContext.clearRect(0, 0, MtgCanvas.width, MtgCanvas.height);
	
	if (GameSystem.UseScryfall && CurrentCard.dataset.normalImage) {
		// For Scryfall, we need to load and show the normal (full) card image
		let fullCardImage = new Image();
		fullCardImage.src = CurrentCard.dataset.normalImage;
		
		await fullCardImage.decode();
		
		// Scale the full card to fit the canvas
		let scale = Math.min(MtgCanvas.width / fullCardImage.width, MtgCanvas.height / fullCardImage.height);
		let drawWidth = fullCardImage.width * scale;
		let drawHeight = fullCardImage.height * scale;
		let dx = (MtgCanvas.width - drawWidth) / 2;
		let dy = (MtgCanvas.height - drawHeight) / 2;
		
		MtgContext.drawImage(fullCardImage, 0, 0, fullCardImage.width, fullCardImage.height, dx, dy, drawWidth, drawHeight);
	} else {
		// Original behavior for Multiverse
		MtgContext.drawImage(CurrentCard, 0, 0);
	}
	
	GameSystem.TotalAnswered++;

	SetState(STATE_GOTONEXTCARD);

	let typeaheadEl = $('.typeahead');
	typeaheadEl.typeahead('val', GameSystem.CorrectCard);
	typeaheadEl.typeahead('close');
}


function DrawBlank()
{
	MtgContext.clearRect(0, 0, MtgCanvas.width, MtgCanvas.height);
	MtgContext.drawImage(BlankCard, 0, 0);
}


function FocusInput()
{
	let userInput = $('#UserInput');
	//userInput.val('');
	$('.typeahead').typeahead('val','');
	userInput.focus();
}

function ClickedCard()
{
	if(GameSystem.State === STATE_GOTONEXTCARD)
	{
		let uri;
		if (GameSystem.UseScryfall && GameSystem.ScryfallId) {
			uri = `https://scryfall.com/card/${GameSystem.ScryfallId}`;
		} else if (GameSystem.MultiverseId > 0) {
			uri = `https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${GameSystem.MultiverseId}`;
		}
		
		if (uri) {
			open(uri);
		}
	}
}

// Clears out the context
async function ShowNewCard()
{
	// find the right GameSystem.CardPacks which has the matching Edition
	/** @type {Card[]} */
	let cards = GameSystem.Pack.Cards;
	console.log("Number of cards: " + cards.length);
	
	let index = Math.floor(Math.random() * cards.length);
	// index = cards.findIndex(x=>x.Name === "Prodigal Sorcerer")

	let selectedCard = cards[index];
	GameSystem.CorrectCard = selectedCard.Name.trim();
	GameSystem.MultiverseId = selectedCard.MultiverseId;
	GameSystem.ScryfallId = selectedCard.ScryfallId;

	if (GameSystem.UseScryfall && selectedCard.ScryfallId) {
		console.log(`Showing card: ${selectedCard.Name} scryfall id: ${selectedCard.ScryfallId}`);
		
		try {
			// Fetch card data from Scryfall API
			let response = await fetch(`https://api.scryfall.com/cards/${selectedCard.ScryfallId}`);
			if (response.ok) {
				let cardData = await response.json();
				// Use art_crop for the cropped image
				CurrentCard.src = cardData.image_uris.art_crop;
				// Store the normal image URL for later use when showing full card
				CurrentCard.dataset.normalImage = cardData.image_uris.normal;
			} else {
				console.error("Failed to fetch from Scryfall, falling back to Multiverse");
				GameSystem.UseScryfall = false;
				CurrentCard.src = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + GameSystem.MultiverseId +"&type=card";
			}
		} catch (error) {
			console.error("Error fetching from Scryfall:", error);
			GameSystem.UseScryfall = false;
			CurrentCard.src = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + GameSystem.MultiverseId +"&type=card";
		}
	} else {
		console.log(`Showing card: ${selectedCard.Name} multiverse id: ${selectedCard.MultiverseId}`);
		// e.g. https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4082&type=card
		CurrentCard.src = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + GameSystem.MultiverseId +"&type=card";
	}
}

function CardFailedToLoad() {
	SetState(STATE_LOADINGCARD)
}

function CardLoaded()
{
	HideSpinner();
	// draw partial card since this is the first time its been loaded
	console.log("New card image loaded, displaying partial");

	if(GameSystem.State === STATE_LOADINGCARD) {
		
		if (GameSystem.UseScryfall) {
			// For Scryfall, the art_crop image is already cropped
			// Draw it in the artwork area of the card
			DrawBlank();
			
			// Position the art_crop where artwork typically appears on a Magic card
			// Standard card dimensions and artwork position
			let artworkX = 27;  // X position where artwork starts
			let artworkY = 31;  // Y position where artwork starts
			let artworkWidth = 169;  // Width of artwork area
			let artworkHeight = 136;  // Height of artwork area
			
			// Check if pack has custom offsets
			let p = GameSystem.Pack;
			if (p.OffsetX1 !== undefined) {
				artworkX = p.OffsetX1;
				artworkY = p.OffsetY1;
				artworkWidth = p.OffsetX2 - p.OffsetX1 + 1;
				artworkHeight = p.OffsetY2 - p.OffsetY1 + 1;
			}
			
			// Draw the Scryfall art_crop image in the artwork area
			MtgContext.drawImage(CurrentCard, 0, 0, CurrentCard.width, CurrentCard.height, 
				artworkX, artworkY, artworkWidth, artworkHeight);
		} else {
			// Original Multiverse cropping logic
			let sx, sy, sw, sh, dx, dy, dw, dh;
			sx = 27;
			sy = 31;
			sw = 169;
			sh = 136;
			dx = 27;
			dy = 31;
			dw = 169;
			dh = 136;
			let p = GameSystem.Pack;
			if (p.OffsetX1 !== undefined) {
				dx = sx = p.OffsetX1;
				dy = sy = p.OffsetY1;
				dw = sw = p.OffsetX2 - p.OffsetX1 + 1;
				dh = sh = p.OffsetY2 - p.OffsetY1 + 1;
			}
			
			MtgContext.drawImage(CurrentCard, sx, sy, sw, sh, dx, dy, dw, dh);
		}
		
		SetState(STATE_WAITFORGUESS);
	}

}

/**
 * @param {JQuery} jQueryEl - The jQuery element
 * @param {string|string[]} [removedClasses] - Classes to remove
 * @param {string|string[]} [addedClasses] - Classes to add
 */
function ToggleClasses(jQueryEl, removedClasses, addedClasses)
{
	if(removedClasses !== undefined) {
		if (!Array.isArray(removedClasses))
			removedClasses = [removedClasses];

		for (let a of removedClasses)
			jQueryEl.removeClass(a);
	}

	if(addedClasses !== undefined) {
		if (!Array.isArray(addedClasses))
			addedClasses = [addedClasses];

		for (let a of addedClasses)
			jQueryEl.addClass(a);
	}
}