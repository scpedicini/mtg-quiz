var MtgCanvas;
var MtgContext;
var BlankCard;
var CurrentCard;

// TODO Commander 2019 series cards are too large
// We may need to consider either "scaling" the card as it comes in or something else

var bloodhoundInstance = new Bloodhound({
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
const STATE_READY = "STATE_READY";

// User can press "next card" to see next card
const STATE_GOTONEXTCARD = "STATE_GOTONEXTCARD";

const STATE_SHOWCARD = "STATE_SHOWCARD";

const GameSystem =
{
	"LastTime": 0,
	"Timer": 0,
	"MaxSeconds": 10,
	"CorrectCard": "",
	"MultiverseId": 0,
	"State": STATE_NA,
	"Pack": undefined,
	"TotalAnswered": 0,
	"TotalCorrect": 0,
};

document.addEventListener('DOMContentLoaded', Initialize)
function Initialize()
{
	document.getElementById('spinner').hidden = true;

	MtgCanvas = document.getElementById('MtgCanvas');
	MtgContext = MtgCanvas.getContext('2d');

	$(".typeahead").typeahead({
			minLength: 3,
			highlight: true,
			hint: true,
		},
		{
			name: 'cards',
			source: bloodhoundInstance,
		});

	BlankCard = new Image();
	CurrentCard = new Image();

	$(BlankCard).one('load', function() {
		console.log("Blank Card loaded");
		DrawBlank();
	});

	// same as CurrentCard.onload = function()
	$(CurrentCard).on('load',() => CardLoaded());


	BlankCard.src = "assets/BlankCard-Smaller.png";

	let userInput = $('#UserInput');
	// Check the user input to see if they are correct
	userInput.on('input',  (e) => CheckCorrect(e))
		.on('typeahead:selected', (e, datum) => CheckCorrect(e))
		.on('typeahead:autocompleted', (e, datum) => CheckCorrect(e));

	userInput.on('keypress', (e) => InputKeypress(e))


	// add the elements
	$.each(AvailableEditions, function(i, v)
	{
		$('<option />', {
			value: v.Edition,
			text: v.Edition,
		}).appendTo($('#EditionBox'));
	});

	$('#ActionBtn').on('click', () => ButtonPressed());

	let editionBox =$(`#EditionBox`);

	editionBox.on('change', (e) => LoadEdition(e.target.value));

	let edName = AvailableEditions[Math.floor(Math.random() * AvailableEditions.length)].Edition;
	editionBox.val(edName);

	LoadEdition(edName);
}

function SetState(state)
{
	GameSystem.State = state;
	console.log("Transitioning to " + state);
	ConfigureButton();


	if(state === STATE_LOADINGCARD) {
		// show the spinner
		SetValid();
		DrawBlank();
		ShowSpinner();
		ShowNewCard();
	}
	else if(state === STATE_WAITFORGUESS) {
		// start the progress bar
		let pbar = $('.progress-bar');
		pbar.removeClass('progress-bar-elapsing')
		pbar.addClass('progress-bar-full');

		pbar.css('width', '100%')

		pbar.removeClass('progress-bar-full')
		pbar.addClass('progress-bar-elapsing');

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
		btn.text("Give Up!");
	}
	else if(GameSystem.State === STATE_READY) {
		btn.text("Play!");
	}
	else if(GameSystem.State === STATE_GOTONEXTCARD) {
		btn.text('Next Card!');
	}
	else if(GameSystem.State === STATE_LOADINGCARD) {
		btn.text('Wait');
	}

}



function ShowSpinner()
{
	let spinner = $(`#spinner`);
	spinner.removeClass('rotate');
	document.getElementById('spinner').hidden = false;
	spinner.css('left', MtgCanvas.getBoundingClientRect().left + 50)
	spinner.css('top', MtgCanvas.getBoundingClientRect().top + 40)
	setTimeout( () => spinner.addClass('rotate'), 100);
}

function HideSpinner()
{
	let spinner = $(`#spinner`);
	document.getElementById('spinner').hidden = true;
	spinner.removeClass('rotate');
}


async function LoadEdition(editionName)
{
	DrawBlank();
	ShowSpinner();
	GameSystem.State = STATE_LOADINGEDITION;
	let edition = AvailableEditions.find(c => c.Edition === editionName);

	let cardJsonFile = "cards/" + edition.Filename;

	let response = await fetch(cardJsonFile);
	let pack = JSON.parse(await response.text());
	GameSystem.Pack = pack;

	// TODO allow for removal of apostrophes or possibly when typing them they aren't included
	let suggestions = pack.Cards.map(p => p.Name);

	bloodhoundInstance.clear();
	bloodhoundInstance.clearPrefetchCache();
	bloodhoundInstance.clearRemoteCache();
	bloodhoundInstance.local = suggestions;
	bloodhoundInstance.initialize(true);

	$('.tt-menu')?.remove();



	SetState(STATE_READY);
	HideSpinner();
}


function StartTimer()
{
	GameSystem.LastTime = Date.now();
	GameSystem.Timer = GameSystem.MaxSeconds;
	TimerCallback();
}

function SetTimerProgressBarToFull()
{
	let pbar = $('.progress-bar');
	pbar.removeClass('progress-bar-elapsing')
	pbar.addClass('progress-bar-full');

	setTimeout(pbar.css('width', '100%'), 0);

	// pbar.removeClass('progress-bar-full')
	// pbar.addClass('progress-bar-elapsing');
}

function TimerCallback()
{
	let now = Date.now();
	let elapsed = ( now - GameSystem.LastTime ) / 1000.0;
	GameSystem.LastTime = now;
	GameSystem.Timer -= elapsed;

	let width = ( Math.max(0, GameSystem.Timer / GameSystem.MaxSeconds) * 100 );
	let pbar = $('.progress-bar');
	pbar.width( `${width}%`);

	if(GameSystem.Timer <= 0 && pbar.width() <= 0) {
		ShowCorrect();
	}
	else if(GameSystem.State === STATE_WAITFORGUESS) {
		setTimeout(TimerCallback, 50);
	}
}



function InputKeypress(e, f, g)
{
	if(e.originalEvent.key === "Enter" && GameSystem.State === STATE_GOTONEXTCARD)
	{
		SetState(STATE_LOADINGCARD);
	}
}

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



function ShowCorrect()
{
	MtgContext.clearRect(0, 0, MtgCanvas.width, MtgCanvas.height);
	MtgContext.drawImage(CurrentCard, 0, 0, MtgCanvas.width, MtgCanvas.height);
	GameSystem.TotalAnswered++;
	SetState(STATE_GOTONEXTCARD);

	$(`#UserInput`).val(GameSystem.CorrectCard);
}


function DrawBlank()
{
	MtgContext.clearRect(0, 0, MtgCanvas.width, MtgCanvas.height);
	MtgContext.drawImage(BlankCard, 0, 0);
}

// Clears out the context
function ShowNewCard()
{
	let userInput = $('#UserInput');
	userInput.val('');

	// find the right GameSystem.CardPacks which has the matching Edition
	let cards = GameSystem.Pack.Cards;
	console.log("Number of cards: " + cards.length);

	let index = Math.floor(Math.random() * cards.length);

	console.log(`Showing card: ${cards[index].Name}`);

	GameSystem.CorrectCard = cards[index].Name.trim();
	GameSystem.MultiverseId = cards[index].MultiverseId;

	CurrentCard.src = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + GameSystem.MultiverseId +"&type=card";

	userInput.focus();
}

function CardLoaded()
{
	HideSpinner();
	// draw partial card since this is the first time its been loaded
	console.log("New card image loaded, displaying partial");
	MtgContext.drawImage(CurrentCard, 27, 31, 169, 136, 27, 31, 169, 136 );
	SetState( STATE_WAITFORGUESS );

}