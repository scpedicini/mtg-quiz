var MtgCanvas;
var MtgContext;
var BlankCard;
var CurrentCard;

$(document).ready(function() {

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
	$('#UserInput').on('input', function() {
		var inputValue = this.value.trim().toUpperCase();
		if(inputValue === GameFiles.CorrectCard)
		{
			ShowCorrect();
		}
	});


	// add the elements
	$.each(GameFiles.CardPacks, function(i, v)
	{
		$('<option />', { 
			value: v.Edition,
			text: v.Edition
		}).appendTo($('#EditionBox'));
			
	});
	
	$('a#GiveUpBtn').click(function() {
		if(GameFiles.State === "GotoNextCard")
		{
			GameFiles.State = "WaitForGuess";	
			$('a#GiveUpBtn').text("Give Up!");
			ShowNewCard();
		}
		else
		{
			ShowCorrect();
		}
	});

});


var ShowCorrect = function() {
	MtgContext.clearRect(0, 0, MtgCanvas.width, MtgCanvas.height);
	MtgContext.drawImage(CurrentCard, 0, 0);

	// change a tag text to be show next card	
	GameFiles.State = "GotoNextCard";
	$('a#GiveUpBtn').text("New Card!");
};

// Clears out the context
var ShowNewCard = function() { 
	console.log("ShowNewCard");
	$('#UserInput').val('');
    MtgContext.clearRect(0, 0, MtgCanvas.width, MtgCanvas.height);
	MtgContext.drawImage(BlankCard, 0, 0);
	
	// get selected value from EditionBox
	var edition = $('#EditionBox').val();
	
	
	// find the right GameFiles.CardPacks which has the matching Edition
	var results = $.grep(GameFiles.CardPacks, function(v) { return v.Edition === edition; } );
	
	if(results.length !== 0)
	{
		var cards = results[0].Cards;
		console.log("Found card pack");
		console.log("Number of cards: " +cards.length);
		
		var index = Math.floor(Math.random() * cards.length);
		
		GameFiles.CorrectCard = cards[index].Name.trim().toUpperCase();
		GameFiles.MultiverseId = cards[index].MultiverseId;
		
		CurrentCard.src = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + GameFiles.MultiverseId +"&type=card";
		
	}
	
};
