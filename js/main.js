var MtgCanvas;
var MtgContext;
var BlankCard;
var CurrentCard;

var bloodhoundInstance = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.whitespace,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	local: [
		'Alabama',
		'Alaska',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'Florida',
		'Georgia'
	]
});

bloodhoundInstance.initialize(true);

document.addEventListener('DOMContentLoaded', Initialize)


const STATE_LOADING = "STATE_LOADING";
const STATE_WAITFORGUESS = "STATE_WAITFORGUESS";
const STATE_MENU = "STATE_MENU";
const STATE_GOTONEXTCARD = "STATE_GOTONEXTCARD";
const STATE_SHOWCARD = "STATE_SHOWCARD";

const GameSystem =
{
	"LastTime": 0,
	"Timer": 0,
	"MaxSeconds": 10,
	"CorrectCard": "",
	"MultiverseId": 0,
	"State": STATE_MENU,
	"Edition": ""
};

function ConfigureButton()
{
	let btn = $('#ActionBtn');

	if(GameSystem.State === STATE_WAITFORGUESS) {
		btn.text("Give Up!");
	}
	else if(GameSystem.State === STATE_MENU) {
		btn.text("Play!");
	}

}

function SetEdition(edition)
{
	let pack = CardPacks.find(c => c.Edition === edition);

	// TODO allow for removal of apostrophes or possibly when typing them they aren't included
	let suggestions = pack.Cards.map(p => p.Name);

	bloodhoundInstance.clear();
	bloodhoundInstance.clearPrefetchCache();
	bloodhoundInstance.clearRemoteCache();
	bloodhoundInstance.local = suggestions;
	bloodhoundInstance.initialize(true);

	$('.tt-menu')?.remove();

	GameSystem.Edition = $('#EditionBox').val();
}

function StartTimer()
{
	GameSystem.LastTime = Date.now();
	GameSystem.Timer = GameSystem.MaxSeconds;
	TimerCallback();
}

function TimerCallback()
{
	let now = Date.now();
	let elapsed = ( now - GameSystem.LastTime ) / 1000.0;
	GameSystem.LastTime = now;
	GameSystem.Timer -= elapsed;

	let width = Math.round( Math.max(0, GameSystem.Timer / GameSystem.MaxSeconds) * 100 );
	document.getElementsByClassName('progress-bar')[0].setAttribute('style', `width: ${width}%`);

	if(GameSystem.Timer <= 0) {

	}
	else {
		setTimeout(TimerCallback, 100);
	}
}

function Initialize()
{

	$(".typeahead").typeahead({
		minLength: 3,
		highlight: true,
		hint: true,
	},
	{
		name: 'cards',
		source: bloodhoundInstance,
	});

	// $('.tt-dropdown-menu').css('display', 'none')

	//
	// $('#scrollable-dropdown-menu .typeahead').typeahead(null, {
	// 	name: 'states',
	// 	limit: 10,
	// 	source: states
	// });

	BlankCard = new Image();
	CurrentCard = new Image();

	$(BlankCard).one('load', function() {
		console.log("Blank Card loaded");
		ShowNewCard();
	});

	// same as CurrentCard.onload = function()
	$(CurrentCard).on('load', function() {
		// draw partial card since this is the first time its been loaded
		console.log("New card image loaded, displaying partial");
		MtgContext.drawImage(CurrentCard, 27, 31, 169, 136, 27, 31, 169, 136 );


	});

	BlankCard.src = "assets/BlankCard.png";

	MtgCanvas = document.getElementById('MtgCanvas');
	MtgContext = MtgCanvas.getContext('2d');

	// Check the user input to see if they are correct
	$('#UserInput').on('input',  (e) => CheckCorrect(e))
		.on('typeahead:selected', (e, datum) => CheckCorrect(e))
		.on('typeahead:autocompleted', (e, datum) => CheckCorrect(e));

	// add the elements
	$.each(CardPacks, function(i, v)
	{
		$('<option />', {
			value: v.Edition,
			text: v.Edition
		}).appendTo($('#EditionBox'));

	});

	SetEdition($('#EditionBox').val());

	$('#GiveUpBtn').click(function() {
		if(GameSystem.State === STATE_GOTONEXTCARD)
		{
			GameSystem.State = STATE_WAITFORGUESS;
			$('#GiveUpBtn').text("Give Up!");
			ShowNewCard();
		}
		else
		{
			ShowCorrect();
		}
	});

}

function CheckCorrect(e)
{
	let inputValue = e.target.value.trim().toUpperCase();
	console.log("Checking: " + inputValue);
	if(inputValue === GameSystem.CorrectCard)
	{
		ShowCorrect();
	}
}

function ShowCorrect()
{
	MtgContext.clearRect(0, 0, MtgCanvas.width, MtgCanvas.height);
	MtgContext.drawImage(CurrentCard, 0, 0);

	// change a tag text to be show next card	
	GameSystem.State = STATE_GOTONEXTCARD;
	$('#GiveUpBtn').text("New Card!");
}

function SetState(state)
{
	GameSystem.State = state;
	console.log("Transitioning to " + state);
}

// Clears out the context
function ShowNewCard()
{
	console.log("ShowNewCard");
	$('#UserInput').val('');
    MtgContext.clearRect(0, 0, MtgCanvas.width, MtgCanvas.height);
	MtgContext.drawImage(BlankCard, 0, 0);
	
	// get selected value from EditionBox
	let edition = $('#EditionBox').val();
	
	
	// find the right GameSystem.CardPacks which has the matching Edition
	let results = $.grep(CardPacks, function(v) { return v.Edition === edition; } );
	
	if(results.length !== 0)
	{
		let cards = results[0].Cards;
		console.log("Found card pack");
		console.log("Number of cards: " +cards.length);
		
		let index = Math.floor(Math.random() * cards.length);

		console.log(`Showing card: ${cards[index].Name}`);

		GameSystem.CorrectCard = cards[index].Name.trim().toUpperCase();
		GameSystem.MultiverseId = cards[index].MultiverseId;
		
		CurrentCard.src = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + GameSystem.MultiverseId +"&type=card";
		
	}
	
}
