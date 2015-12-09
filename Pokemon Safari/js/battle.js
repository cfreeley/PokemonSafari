
var habitats = {}; //_location for each pokemon
var condition = 'wary'; // Either wary, angry, or eating
var pokemon, sprite, pokeindex;
var crate = 0, counter = 0, turn = 1, level = 20, tangled = 0;
var iv = Math.floor(Math.random() * 15) + 1;
var trainer = JSON.parse(localStorage.trainer);
var dex = JSON.parse(localStorage.pokedex);
var currentToss = "";
var inKantp = localStorage._location == 'forest' || localStorage._location == 'tunnel' || localStorage._location == 'beach' || localStorage._location == 'city';
var inJohto = localStorage._location == 'park' || localStorage._location == 'glacier' || localStorage._location == 'tower';
var inHoenn = localStorage._location == 'jungle' || localStorage._location == 'sea' || localStorage._location == 'mountain';
var shiny = Math.random() < 0.02;
var cry; var victory; var ssData = {};
var JSONPokedexUrl = chrome.extension.getURL('/js/data.json');
var JSONHabitatsUrl = chrome.extension.getURL('/js/habitats.json');
//var ssData = JSON.parse("data.json");

//for the lazy people and debuggers
// var pokemonFiller = function(lastIndex){
//   var pokedex = JSON.parse(localStorage['pokedex']);
//   for(var i = 1; i<=lastIndex;i++){
//       pokedex[i] = {"name":ssData[i-1].Pokemon, "shiny":false};
//   }
//   localStorage['pokedex'] = JSON.stringify(pokedex);
// };

function getLocation() {
	switch(localStorage._location){
		case 'park':
			_location = 'park';
			break;
		case 'forest' || 'jungle':
			_location = 'forest';
			break;
		case 'glacier' || 'mountain':
			_location = 'glacier';
			break;
		case 'tunnel':
			_location = 'tunnel';
			break;
		case 'beach' || 'sea':
			_location = 'beach';
			break;
		case 'city':
			_location = 'city';
			break;
		case 'tower':
			_location = 'tower';
			break;
		default:
			_location = 'forest';
			break;
		}
	return _location;
}

function initializeVars(){

	var pokemonGenerator = {
		requestPokemon: function() {
			_location = getLocation();
			chrome.browserAction.setIcon({"path":'/images/'+_location + ".png"});
			chrome.browserAction.setPopup({"popup":"/html/menu.html"});
			chrome.notifications.clear("poke", function(){});
			pokeindex = choosePokemon();
			pokemon = ssData[pokeindex-1];

			this.showPokemon();
			this.initBattle();
		},

		showPokemon: function (e) {

		if (localStorage.sound == "on") {
			cry = new Audio(audiofy(pokeindex));
			cry.play();
		}

		var pokemonView = document.getElementById("Pokemon");

		if (dex[pokeindex]) {
			var caught = document.createElement('img');
			caught.src = "/images/caughtSymbol.png";
			caught.id = "symbol";
			document.getElementById("Pokemon").appendChild(caught);
		}

		sprite = urlifyNumber(pokeindex); // Actual sprite
		var pokeName = pokemon.Pokemon;
		var txtNode = document.createTextNode(" Wild " + pokeName.toUpperCase()+" appeared! ");
		if(shiny){
			var cls = pokemonView.getAttribute('class');
			pokemonView.setAttribute('class', cls+' header-shiny');
		}
		pokemonView.appendChild(txtNode);

		pokemonView.appendChild(document.createElement('br'));
		var img = document.createElement('img');
		img.src = sprite;
		img.id = "sprite";
		pokemonView.appendChild(img);
		},

		initBattle: function (e) {

		crate = pokemon.Catch; 

		var options = document.getElementById('Options');
		options.appendChild(createButton('safaributton', 'Safari Ball', throwBall));
		options.appendChild(document.createElement('br'));
		options.appendChild(createButton('baitbutton', 'Bait', throwBait));
		options.appendChild(createButton('rockbutton', 'Rock', throwRock));

		if(trainer.greatballs && trainer.greatballs > 0) {
			options.appendChild(document.createElement('br'));
			options.appendChild(createButton('gbbutton', 'Great Ball (x' + trainer.greatballs + ')', throwGreatBall));
		}

		if(trainer.nets && trainer.nets > 0) {
			if(trainer.greatballs <= 0){
			options.appendChild(document.createElement('br'));
			}
			options.appendChild(createButton('netbutton', 'Net (x' + trainer.nets + ')', throwNet));
		}

		if(trainer.masterballs && trainer.masterballs > 0) {
			if(trainer.greatballs>0 && trainer.nets>0){
			options.appendChild(document.createElement('br'));
			}else if(trainer.greatballs <= 0 || trainer.nets <= 0){
			options.appendChild(document.createElement('br'));
			}
			options.appendChild(createButton('mbbutton', 'Master Ball (x' + trainer.masterballs + ')', throwMasterBall));
		}

		}
	};

	var createButton = function(elementId, elementText, onClick){
		var button = document.createElement('a');
		var div = document.createElement('div');
		div.id = elementId;
		div.setAttribute('class','button');
		div.innerText = elementText;
		div.onclick = onClick;
		button.appendChild(div);
		return button;
	};

	function getSpecialThird(){
		var choices;
		if(_location == 'jungle'){
			choices = [384, 386]; //Rayquaza, Deoxys
			return choices[Math.floor(Math.random() * 2)];
		} else if (_location == 'sea'){
			choices = [380, 381, 384]; //Latias, Latios, Rayquaza
			return choices[Math.floor(Math.random() * 4)];
		} else {
			choices = [386]; //Deoxys 
			return choices[Math.floor(Math.random() * 1)];
		}

		//if none of the above
		return 0;
	}

	var tryForSpecialPokemon = function () {
		if (Math.random() < 0.05) {return 151;}
		else if (_location == 'city' && Math.random() < 0.01) {return 150;}
		else if (Math.random() < 0.05 && inJohto){ 
			return 243 + Math.floor(Math.random() * 3); // Raikou, Entei and Suicune
		}
		else if (Math.random() < 0.05 && inHoenn && _location == 'mountain') { 
			return 377 + Math.floor(Math.random() * 3); // Regirock, Regice, Registeel
		}
		else if (Math.random() < 0.05 && inJohto) {
			return 251; // Celebi
		}
		else if (Math.random() < 0.05 && inHoenn) {
			return 385; // Jirachi
		}
		else if (Math.random() < 0.05 && inHoenn && trainer.zoomlens) {// Zoom Lens Pokemon
			specialThird = getSpecialThird();
			if (specialThird) {return specialThird;}
		}
		else if (Math.random() < 0.01) {return 399;}

		//if none of the above
		return 0;
	};

	var choosePokemon = function() {
		var _location = localStorage._location;
		if (!_location) {_location = "forest";}
		var lst = habitats[_location];
		var trainer = JSON.parse(localStorage.trainer);

		//Special Pokemon alert!
		specialPokemon = tryForSpecialPokemon();
		if(specialPokemon) {return specialPokemon;}

		//if special pokemon was not extracted...
		return lst[Math.floor(Math.random() * lst.length)];
		
	};

	var urlifyNumber = function(e) {
		var s = '' + e;
		while (s.length < 3)
		s = '0' + s;
		if (shiny) {
			if (localStorage.style == '2d')
			return 'http://www.serebii.net/Shiny/BW/' + s + '.png';
			else
			return 'http://www.serebii.net/Shiny/XY/' + s + '.png';
		}
		if (localStorage.style == '2d')
		return 'http://www.serebii.net/blackwhite/pokemon/' + s + '.png';
		else
		return 'http://www.serebii.net/xy/pokemon/' + s + '.png';
	};

	var audiofy = function(e) {
		var s = '' + e;
		while (s.length < 3)
		s = '0' + s;
		return 'http://www.upokecenter.com/images/cries/' + s + 'Cry.mp3';
	};

	var throwGreatBall = 
		function(e) {
		trainer.greatballs -= 1;
		currentToss = 'gb';
		throwBall();
		localStoragetrainer = JSON.stringify(trainer);
		var elem = document.getElementById("gbbutton");
		if (trainer.greatballs <= 0)
			elem.parentNode.removeChild(elem);
		else
			elem.innerText = "Great Ball (x" + trainer.greatballs + ")";
		};

	var throwMasterBall = 
		function(e) {
		trainer.masterballs -= 1;
		currentToss = 'mb';
		throwBall();
		localStorage.trainer = JSON.stringify(trainer);
		var elem = document.getElementById("mbbutton");
		if (trainer.masterballs <= 0)
			elem.parentNode.removeChild(elem);
		else
			elem.innerText = "Master Ball (x" + trainer.masterballs + ")";
		};

	var throwBall = 
		function(e) {
		var resultText;
		if (currentToss == 'gb') 
			resultText = "You threw a Great Ball. ";
		else if (currentToss == 'mb')
			resultText = "You threw a Master Ball! ";
		else
			resultText = "You threw a Safari Ball. ";

		if (isCaught(currentToss)) {
			resultText += "1... 2... 3... Gotcha! " + pokemon.Pokemon + " was caught!";
			var input = document.getElementById('userinput');
			var output = document.getElementById('sysoutput');
			var console = document.getElementById('console');

			input.removeChild(document.getElementById("Options"));
			output.removeChild(document.getElementById("status"));
			
			console.textContent = resultText;
			document.getElementById("turn").textContent = "Turn " + (turn + 1);
			if (!dex[pokeindex]) 
			document.getElementById("caught").textContent = pokemon.Pokemon + " has been added to your Pokedex!";
			document.getElementById("yield").textContent = "Received " + pokemon.EXPV + " PokeDollars!";

			var classes = output.getAttribute('class');
			output.setAttribute('class', classes+' pokemoncaught');

			if (localStorage.sound == 'on') {
			victory = new Audio('http://50.7.60.82:777/ost/pokemon-gameboy-sound-collection/csqodhnibz/108-victory-vs-wild-pokemon-.mp3');
			victory.play();
			}
			recordCapture();
			var d = JSON.parse(localStorage.pokedex);
			if ((Object.keys(d).length) == 75 && !dex[pokeindex]) 
			document.getElementById("safari").textContent = "NEW SAFARI ZONE UNLOCKED!";
		}
		else {
			var letdowns = ["1... Oh.", "1... Hmm.", "1... Ugh.", "1... 2... Darn!", "1... 2... Gah!", "1... 2... Shucks!", "1... 2... 3... NO-"];
			resultText += letdowns[Math.floor(Math.random() * letdowns.length)];
			resultText += " The " + pokemon.Pokemon + " broke free!";
			document.getElementById("console").textContent = resultText;
			pokeTurn();
		}
		};

	var throwRock = 
		function(e) {
		crate *= 2;
		var resultText = "You threw a rock. ";
		if (condition == 'eating')
			counter = Math.floor((Math.random()*5)+1);
		else
			counter += Math.floor((Math.random()*5)+1);
		condition = 'angry';
		document.getElementById("console").textContent = resultText;
		pokeTurn();
		};

	var throwBait = 
		function(e) {
		crate /= 1.5;
		var resultText = "You threw some bait. ";
		if (condition == 'angry')
			counter = Math.floor((Math.random()*5)+1);
		else
			counter += Math.floor((Math.random()*5)+1);
		condition = 'eating';
		document.getElementById("console").textContent = resultText;
		pokeTurn();
		};

		var throwNet = 
		function(e) {
		var resultText = "You threw a net. ";
		trainer.nets -= 1;
		tangled += Math.floor((Math.random()*2)+2);
		document.getElementById("console").textContent = resultText;
		localStorage.trainer = JSON.stringify(trainer);
		var elem = document.getElementById("netbutton");
		if (trainer.nets <= 0)
			elem.parentNode.removeChild(elem);
		else
			elem.innerText = "Net (x" + trainer.nets + ")";
		pokeTurn();
		};

	var willRun = 
		function() {
		var spd = Math.floor(((pokemon.Spe + iv) * level) / 50) + 10;
		var x = spd * 2;
		if (condition == 'angry') {
			x *= 1.5;
		}
		else if (condition == 'eating') {
			x /= 4;
		}
		return x > (Math.random() * 255);
		};

	var isCaught =
		function(ballType) {
		currentToss = "";
		var cr = crate;
		if (ballType == 'mb')
			return true;
		else if (ballType == 'gb')
			cr *= 1.5;
		var chance = cr / 450; //math.min(151,)
		return Math.random() < chance;
		};

	var pokeTurn =
		function() {
		var resultText = pokemon.Pokemon;
		turn++;
		document.getElementById("turn").textContent = "Turn " + turn;
		if (counter <= 0) {
			condition = 'wary';
			crate = ssData[pokeindex-1].Catch;
		}
		else {
			counter--;
		}
		if (tangled > 0) {
			tangled -= 1;
			resultText += " is tangled in the net!";
		}
		else if (willRun()) {
			resultText += " ran away!";
			document.getElementById('userinput').removeChild(document.getElementById("Options"));

			var console = document.getElementById('sysoutput');
			var classes = console.getAttribute('class');
			console.setAttribute('class', classes+' pokemonfled');

			if (localStorage.sound == "on") 
			cry.play();   
		}
		else {
			resultText += " is " + condition;
		}
		document.getElementById("status").textContent = resultText;

		};

	var recordCapture = 
		function() {
		var pkdex = JSON.parse(localStorage.pokedex);
		if (!pkdex[pokemon.Nat])
			pkdex[pokemon.Nat] = {name:pokemon.Pokemon, shiny:shiny};
		pkdex[pokemon.Nat].shiny = shiny || pkdex[pokemon.Nat].shiny; //Shiny dominates non-shiny
		localStorage.pokedex = JSON.stringify(pkdex);
			var pokee = JSON.parse(localStorage.trainer);
		pokee.poke += pokemon.EXPV;
		localStorage.trainer = JSON.stringify(pokee);
		};

	pokemonGenerator.requestPokemon(); //here starts!
}

function fetchJSONFile(path, callback) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				var data = JSON.parse(httpRequest.responseText);
				if (callback) callback(data);
			}
		}
	};
	httpRequest.open('GET', path);
	httpRequest.send(); 
}

// Run our script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
	//read JSONs
	fetchJSONFile(JSONPokedexUrl, function(allPokemon){
		fetchJSONFile(JSONHabitatsUrl, function(allHabitats){
			// do something with your data
			habitats = allHabitats;
			ssData = allPokemon.pokedex;
			initializeVars();
		});
	});
});
