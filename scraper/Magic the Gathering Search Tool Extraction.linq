<Query Kind="Program">
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>System.Net</Namespace>
</Query>

/******* MTG Picture Finder ***********/

#region Fourth Edition Card List name|color(Blue, White, Artifact, Red, Black, Green)

string fourthEditionCards = @"Abomination|Black
Air Elemental|Blue
Alabaster Potion|White
Aladdin's Lamp|Artifact
Aladdin's Ring|Artifact
Ali Baba|Red
Amrou Kithkin|White
Amulet of Kroog|Artifact
Angry Mob|White
Animate Artifact|Blue
Animate Dead|Black
Animate Wall|White
Ankh of Mishra|Artifact
Apprentice Wizard|Blue
Armageddon|White
Armageddon Clock|Artifact
Ashes to Ashes|Black
Ashnod's Battle Gear|Artifact
Aspect of Wolf|Green
Backfire|Blue
Bad Moon|Black
Balance|White
Ball Lightning|Red
Battering Ram|Artifact
Benalish Hero|White
Bird Maiden|Red
Birds of Paradise|Green
Black Knight|Black
Black Mana Battery|Artifact
Black Vise|Artifact
Black Ward|White
Blessing|White
Blight|Black
Blood Lust|Red
Blue Elemental Blast|Blue
Blue Mana Battery|Artifact
Blue Ward|White
Bog Imp|Black
Bog Wraith|Black
Bottle of Suleiman|Artifact
Brainwash|White
Brass Man|Artifact
Bronze Tablet|Artifact
Brothers of Fire|Red
Burrowing|Red
Carnivorous Plant|Green
Carrion Ants|Black
Castle|White
Cave People|Red
Celestial Prism|Artifact
Channel|Green
Chaoslace|Red
Circle of Protection: Artifacts|White
Circle of Protection: Black|White
Circle of Protection: Blue|White
Circle of Protection: Green|White
Circle of Protection: Red|White
Circle of Protection: White|White
Clay Statue|Artifact
Clockwork Avian|Artifact
Clockwork Beast|Artifact
Cockatrice|Green
Colossus of Sardia|Artifact
Conservator|Artifact
Control Magic|Blue
Conversion|White
Coral Helm|Artifact
Cosmic Horror|Black
Counterspell|Blue
Craw Wurm|Green
Creature Bond|Blue
Crimson Manticore|Red
Crumble|Green
Crusade|White
Crystal Rod|Artifact
Cursed Land|Black
Cursed Rack|Artifact
Cyclopean Mummy|Black
Dancing Scimitar|Artifact
Dark Ritual|Black
Death Ward|White
Deathgrip|Black
Deathlace|Black
Desert Twister|Green
Detonate|Red
Diabolic Machine|Artifact
Dingus Egg|Artifact
Disenchant|White
Disintegrate|Red
Disrupting Scepter|Artifact
Divine Transformation|White
Dragon Whelp|Red
Drain Life|Black
Drain Power|Blue
Drudge Skeletons|Black
Durkwood Boars|Green
Dwarven Warriors|Red
Earth Elemental|Red
Earthquake|Red
Ebony Horse|Artifact
El-Hajjaj|Black
Elder Land Wurm|White
Elven Riders|Green
Elvish Archers|Green
Energy Flux|Blue
Energy Tap|Blue
Erg Raiders|Black
Erosion|Blue
Eternal Warrior|Red
Evil Presence|Black
Eye for an Eye|White
Fear|Black
Feedback|Blue
Fellwar Stone|Artifact
Fire Elemental|Red
Fireball|Red
Firebreathing|Red
Fissure|Red
Flashfires|Red
Flight|Blue
Flood|Blue
Flying Carpet|Artifact
Fog|Green
Force of Nature|Green
Fortified Area|White
Frozen Shade|Black
Fungusaur|Green
Gaea's Liege|Green
Gaseous Form|Blue
Ghost Ship|Blue
Giant Growth|Green
Giant Spider|Green
Giant Strength|Red
Giant Tortoise|Blue
Glasses of Urza|Artifact
Gloom|Black
Goblin Balloon Brigade|Red
Goblin King|Red
Goblin Rock Sled|Red
Grapeshot Catapult|Artifact
Gray Ogre|Red
Greed|Black
Green Mana Battery|Artifact
Green Ward|White
Grizzly Bears|Green
Healing Salve|White
Helm of Chatzuk|Artifact
Hill Giant|Red
Holy Armor|White
Holy Strength|White
Howl from Beyond|Black
Howling Mine|Artifact
Hurkyl's Recall|Blue
Hurloon Minotaur|Red
Hurr Jackal|Red
Hurricane|Green
Hypnotic Specter|Black
Immolation|Red
Inferno|Red
Instill Energy|Green
Iron Star|Artifact
Ironclaw Orcs|Red
Ironroot Treefolk|Green
Island Fish Jasconius|Blue
Island Sanctuary|White
Ivory Cup|Artifact
Ivory Tower|Artifact
Jade Monolith|Artifact
Jandor's Saddlebags|Artifact
Jayemdae Tome|Artifact
Jump|Blue
Junun Efreet|Black
Karma|White
Keldon Warlord|Red
Killer Bees|Green
Kismet|White
Kormus Bell|Artifact
Land Leeches|Green
Land Tax|White
Leviathan|Blue
Ley Druid|Green
Library of Leng|Artifact
Lifeforce|Green
Lifelace|Green
Lifetap|Blue
Lightning Bolt|Red
Living Artifact|Green
Living Lands|Green
Llanowar Elves|Green
Lord of Atlantis|Blue
Lord of the Pit|Black
Lost Soul|Black
Lure|Green
Magical Hack|Blue
Magnetic Mountain|Red
Mahamoti Djinn|Blue
Mana Clash|Red
Mana Flare|Red
Mana Short|Blue
Mana Vault|Artifact
Manabarbs|Red
Marsh Gas|Black
Marsh Viper|Green
Meekstone|Artifact
Merfolk of the Pearl Trident|Blue
Mesa Pegasus|White
Millstone|Artifact
Mind Bomb|Blue
Mind Twist|Black
Mishra's War Machine|Artifact
Mons's Goblin Raiders|Red
Morale|White
Murk Dwellers|Black
Nafs Asp|Green
Nether Shadow|Black
Nevinyrral's Disk|Artifact
Nightmare|Black
Northern Paladin|White
Obsianus Golem|Artifact
Onulet|Artifact
Orcish Artillery|Red
Orcish Oriflamme|Red
Ornithopter|Artifact
Osai Vultures|White
Paralyze|Black
Pearled Unicorn|White
Personal Incarnation|White
Pestilence|Black
Phantasmal Forces|Blue
Phantasmal Terrain|Blue
Phantom Monster|Blue
Piety|White
Pikemen|White
Pirate Ship|Blue
Pit Scorpion|Black
Plague Rats|Black
Power Leak|Blue
Power Sink|Blue
Power Surge|Red
Pradesh Gypsies|Green
Primal Clay|Artifact
Prodigal Sorcerer|Blue
Psionic Entity|Blue
Psychic Venom|Blue
Purelace|White
Pyrotechnics|Red
Radjan Spirit|Green
Rag Man|Black
Raise Dead|Black
Rebirth|Green
Red Elemental Blast|Red
Red Mana Battery|Artifact
Red Ward|White
Regeneration|Green
Relic Bind|Blue
Reverse Damage|White
Righteousness|White
Rod of Ruin|Artifact
Royal Assassin|Black
Samite Healer|White
Sandstorm|Green
Savannah Lions|White
Scathe Zombies|Black
Scavenging Ghoul|Black
Scryb Sprites|Green
Sea Serpent|Blue
Seeker|White
Segovian Leviathan|Blue
Sengir Vampire|Black
Serra Angel|White
Shanodin Dryads|Green
Shapeshifter|Artifact
Shatter|Red
Shivan Dragon|Red
Simulacrum|Black
Sindbad|Blue
Siren's Call|Blue
Sisters of the Flame|Red
Sleight of Mind|Blue
Smoke|Red
Sorceress Queen|Black
Soul Net|Artifact
Spell Blast|Blue
Spirit Link|White
Spirit Shackle|Black
Stasis|Blue
Steal Artifact|Blue
Stone Giant|Red
Stone Rain|Red
Stream of Life|Green
Sunglasses of Urza|Artifact
Sunken City|Blue
Swords to Plowshares|White
Sylvan Library|Green
Tawnos's Wand|Artifact
Tawnos's Weaponry|Artifact
Tempest Efreet|Red
Terror|Black
Tetravus|Artifact
The Brute|Red
The Hive|Artifact
The Rack|Artifact
Thicket Basilisk|Green
Thoughtlace|Blue
Throne of Bone|Artifact
Timber Wolves|Green
Time Elemental|Blue
Titania's Song|Green
Tranquility|Green
Triskelion|Artifact
Tsunami|Green
Tundra Wolves|White
Tunnel|Red
Twiddle|Blue
Uncle Istvan|Black
Unholy Strength|Black
Unstable Mutation|Blue
Unsummon|Blue
Untamed Wilds|Green
Urza's Avenger|Artifact
Uthden Troll|Red
Vampire Bats|Black
Venom|Green
Verduran Enchantress|Green
Visions|White
Volcanic Eruption|Blue
Wall of Air|Blue
Wall of Bone|Black
Wall of Brambles|Green
Wall of Dust|Red
Wall of Fire|Red
Wall of Ice|Green
Wall of Spears|Artifact
Wall of Stone|Red
Wall of Swords|White
Wall of Water|Blue
Wall of Wood|Green
Wanderlust|Green
War Mammoth|Green
Warp Artifact|Black
Water Elemental|Blue
Weakness|Black
Web|Green
Whirling Dervish|Green
White Knight|White
White Mana Battery|Artifact
White Ward|White
Wild Growth|Green
Will-O'-The-Wisp|Black
Winds of Change|Red
Winter Blast|Green
Winter Orb|Artifact
Wooden Sphere|Artifact
Word of Binding|Black
Wrath of God|White
Xenic Poltergeist|Black
Yotian Soldier|Artifact
Zephyr Falcon|Blue
Zombie Master|Black
";
#endregion


string FetchPageHtml(string uri)
{
	string htmldata = null;
	using (var wc = new WebClient())
	{
		wc.Encoding = Encoding.UTF8;
		htmldata = wc.DownloadString(uri);
	}
	
	return htmldata;
}

List<Card> GetCardsFromWizardDatabase(string edition)
{
	var cards = new List<Card>();
	var wizardsSearchTemplate = @"http://gatherer.wizards.com/Pages/Search/Default.aspx?output=checklist&set=[%22{0}%22]";
	var pattern = @"\<a class=""nameLink"" href="".*multiverseid=(\d+).*?\>(.+?)\<";

	// Tenth%20Edition
	edition = edition.Trim().Replace(" ", "%20");
	var uri = string.Format(wizardsSearchTemplate, edition);

	var htmldata = FetchPageHtml(uri);

	var pages = new[] { uri }.ToList();
	if (Regex.Match(htmldata, @"<div class=""pagingcontrols"">.*?</div>") is var pagingcontrols && pagingcontrols.Success && Regex.Matches(pagingcontrols.Value, @"href=""(?<page>.*?)""") is MatchCollection pagematches && pagematches.Count > 0)
	{
		pages = pagematches.Cast<Match>().Select(m => "https://gatherer.wizards.com" + WebUtility.HtmlDecode(m.Groups["page"].Value)).Distinct().ToList();
	}

	for (int i = 0; i < pages.Count; i++)
	{
		if (i != 0) htmldata = FetchPageHtml(pages[i]);

		var matches = Regex.Matches(htmldata, pattern, RegexOptions.IgnoreCase);
		foreach (Match match in matches)
		{
			cards.Add(new Card(match.Groups[2].Value.Trim(), Convert.ToInt32(match.Groups[1].Value.Trim())));
			//Debug.WriteLine($"Added card {cards.Last().Name} with multiverse {cards.Last().MultiverseId}");
		}
	}

	// if we have cards with duplicate multiverse ids - it is likely that this card contains graphical variants
	Debug.WriteLine($"Cards found: {cards.Count}");
	cards = cards.GroupBy(c => c.MultiverseId).Select(c => c.First()).ToList();
	Debug.WriteLine($"Reduced to: {cards.Count}");

	return cards;
}

// unused
void GetAllCardNamesFromEdition()
{
	// Magic the Gathering Card Format Stripper
	var cardDetailedUri = @"http://www.wizards.com/Magic/generic/cardlists/Fourth_Edition.txt";
	string allCards = null;
	
	using(var wc = new WebClient()) { allCards = wc.DownloadString(cardDetailedUri); }
	
	var testdata = @"
	
	Card Title:	Stream of Life
	Color:		Green
	Card Type:	Sorcery
	Cost:		XG
	Pow/Tgh:	n/a
	Card Text:	Target player gains X life.
	Artist:		Mark Poole
	Rarity:		Common 1
	
	Card Title:	Strip Mine
	Color:		Land
	Card Type:	Land
	Cost:		n/a
	Pow/Tgh:	n/a
	Card Text:	TAP: Add 1 colorless mana to your mana pool.
			TAP: Sacrifice Strip Mine to destroy target land.
	Artist:		Daniel Gelon
	Rarity:		Uncommon 1
	";
	
	//var pattern = @"Card Title\:(.*?)\r\nColor\:(.*?)$";
	var pattern = @"Card Title\:([^\r]*?)\rColor\:([^\r]*)";
	
	MatchCollection  matches = Regex.Matches(allCards, pattern, RegexOptions.Singleline);
	Console.WriteLine("Total matches: {0}", new object [] { matches.Count });
	
	foreach(Match match in matches)
	{
		var cardName = match.Groups[1].Value.Trim(); // Regex.Replace(match.Groups[1].Value.Trim(), @"\(.*?\)", string.Empty);
		var color = match.Groups[2].Value.Trim();
		if(!color.Equals("Land", StringComparison.OrdinalIgnoreCase))
			Console.WriteLine(cardName + "|" + color);
	}


}

// unused
int GetMultiverseId(string cardName, string color)
{
	// http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[giant]+[growth]&color=[G]&set=[%22Fourth%20Edition%22]
	// http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=2215&type=card
	string[] colorReplacement = new string[] {
		"Blue", "U",
		"White", "W",
		"Green", "G",
		"Red", "R",
		"Black", "B",
		"Artifact", "",
	};

	// +[giant]+[growth]
	// var searchTemplateUri = @"http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[giant]+[growth]&set=[%22Fourth%20Edition%22]";
	// U - Blue, W - White, G - Green, B - Black, R - Red; Numbers - Colorless 
	var searchTemplateUri = @"http://gatherer.wizards.com/Pages/Search/Default.aspx?name={0}&color=[{1}]&set=[%22Fourth%20Edition%22]";
	
	// +[Giant]+[Growth]
	
    int multiverseId = -1;
	
	//var paramCardName = string.Join(string.Empty, cardName.Trim().Split(' ').Select (n => string.Concat("+[", n, "]")));
	var paramCardName = string.Concat("+[%22", cardName.Trim().Replace(" ", "%20"), "%22]");
	// +[%22Ankh%20of%20Mishra%22]
	
	var index = 0;
	var paramColor = (index = Array.FindIndex(colorReplacement, w => w.Equals(color))) > -1 ? colorReplacement[index+1] : color;
	
	//Console.WriteLine("Final Query string"
	string searchUri = string.Format(searchTemplateUri, paramCardName, paramColor);
	
	//Console.WriteLine("Querying: {0}", new string[] { searchUri });
	HttpWebRequest request = (HttpWebRequest) HttpWebRequest.Create(searchUri);
	using(HttpWebResponse response = (HttpWebResponse) request.GetResponse())
	{
		if(response.StatusCode == HttpStatusCode.OK)
		{
			// multiverseid=2215
			Match match = Regex.Match( response.ResponseUri.AbsoluteUri, @"multiverseid=(\d+)", RegexOptions.IgnoreCase );
			multiverseId = match.Success ? Convert.ToInt32(match.Groups[1].Value) : -1;
		}
		else
		{
			Console.WriteLine("Failed to get multiverse code for card {0}", new string[] { cardName });
		}
	}
	
	return multiverseId;
}

class CardPack
{
	public string Edition { get; set; }
	public List<Card> Cards { get; set; }
	
	public CardPack(string edition, List<Card> cards )
	{
		Edition = edition;
		Cards = cards;
	}
	
	public string ToJson() { return JsonConvert.SerializeObject(this); }
}

class Card
{
	public string Name { get; set; }
	public int MultiverseId { get; set; }
	
	public Card(string name, int mid) { Name = name; MultiverseId = mid; }
}

void CreateJson(IEnumerable<Card> cards)
{
	JObject topObject = new JObject();
	var json = JsonConvert.SerializeObject(cards);
	json.Dump();

}

class EditionFile
{
	public string Edition { get; set; }
	public string Filename { get; set; }
}

void SeparatePacksIntoFiles(string workingpath, string alljson)
{
	
	var cardpacks = JsonConvert.DeserializeObject<List<CardPack>>(alljson);
	
	var editionlist = new List<EditionFile>();
	
	foreach(var pack in cardpacks)
	{
		var basename = Regex.Replace(pack.Edition, "[#@/:]", string.Empty).Trim() + ".json";
		var edfile = new EditionFile { Edition = pack.Edition, Filename = basename };
		editionlist.Add(edfile);
		
		// create respective file
		File.WriteAllText(Path.Combine(workingpath, basename), JsonConvert.SerializeObject(pack), Encoding.UTF8);
		
	}

	File.WriteAllText(Path.Combine(workingpath, "available_editions.json"), JsonConvert.SerializeObject(editionlist), Encoding.UTF8);



	// create file called edition_files.json which contains Edition, and Filename
}

void Main()
{
	// Given a card name, find the multiverseid which gets the picture
	
	// http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[giant]+[growth]&set=[%22Fourth%20Edition%22]
	// http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=2215
	var cards = new List<Card>();

	// spit out in the following manner Name\tMultiverse Id
//	foreach(var card in fourthEditionCards.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries) )
//	{
//		var cardName = card.Split('|')[0];
//		var color = card.Split('|')[1];
//		var id = GetMultiverseId(cardName, color);
//		Console.WriteLine(string.Concat(cardName, ", ", id));
//		cards.Add(new Card(cardName, id));
//	}
//	
	//var fourthEditionCardPack = new CardPack("Fourth Edition", cards);
	//fourthEditionCardPack.ToJson().Dump();
	
	// Unglued, Fourth Edition, Zendikar Rising
	
	
	// go through all editions
	
	
	
	var workingpath = @"D:\Data\Creations\Programming\Javascript\MTG Guesser\scraper";
	
	var alltext = File.ReadAllText(Path.Combine(workingpath, "cardpacks.json"), Encoding.UTF8);
	SeparatePacksIntoFiles(workingpath, alltext);
	
	
	
	return;
	
	var cardpacks = new List<CardPack>();
	var editions = File.ReadAllLines(Path.Combine(workingpath, "editions.txt")).Select(f => f.Trim());
	//editions = editions.Take(2);
	foreach (var edition in editions)
	{
		Console.WriteLine($"Scrapping {edition}");
		try
		{
			var cardpack = new CardPack(edition, GetCardsFromWizardDatabase(edition));
			cardpacks.Add(cardpack);
		}
		catch(Exception ex) {
			Console.WriteLine(ex.Message);
		}
		//cardpack.Cards.Count().Dump();
		//cardpack.ToJson().Dump();
	}
	
	var json = JsonConvert.SerializeObject(cardpacks);
	File.WriteAllText(Path.Combine(workingpath, "cardpacks.json"), json, Encoding.UTF8);
	
	
	
	
}

// Define other methods and classes here
