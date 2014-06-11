
var habitats = {};
habitats.forest = [1,2,3,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,29,30,31,32,33,34,
                   43,44,45,46,47,48,49,52,53,69,70,71,83,84,85,102,113,114,115,123,127,128,
                   143];

habitats.beach = [7,8,9,54,55,60,61,62,72,73,79,80,86,87,90,91,98,99,103,116,117,118,119,
                  120,121,129,130,131,138,139,140,141,142,144,147,148,149];

habitats.tunnel = [4,5,6,25,26,27,28,35,36,37,38,39,40,41,42,50,51,56,57,58,59,66,67,68,74,
                   75,76,77,78,95,104,105,106,107,111,112,126,146];

habitats.city = [63,64,65,81,82,88,89,92,93,94,96,97,100,101,108,109,110,122,124,125,132,
                 133,134,135,136,137,145];

//Johto
habitats.park = [152,153,154,161,162,163,164,165,166,167,168,172,173,174,175,176,179,180,181,
                  182,183,184,185,186,187,188,189,190,191,192,193,194,195,203,204,205,
                  209,210,212,213,214,216,217,231,232,234,241,242];

habitats.glacier = [158,159,160,170,171,199,208,211,215,220,221,222,223,224,225,226,
                   230,238,246,247,248,249];

habitats.tower = [155,156,157,169,177,178,196,197,198,200,201,202,206,207,218,219,
                 227,228,229,233,235,236,237,239,240,250];

//Hoenn
habitats.jungle   = [255,256,257,261,262,263,264,276,277,315,265,266,267,268,269,285,286,273,274,275,290,291,
                     292,313,314,287,288,289,300,301,352,333,334,357,355,356,252,253,254,353,354,280,281,282];
habitats.sea      = [341,342,339,340,270,271,272,283,284,298,349,350,347,348,258,259,260,278,279,366,367,368,
                     370,363,364,365,318,319,320,321,369,345,346,382];
habitats.mountain = [361,362,293,294,295,299,302,303,360,337,338,325,326,322,323,296,297,307,308,
                     327,324,304,305,306,359,331,332,328,329,330,343,344,371,372,373,374,375,376,383];


var condition = 'wary'; // Either wary, angry, or eating
var pokemon, sprite;
var crate = 0;
var counter = 0;
var turn = 1;
var level = 20;
var tangled = 0;
var iv = Math.floor(Math.random() * 15) + 1;
var pokeindex;
var trainer = JSON.parse(localStorage['trainer']);
var dex = JSON.parse(localStorage['pokedex']);
var currentToss = "";
var inKantp = localStorage['location'] == 'forest' || localStorage['location'] == 'tunnel' || localStorage['location'] == 'beach' || localStorage['location'] == 'city';
var inJohto = localStorage['location'] == 'park' || localStorage['location'] == 'glacier' || localStorage['location'] == 'tower';
var inHoenn = localStorage['location'] == 'jungle' || localStorage['location'] == 'sea' || localStorage['location'] == 'mountain';
var shiny = Math.random() < .002;
var cry; var victory;
//var ssData = JSON.parse("data.json");

//for the lazy people and debuggers
// var pokemonFiller = function(lastIndex){
//   var pokedex = JSON.parse(localStorage['pokedex']);
//   for(var i = 1; i<=lastIndex;i++){
//       pokedex[i] = {"name":ssData[i-1].Pokemon, "shiny":false};
//   }
//   localStorage['pokedex'] = JSON.stringify(pokedex);
// };

var pokemonGenerator = {

  requestPokemon: function() {
    var location = localStorage.location;
    switch(location){
      case 'park':
        location = 'park';
        break;
      case 'forest':
      case 'jungle':
      default:
        location = 'forest';
        break;
      case 'glacier':
      case 'mountain':
        location = 'glacier';
        break;
      case 'tunnel':
        location = 'tunnel'
        break;
      case 'beach':
      case 'sea':
        location = 'beach';
        break;
      case 'city':
        location = 'city';
        break;
      case 'tower':
        location = 'tower';
        break;
      }
    chrome.browserAction.setIcon({"path":'/images/'+location + ".png"});
    chrome.browserAction.setPopup({"popup":"/html/menu.html"});
    chrome.notifications.clear("poke", function(){});
    pokeindex = choosePokemon();
    pokemon = ssData[pokeindex-1];

    this.showPokemon();
    this.initBattle();
  },

  showPokemon: function (e) {

    if (localStorage['sound'] == "on") {
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
}

var choosePokemon = function() {
  var location = localStorage.location;
  if (!location)
    location = "forest";
  var lst = habitats[location];
  var trainer = JSON.parse(localStorage.trainer);

  //Special Pokemon alert!
  if (Math.random() < .005) //(Math.random() < .005) - for all below
    return 151;
  else if (location == 'city' && Math.random() < .01)
    return 150;
  else if (Math.random() < .005 && inJohto) // Raikou, Entei and Suicune
    return 243 + Math.floor(Math.random() * 3);
  else if (Math.random() < .005 && inHoenn && location == 'mountain') // Regirock, Regice, Registeel
    return 377 + Math.floor(Math.random() * 3);
  else if (Math.random() < .005 && inJohto) // Celebi
    return 251;
  else if (Math.random() < .005 && inHoenn) // Jirachi
    return 385;
  else if (Math.random() < .005 && inHoenn && trainer.zoomlens) // Zoom Lens Pokemon
    if(location == 'jungle'){
      var choices = [384, 386]; //Rayquaza, Deoxys
      return choices[Math.floor(Math.random() * 2)];

    } else if (location == 'sea'){
      var choices = [380, 381, 384]; //Latias, Latios, Rayquaza
      return choices[Math.floor(Math.random() * 4)];

    } else {
      var choices = [386]; //Deoxys 
      return choices[Math.floor(Math.random() * 1)];
    }
  else if (Math.random() < .00001) // lol
    return 399;
  return lst[Math.floor(Math.random() * lst.length)];
  
};

var urlifyNumber = function(e) {
  var s = '' + e;
  while (s.length < 3)
    s = '0' + s;
  if (shiny) {
      if (localStorage['style'] == '2d')
        return 'http://www.serebii.net/Shiny/BW/' + s + '.png';
      else
        return 'http://www.serebii.net/Shiny/XY/' + s + '.png';
  }
  if (localStorage['style'] == '2d')
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
    localStorage['trainer'] = JSON.stringify(trainer);
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
    localStorage['trainer'] = JSON.stringify(trainer);
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
        document.getElementById("caught").textContent = pokemon.Pokemon + " has been added to your Pokedex!"
      document.getElementById("yield").textContent = "Received " + pokemon.EXPV + " PokeDollars!";

      var classes = output.getAttribute('class');
      output.setAttribute('class', classes+' pokemoncaught');

      if (localStorage['sound'] == 'on') {
        victory = new Audio('http://50.7.60.82:777/ost/pokemon-gameboy-sound-collection/csqodhnibz/108-victory-vs-wild-pokemon-.mp3');
        victory.play();
      }
      recordCapture();
      var d = JSON.parse(localStorage['pokedex']);
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
    localStorage['trainer'] = JSON.stringify(trainer);
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

      if (localStorage['sound'] == "on") 
        cry.play();   
    }
    else {
      resultText += " is " + condition;
    }
    document.getElementById("status").textContent = resultText;

  };

var recordCapture = 
  function() {
    var pkdex = JSON.parse(localStorage['pokedex']);
    if (!pkdex[pokemon.Nat])
      pkdex[pokemon.Nat] = {name:pokemon.Pokemon, shiny:shiny};
    pkdex[pokemon.Nat].shiny = shiny || pkdex[pokemon.Nat].shiny; //Shiny dominates non-shiny
    localStorage['pokedex'] = JSON.stringify(pkdex);
        var pokee = JSON.parse(localStorage['trainer']);
    pokee.poke += pokemon.EXPV;
    localStorage['trainer'] = JSON.stringify(pokee);
  };

// Run our script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  pokemonGenerator.requestPokemon();
});

// There has to be a better way, but I couldn't find how to read local files. If you know, please end my misery. All the data is nicely in data.json
var ssData =
[
  {
    "Nat":1,
    "Pokemon":"Bulbasaur",
    "Spe":45,
    "Total":318,
    "Type I":"Grass",
    "EXPV":64,
    "Catch":45
  },
  {
    "Nat":2,
    "Pokemon":"Ivysaur",
    "Spe":60,
    "Total":405,
    "Type I":"Grass",
    "EXPV":141,
    "Catch":45
  },
  {
    "Nat":3,
    "Pokemon":"Venusaur",
    "Spe":80,
    "Total":525,
    "Type I":"Grass",
    "EXPV":208,
    "Catch":45
  },
  {
    "Nat":4,
    "Pokemon":"Charmander",
    "Spe":65,
    "Total":309,
    "Type I":"Fire",
    "EXPV":65,
    "Catch":45
  },
  {
    "Nat":5,
    "Pokemon":"Charmeleon",
    "Spe":80,
    "Total":405,
    "Type I":"Fire",
    "EXPV":142,
    "Catch":45
  },
  {
    "Nat":6,
    "Pokemon":"Charizard",
    "Spe":100,
    "Total":534,
    "Type I":"Fire",
    "EXPV":209,
    "Catch":45
  },
  {
    "Nat":7,
    "Pokemon":"Squirtle",
    "Spe":43,
    "Total":314,
    "Type I":"Water",
    "EXPV":66,
    "Catch":45
  },
  {
    "Nat":8,
    "Pokemon":"Wartortle",
    "Spe":58,
    "Total":405,
    "Type I":"Water",
    "EXPV":143,
    "Catch":45
  },
  {
    "Nat":9,
    "Pokemon":"Blastoise",
    "Spe":78,
    "Total":530,
    "Type I":"Water",
    "EXPV":210,
    "Catch":45
  },
  {
    "Nat":10,
    "Pokemon":"Caterpie",
    "Spe":45,
    "Total":195,
    "Type I":"Bug",
    "EXPV":53,
    "Catch":255
  },
  {
    "Nat":11,
    "Pokemon":"Metapod",
    "Spe":30,
    "Total":205,
    "Type I":"Bug",
    "EXPV":72,
    "Catch":120
  },
  {
    "Nat":12,
    "Pokemon":"Butterfree",
    "Spe":70,
    "Total":385,
    "Type I":"Bug",
    "EXPV":160,
    "Catch":45
  },
  {
    "Nat":13,
    "Pokemon":"Weedle",
    "Spe":50,
    "Total":195,
    "Type I":"Bug",
    "EXPV":52,
    "Catch":255
  },
  {
    "Nat":14,
    "Pokemon":"Kakuna",
    "Spe":35,
    "Total":205,
    "Type I":"Bug",
    "EXPV":71,
    "Catch":120
  },
  {
    "Nat":15,
    "Pokemon":"Beedrill",
    "Spe":75,
    "Total":380,
    "Type I":"Bug",
    "EXPV":159,
    "Catch":45
  },
  {
    "Nat":16,
    "Pokemon":"Pidgey",
    "Spe":56,
    "Total":251,
    "Type I":"Normal",
    "EXPV":55,
    "Catch":255
  },
  {
    "Nat":17,
    "Pokemon":"Pidgeotto",
    "Spe":71,
    "Total":349,
    "Type I":"Normal",
    "EXPV":113,
    "Catch":120
  },
  {
    "Nat":18,
    "Pokemon":"Pidgeot",
    "Spe":91,
    "Total":469,
    "Type I":"Normal",
    "EXPV":172,
    "Catch":45
  },
  {
    "Nat":19,
    "Pokemon":"Rattata",
    "Spe":72,
    "Total":253,
    "Type I":"Normal",
    "EXPV":57,
    "Catch":255
  },
  {
    "Nat":20,
    "Pokemon":"Raticate",
    "Spe":97,
    "Total":413,
    "Type I":"Normal",
    "EXPV":116,
    "Catch":127
  },
  {
    "Nat":21,
    "Pokemon":"Spearow",
    "Spe":70,
    "Total":262,
    "Type I":"Normal",
    "EXPV":58,
    "Catch":255
  },
  {
    "Nat":22,
    "Pokemon":"Fearow",
    "Spe":100,
    "Total":442,
    "Type I":"Normal",
    "EXPV":162,
    "Catch":90
  },
  {
    "Nat":23,
    "Pokemon":"Ekans",
    "Spe":55,
    "Total":283,
    "Type I":"Poison",
    "EXPV":62,
    "Catch":255
  },
  {
    "Nat":24,
    "Pokemon":"Arbok",
    "Spe":80,
    "Total":438,
    "Type I":"Poison",
    "EXPV":147,
    "Catch":90
  },
  {
    "Nat":25,
    "Pokemon":"Pikachu",
    "Spe":90,
    "Total":300,
    "Type I":"Electric",
    "EXPV":82,
    "Catch":190
  },
  {
    "Nat":26,
    "Pokemon":"Raichu",
    "Spe":100,
    "Total":475,
    "Type I":"Electric",
    "EXPV":122,
    "Catch":75
  },
  {
    "Nat":27,
    "Pokemon":"Sandshrew",
    "Spe":40,
    "Total":300,
    "Type I":"Ground",
    "EXPV":93,
    "Catch":255
  },
  {
    "Nat":28,
    "Pokemon":"Sandslash",
    "Spe":65,
    "Total":450,
    "Type I":"Ground",
    "EXPV":163,
    "Catch":90
  },
  {
    "Nat":29,
    "Pokemon":"Nidoran-f",
    "Spe":41,
    "Total":275,
    "Type I":"Poison",
    "EXPV":59,
    "Catch":235
  },
  {
    "Nat":30,
    "Pokemon":"Nidorina",
    "Spe":56,
    "Total":365,
    "Type I":"Poison",
    "EXPV":117,
    "Catch":120
  },
  {
    "Nat":31,
    "Pokemon":"Nidoqueen",
    "Spe":76,
    "Total":495,
    "Type I":"Poison",
    "EXPV":194,
    "Catch":45
  },
  {
    "Nat":32,
    "Pokemon":"Nidoran-m",
    "Spe":50,
    "Total":273,
    "Type I":"Poison",
    "EXPV":60,
    "Catch":235
  },
  {
    "Nat":33,
    "Pokemon":"Nidorino",
    "Spe":65,
    "Total":365,
    "Type I":"Poison",
    "EXPV":118,
    "Catch":120
  },
  {
    "Nat":34,
    "Pokemon":"Nidoking",
    "Spe":85,
    "Total":495,
    "Type I":"Poison",
    "EXPV":195,
    "Catch":45
  },
  {
    "Nat":35,
    "Pokemon":"Clefairy",
    "Spe":35,
    "Total":323,
    "Type I":"Normal",
    "EXPV":68,
    "Catch":150
  },
  {
    "Nat":36,
    "Pokemon":"Clefable",
    "Spe":60,
    "Total":473,
    "Type I":"Normal",
    "EXPV":129,
    "Catch":25
  },
  {
    "Nat":37,
    "Pokemon":"Vulpix",
    "Spe":65,
    "Total":299,
    "Type I":"Fire",
    "EXPV":63,
    "Catch":190
  },
  {
    "Nat":38,
    "Pokemon":"Ninetales",
    "Spe":100,
    "Total":505,
    "Type I":"Fire",
    "EXPV":178,
    "Catch":75
  },
  {
    "Nat":39,
    "Pokemon":"Jigglypuff",
    "Spe":20,
    "Total":270,
    "Type I":"Normal",
    "EXPV":76,
    "Catch":170
  },
  {
    "Nat":40,
    "Pokemon":"Wigglytuff",
    "Spe":45,
    "Total":425,
    "Type I":"Normal",
    "EXPV":109,
    "Catch":50
  },
  {
    "Nat":41,
    "Pokemon":"Zubat",
    "Spe":55,
    "Total":245,
    "Type I":"Poison",
    "EXPV":54,
    "Catch":255
  },
  {
    "Nat":42,
    "Pokemon":"Golbat",
    "Spe":90,
    "Total":455,
    "Type I":"Poison",
    "EXPV":171,
    "Catch":90
  },
  {
    "Nat":43,
    "Pokemon":"Oddish",
    "Spe":30,
    "Total":320,
    "Type I":"Grass",
    "EXPV":78,
    "Catch":255
  },
  {
    "Nat":44,
    "Pokemon":"Gloom",
    "Spe":40,
    "Total":395,
    "Type I":"Grass",
    "EXPV":132,
    "Catch":120
  },
  {
    "Nat":45,
    "Pokemon":"Vileplume",
    "Spe":50,
    "Total":480,
    "Type I":"Grass",
    "EXPV":184,
    "Catch":45
  },
  {
    "Nat":46,
    "Pokemon":"Paras",
    "Spe":25,
    "Total":285,
    "Type I":"Bug",
    "EXPV":70,
    "Catch":190
  },
  {
    "Nat":47,
    "Pokemon":"Parasect",
    "Spe":30,
    "Total":405,
    "Type I":"Bug",
    "EXPV":128,
    "Catch":75
  },
  {
    "Nat":48,
    "Pokemon":"Venonat",
    "Spe":45,
    "Total":305,
    "Type I":"Bug",
    "EXPV":75,
    "Catch":190
  },
  {
    "Nat":49,
    "Pokemon":"Venomoth",
    "Spe":90,
    "Total":450,
    "Type I":"Bug",
    "EXPV":138,
    "Catch":75
  },
  {
    "Nat":50,
    "Pokemon":"Diglett",
    "Spe":95,
    "Total":265,
    "Type I":"Ground",
    "EXPV":81,
    "Catch":255
  },
  {
    "Nat":51,
    "Pokemon":"Dugtrio",
    "Spe":120,
    "Total":405,
    "Type I":"Ground",
    "EXPV":153,
    "Catch":50
  },
  {
    "Nat":52,
    "Pokemon":"Meowth",
    "Spe":90,
    "Total":290,
    "Type I":"Normal",
    "EXPV":69,
    "Catch":255
  },
  {
    "Nat":53,
    "Pokemon":"Persian",
    "Spe":115,
    "Total":440,
    "Type I":"Normal",
    "EXPV":148,
    "Catch":90
  },
  {
    "Nat":54,
    "Pokemon":"Psyduck",
    "Spe":55,
    "Total":320,
    "Type I":"Water",
    "EXPV":80,
    "Catch":190
  },
  {
    "Nat":55,
    "Pokemon":"Golduck",
    "Spe":85,
    "Total":500,
    "Type I":"Water",
    "EXPV":174,
    "Catch":75
  },
  {
    "Nat":56,
    "Pokemon":"Mankey",
    "Spe":70,
    "Total":305,
    "Type I":"Fighting",
    "EXPV":74,
    "Catch":190
  },
  {
    "Nat":57,
    "Pokemon":"Primeape",
    "Spe":95,
    "Total":455,
    "Type I":"Fighting",
    "EXPV":149,
    "Catch":75
  },
  {
    "Nat":58,
    "Pokemon":"Growlithe",
    "Spe":60,
    "Total":350,
    "Type I":"Fire",
    "EXPV":91,
    "Catch":190
  },
  {
    "Nat":59,
    "Pokemon":"Arcanine",
    "Spe":95,
    "Total":555,
    "Type I":"Fire",
    "EXPV":213,
    "Catch":75
  },
  {
    "Nat":60,
    "Pokemon":"Poliwag",
    "Spe":90,
    "Total":300,
    "Type I":"Water",
    "EXPV":77,
    "Catch":255
  },
  {
    "Nat":61,
    "Pokemon":"Poliwhirl",
    "Spe":90,
    "Total":385,
    "Type I":"Water",
    "EXPV":131,
    "Catch":120
  },
  {
    "Nat":62,
    "Pokemon":"Poliwrath",
    "Spe":70,
    "Total":500,
    "Type I":"Water",
    "EXPV":185,
    "Catch":45
  },
  {
    "Nat":63,
    "Pokemon":"Abra",
    "Spe":90,
    "Total":310,
    "Type I":"Psychic",
    "EXPV":75,
    "Catch":200
  },
  {
    "Nat":64,
    "Pokemon":"Kadabra",
    "Spe":105,
    "Total":400,
    "Type I":"Psychic",
    "EXPV":145,
    "Catch":100
  },
  {
    "Nat":65,
    "Pokemon":"Alakazam",
    "Spe":120,
    "Total":490,
    "Type I":"Psychic",
    "EXPV":186,
    "Catch":50
  },
  {
    "Nat":66,
    "Pokemon":"Machop",
    "Spe":35,
    "Total":305,
    "Type I":"Fighting",
    "EXPV":75,
    "Catch":180
  },
  {
    "Nat":67,
    "Pokemon":"Machoke",
    "Spe":45,
    "Total":405,
    "Type I":"Fighting",
    "EXPV":146,
    "Catch":90
  },
  {
    "Nat":68,
    "Pokemon":"Machamp",
    "Spe":55,
    "Total":505,
    "Type I":"Fighting",
    "EXPV":193,
    "Catch":45
  },
  {
    "Nat":69,
    "Pokemon":"Bellsprout",
    "Spe":40,
    "Total":300,
    "Type I":"Grass",
    "EXPV":84,
    "Catch":255
  },
  {
    "Nat":70,
    "Pokemon":"Weepinbell",
    "Spe":55,
    "Total":390,
    "Type I":"Grass",
    "EXPV":151,
    "Catch":120
  },
  {
    "Nat":71,
    "Pokemon":"Victreebel",
    "Spe":70,
    "Total":480,
    "Type I":"Grass",
    "EXPV":191,
    "Catch":45
  },
  {
    "Nat":72,
    "Pokemon":"Tentacool",
    "Spe":70,
    "Total":335,
    "Type I":"Water",
    "EXPV":105,
    "Catch":190
  },
  {
    "Nat":73,
    "Pokemon":"Tentacruel",
    "Spe":100,
    "Total":515,
    "Type I":"Water",
    "EXPV":205,
    "Catch":60
  },
  {
    "Nat":74,
    "Pokemon":"Geodude",
    "Spe":20,
    "Total":300,
    "Type I":"Rock",
    "EXPV":73,
    "Catch":255
  },
  {
    "Nat":75,
    "Pokemon":"Graveler",
    "Spe":35,
    "Total":390,
    "Type I":"Rock",
    "EXPV":134,
    "Catch":120
  },
  {
    "Nat":76,
    "Pokemon":"Golem",
    "Spe":45,
    "Total":485,
    "Type I":"Rock",
    "EXPV":177,
    "Catch":45
  },
  {
    "Nat":77,
    "Pokemon":"Ponyta",
    "Spe":90,
    "Total":410,
    "Type I":"Fire",
    "EXPV":152,
    "Catch":190
  },
  {
    "Nat":78,
    "Pokemon":"Rapidash",
    "Spe":105,
    "Total":500,
    "Type I":"Fire",
    "EXPV":192,
    "Catch":60
  },
  {
    "Nat":79,
    "Pokemon":"Slowpoke",
    "Spe":15,
    "Total":315,
    "Type I":"Water",
    "EXPV":99,
    "Catch":190
  },
  {
    "Nat":80,
    "Pokemon":"Slowbro",
    "Spe":30,
    "Total":490,
    "Type I":"Water",
    "EXPV":164,
    "Catch":75
  },
  {
    "Nat":81,
    "Pokemon":"Magnemite",
    "Spe":45,
    "Total":325,
    "Type I":"Electric",
    "EXPV":89,
    "Catch":190
  },
  {
    "Nat":82,
    "Pokemon":"Magneton",
    "Spe":70,
    "Total":465,
    "Type I":"Electric",
    "EXPV":161,
    "Catch":60
  },
  {
    "Nat":83,
    "Pokemon":"Farfetch'd",
    "Spe":60,
    "Total":352,
    "Type I":"Normal",
    "EXPV":94,
    "Catch":45
  },
  {
    "Nat":84,
    "Pokemon":"Doduo",
    "Spe":75,
    "Total":310,
    "Type I":"Normal",
    "EXPV":96,
    "Catch":190
  },
  {
    "Nat":85,
    "Pokemon":"Dodrio",
    "Spe":100,
    "Total":460,
    "Type I":"Normal",
    "EXPV":158,
    "Catch":45
  },
  {
    "Nat":86,
    "Pokemon":"Seel",
    "Spe":45,
    "Total":325,
    "Type I":"Water",
    "EXPV":100,
    "Catch":190
  },
  {
    "Nat":87,
    "Pokemon":"Dewgong",
    "Spe":70,
    "Total":475,
    "Type I":"Water",
    "EXPV":176,
    "Catch":75
  },
  {
    "Nat":88,
    "Pokemon":"Grimer",
    "Spe":25,
    "Total":325,
    "Type I":"Poison",
    "EXPV":90,
    "Catch":190
  },
  {
    "Nat":89,
    "Pokemon":"Muk",
    "Spe":50,
    "Total":500,
    "Type I":"Poison",
    "EXPV":157,
    "Catch":75
  },
  {
    "Nat":90,
    "Pokemon":"Shellder",
    "Spe":40,
    "Total":305,
    "Type I":"Water",
    "EXPV":97,
    "Catch":190
  },
  {
    "Nat":91,
    "Pokemon":"Cloyster",
    "Spe":70,
    "Total":520,
    "Type I":"Water",
    "EXPV":203,
    "Catch":60
  },
  {
    "Nat":92,
    "Pokemon":"Gastly",
    "Spe":80,
    "Total":310,
    "Type I":"Ghost",
    "EXPV":95,
    "Catch":190
  },
  {
    "Nat":93,
    "Pokemon":"Haunter",
    "Spe":95,
    "Total":405,
    "Type I":"Ghost",
    "EXPV":126,
    "Catch":90
  },
  {
    "Nat":94,
    "Pokemon":"Gengar",
    "Spe":110,
    "Total":500,
    "Type I":"Ghost",
    "EXPV":190,
    "Catch":45
  },
  {
    "Nat":95,
    "Pokemon":"Onix",
    "Spe":70,
    "Total":385,
    "Type I":"Rock",
    "EXPV":108,
    "Catch":45
  },
  {
    "Nat":96,
    "Pokemon":"Drowzee",
    "Spe":42,
    "Total":328,
    "Type I":"Psychic",
    "EXPV":102,
    "Catch":190
  },
  {
    "Nat":97,
    "Pokemon":"Hypno",
    "Spe":67,
    "Total":483,
    "Type I":"Psychic",
    "EXPV":165,
    "Catch":75
  },
  {
    "Nat":98,
    "Pokemon":"Krabby",
    "Spe":50,
    "Total":325,
    "Type I":"Water",
    "EXPV":115,
    "Catch":225
  },
  {
    "Nat":99,
    "Pokemon":"Kingler",
    "Spe":75,
    "Total":475,
    "Type I":"Water",
    "EXPV":206,
    "Catch":60
  },
  {
    "Nat":100,
    "Pokemon":"Voltorb",
    "Spe":100,
    "Total":330,
    "Type I":"Electric",
    "EXPV":103,
    "Catch":190
  },
  {
    "Nat":101,
    "Pokemon":"Electrode",
    "Spe":140,
    "Total":480,
    "Type I":"Electric",
    "EXPV":150,
    "Catch":60
  },
  {
    "Nat":102,
    "Pokemon":"Exeggcute",
    "Spe":40,
    "Total":325,
    "Type I":"Grass",
    "EXPV":98,
    "Catch":90
  },
  {
    "Nat":103,
    "Pokemon":"Exeggutor",
    "Spe":55,
    "Total":520,
    "Type I":"Grass",
    "EXPV":212,
    "Catch":45
  },
  {
    "Nat":104,
    "Pokemon":"Cubone",
    "Spe":35,
    "Total":320,
    "Type I":"Ground",
    "EXPV":87,
    "Catch":190
  },
  {
    "Nat":105,
    "Pokemon":"Marowak",
    "Spe":45,
    "Total":425,
    "Type I":"Ground",
    "EXPV":124,
    "Catch":75
  },
  {
    "Nat":106,
    "Pokemon":"Hitmonlee",
    "Spe":87,
    "Total":455,
    "Type I":"Fighting",
    "EXPV":139,
    "Catch":45
  },
  {
    "Nat":107,
    "Pokemon":"Hitmonchan",
    "Spe":76,
    "Total":455,
    "Type I":"Fighting",
    "EXPV":140,
    "Catch":45
  },
  {
    "Nat":108,
    "Pokemon":"Lickitung",
    "Spe":30,
    "Total":385,
    "Type I":"Normal",
    "EXPV":127,
    "Catch":45
  },
  {
    "Nat":109,
    "Pokemon":"Koffing",
    "Spe":35,
    "Total":340,
    "Type I":"Poison",
    "EXPV":114,
    "Catch":190
  },
  {
    "Nat":110,
    "Pokemon":"Weezing",
    "Spe":60,
    "Total":490,
    "Type I":"Poison",
    "EXPV":173,
    "Catch":60
  },
  {
    "Nat":111,
    "Pokemon":"Rhyhorn",
    "Spe":25,
    "Total":345,
    "Type I":"Ground",
    "EXPV":135,
    "Catch":120
  },
  {
    "Nat":112,
    "Pokemon":"Rhydon",
    "Spe":40,
    "Total":485,
    "Type I":"Ground",
    "EXPV":204,
    "Catch":60
  },
  {
    "Nat":113,
    "Pokemon":"Chansey",
    "Spe":50,
    "Total":450,
    "Type I":"Normal",
    "EXPV":255,
    "Catch":30
  },
  {
    "Nat":114,
    "Pokemon":"Tangela",
    "Spe":60,
    "Total":435,
    "Type I":"Grass",
    "EXPV":166,
    "Catch":45
  },
  {
    "Nat":115,
    "Pokemon":"Kangaskhan",
    "Spe":90,
    "Total":490,
    "Type I":"Normal",
    "EXPV":175,
    "Catch":45
  },
  {
    "Nat":116,
    "Pokemon":"Horsea",
    "Spe":60,
    "Total":295,
    "Type I":"Water",
    "EXPV":83,
    "Catch":225
  },
  {
    "Nat":117,
    "Pokemon":"Seadra",
    "Spe":85,
    "Total":440,
    "Type I":"Water",
    "EXPV":155,
    "Catch":75
  },
  {
    "Nat":118,
    "Pokemon":"Goldeen",
    "Spe":63,
    "Total":320,
    "Type I":"Water",
    "EXPV":111,
    "Catch":225
  },
  {
    "Nat":119,
    "Pokemon":"Seaking",
    "Spe":68,
    "Total":450,
    "Type I":"Water",
    "EXPV":170,
    "Catch":60
  },
  {
    "Nat":120,
    "Pokemon":"Staryu",
    "Spe":85,
    "Total":340,
    "Type I":"Water",
    "EXPV":106,
    "Catch":225
  },
  {
    "Nat":121,
    "Pokemon":"Starmie",
    "Spe":115,
    "Total":520,
    "Type I":"Water",
    "EXPV":207,
    "Catch":60
  },
  {
    "Nat":122,
    "Pokemon":"Mr. Mime",
    "Spe":90,
    "Total":460,
    "Type I":"Psychic",
    "EXPV":136,
    "Catch":45
  },
  {
    "Nat":123,
    "Pokemon":"Scyther",
    "Spe":105,
    "Total":500,
    "Type I":"Bug",
    "EXPV":187,
    "Catch":45
  },
  {
    "Nat":124,
    "Pokemon":"Jynx",
    "Spe":95,
    "Total":455,
    "Type I":"Ice",
    "EXPV":137,
    "Catch":45
  },
  {
    "Nat":125,
    "Pokemon":"Electabuzz",
    "Spe":105,
    "Total":490,
    "Type I":"Electric",
    "EXPV":156,
    "Catch":45
  },
  {
    "Nat":126,
    "Pokemon":"Magmar",
    "Spe":93,
    "Total":495,
    "Type I":"Fire",
    "EXPV":167,
    "Catch":45
  },
  {
    "Nat":127,
    "Pokemon":"Pinsir",
    "Spe":85,
    "Total":500,
    "Type I":"Bug",
    "EXPV":200,
    "Catch":45
  },
  {
    "Nat":128,
    "Pokemon":"Tauros",
    "Spe":110,
    "Total":490,
    "Type I":"Normal",
    "EXPV":211,
    "Catch":45
  },
  {
    "Nat":129,
    "Pokemon":"Magikarp",
    "Spe":80,
    "Total":200,
    "Type I":"Water",
    "EXPV":20,
    "Catch":255
  },
  {
    "Nat":130,
    "Pokemon":"Gyarados",
    "Spe":81,
    "Total":540,
    "Type I":"Water",
    "EXPV":214,
    "Catch":45
  },
  {
    "Nat":131,
    "Pokemon":"Lapras",
    "Spe":60,
    "Total":535,
    "Type I":"Water",
    "EXPV":219,
    "Catch":45
  },
  {
    "Nat":132,
    "Pokemon":"Ditto",
    "Spe":48,
    "Total":288,
    "Type I":"Normal",
    "EXPV":61,
    "Catch":35
  },
  {
    "Nat":133,
    "Pokemon":"Eevee",
    "Spe":55,
    "Total":325,
    "Type I":"Normal",
    "EXPV":92,
    "Catch":45
  },
  {
    "Nat":134,
    "Pokemon":"Vaporeon",
    "Spe":65,
    "Total":525,
    "Type I":"Water",
    "EXPV":196,
    "Catch":45
  },
  {
    "Nat":135,
    "Pokemon":"Jolteon",
    "Spe":130,
    "Total":525,
    "Type I":"Electric",
    "EXPV":197,
    "Catch":45
  },
  {
    "Nat":136,
    "Pokemon":"Flareon",
    "Spe":65,
    "Total":525,
    "Type I":"Fire",
    "EXPV":198,
    "Catch":45
  },
  {
    "Nat":137,
    "Pokemon":"Porygon",
    "Spe":40,
    "Total":395,
    "Type I":"Normal",
    "EXPV":130,
    "Catch":45
  },
  {
    "Nat":138,
    "Pokemon":"Omanyte",
    "Spe":35,
    "Total":355,
    "Type I":"Rock",
    "EXPV":99,
    "Catch":45
  },
  {
    "Nat":139,
    "Pokemon":"Omastar",
    "Spe":55,
    "Total":495,
    "Type I":"Rock",
    "EXPV":199,
    "Catch":45
  },
  {
    "Nat":140,
    "Pokemon":"Kabuto",
    "Spe":55,
    "Total":355,
    "Type I":"Rock",
    "EXPV":99,
    "Catch":45
  },
  {
    "Nat":141,
    "Pokemon":"Kabutops",
    "Spe":80,
    "Total":495,
    "Type I":"Rock",
    "EXPV":199,
    "Catch":45
  },
  {
    "Nat":142,
    "Pokemon":"Aerodactyl",
    "Spe":130,
    "Total":515,
    "Type I":"Rock",
    "EXPV":202,
    "Catch":45
  },
  {
    "Nat":143,
    "Pokemon":"Snorlax",
    "Spe":30,
    "Total":540,
    "Type I":"Normal",
    "EXPV":154,
    "Catch":25
  },
  {
    "Nat":144,
    "Pokemon":"Articuno",
    "Spe":85,
    "Total":580,
    "Type I":"Ice",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":145,
    "Pokemon":"Zapdos",
    "Spe":100,
    "Total":580,
    "Type I":"Electric",
    "EXPV":216,
    "Catch":3
  },
  {
    "Nat":146,
    "Pokemon":"Moltres",
    "Spe":90,
    "Total":580,
    "Type I":"Fire",
    "EXPV":217,
    "Catch":3
  },
  {
    "Nat":147,
    "Pokemon":"Dratini",
    "Spe":50,
    "Total":300,
    "Type I":"Dragon",
    "EXPV":67,
    "Catch":45
  },
  {
    "Nat":148,
    "Pokemon":"Dragonair",
    "Spe":70,
    "Total":420,
    "Type I":"Dragon",
    "EXPV":144,
    "Catch":45
  },
  {
    "Nat":149,
    "Pokemon":"Dragonite",
    "Spe":80,
    "Total":600,
    "Type I":"Dragon",
    "EXPV":218,
    "Catch":45
  },
  {
    "Nat":150,
    "Pokemon":"Mewtwo",
    "Spe":130,
    "Total":680,
    "Type I":"Psychic",
    "EXPV":220,
    "Catch":3
  },
  {
    "Nat":151,
    "Pokemon":"Mew",
    "Spe":100,
    "Total":600,
    "Type I":"Psychic",
    "EXPV":64,
    "Catch":45
  },
  {
    "Nat":152,
    "Pokemon":"Chikorita",
    "Spe":45,
    "Total":318,
    "Type I":"Grass",
    "EXPV":64,
    "Catch":45
  },
  {
    "Nat":153,
    "Pokemon":"Bayleef",
    "Spe":69,
    "Total":414,
    "Type I":"Grass",
    "EXPV":141,
    "Catch":45
  },
  {
    "Nat":154,
    "Pokemon":"Meganium",
    "Spe":80,
    "Total":525,
    "Type I":"Grass",
    "EXPV":208,
    "Catch":45
  },
  {
    "Nat":155,
    "Pokemon":"Cyndaquil",
    "Spe":65,
    "Total":309,
    "Type I":"Fire",
    "EXPV":65,
    "Catch":45
  },
  {
    "Nat":156,
    "Pokemon":"Quilava",
    "Spe":80,
    "Total":405,
    "Type I":"Fire",
    "EXPV":142,
    "Catch":45
  },
  {
    "Nat":157,
    "Pokemon":"Typhlosion",
    "Spe":100,
    "Total":534,
    "Type I":"Fire",
    "EXPV":209,
    "Catch":45
  },
  {
    "Nat":158,
    "Pokemon":"Totodile",
    "Spe":43,
    "Total":314,
    "Type I":"Water",
    "EXPV":66,
    "Catch":45
  },
  {
    "Nat":159,
    "Pokemon":"Croconaw",
    "Spe":58,
    "Total":405,
    "Type I":"Water",
    "EXPV":143,
    "Catch":45
  },
  {
    "Nat":160,
    "Pokemon":"Feraligatr",
    "Spe":78,
    "Total":530,
    "Type I":"Water",
    "EXPV":210,
    "Catch":45
  },
  {
    "Nat":161,
    "Pokemon":"Sentret",
    "Spe":20,
    "Total":215,
    "Type I":"Normal",
    "EXPV":57,
    "Catch":255
  },
  {
    "Nat":162,
    "Pokemon":"Furret",
    "Spe":90,
    "Total":415,
    "Type I":"Normal",
    "EXPV":116,
    "Catch":90
  },
  {
    "Nat":163,
    "Pokemon":"Hoothoot",
    "Spe":50,
    "Total":262,
    "Type I":"Normal",
    "EXPV":58,
    "Catch":255
  },
  {
    "Nat":164,
    "Pokemon":"Noctowl",
    "Spe":70,
    "Total":442,
    "Type I":"Normal",
    "EXPV":162,
    "Catch":90
  },
  {
    "Nat":165,
    "Pokemon":"Ledyba",
    "Spe":55,
    "Total":265,
    "Type I":"Bug",
    "EXPV":54,
    "Catch":255
  },
  {
    "Nat":166,
    "Pokemon":"Ledian",
    "Spe":85,
    "Total":390,
    "Type I":"Bug",
    "EXPV":134,
    "Catch":90
  },
  {
    "Nat":167,
    "Pokemon":"Spinarak",
    "Spe":30,
    "Total":250,
    "Type I":"Bug",
    "EXPV":54,
    "Catch":255
  },
  {
    "Nat":168,
    "Pokemon":"Ariados",
    "Spe":40,
    "Total":390,
    "Type I":"Bug",
    "EXPV":134,
    "Catch":90
  },
  {
    "Nat":169,
    "Pokemon":"Crobat",
    "Spe":130,
    "Total":535,
    "Type I":"Poison",
    "EXPV":204,
    "Catch":90
  },
  {
    "Nat":170,
    "Pokemon":"Chinchou",
    "Spe":67,
    "Total":330,
    "Type I":"Water",
    "EXPV":90,
    "Catch":190
  },
  {
    "Nat":171,
    "Pokemon":"Lanturn",
    "Spe":67,
    "Total":460,
    "Type I":"Water",
    "EXPV":156,
    "Catch":75
  },
  {
    "Nat":172,
    "Pokemon":"Pichu",
    "Spe":60,
    "Total":205,
    "Type I":"Electric",
    "EXPV":42,
    "Catch":190
  },
  {
    "Nat":173,
    "Pokemon":"Cleffa",
    "Spe":15,
    "Total":218,
    "Type I":"Normal",
    "EXPV":37,
    "Catch":150
  },
  {
    "Nat":174,
    "Pokemon":"Igglybuff",
    "Spe":15,
    "Total":210,
    "Type I":"Normal",
    "EXPV":39,
    "Catch":170
  },
  {
    "Nat":175,
    "Pokemon":"Togepi",
    "Spe":20,
    "Total":245,
    "Type I":"Normal",
    "EXPV":74,
    "Catch":190
  },
  {
    "Nat":176,
    "Pokemon":"Togetic",
    "Spe":40,
    "Total":405,
    "Type I":"Normal",
    "EXPV":114,
    "Catch":75
  },
  {
    "Nat":177,
    "Pokemon":"Natu",
    "Spe":70,
    "Total":320,
    "Type I":"Psychic",
    "EXPV":73,
    "Catch":190
  },
  {
    "Nat":178,
    "Pokemon":"Xatu",
    "Spe":95,
    "Total":470,
    "Type I":"Psychic",
    "EXPV":171,
    "Catch":75
  },
  {
    "Nat":179,
    "Pokemon":"Mareep",
    "Spe":35,
    "Total":280,
    "Type I":"Electric",
    "EXPV":59,
    "Catch":235
  },
  {
    "Nat":180,
    "Pokemon":"Flaaffy",
    "Spe":45,
    "Total":365,
    "Type I":"Electric",
    "EXPV":117,
    "Catch":120
  },
  {
    "Nat":181,
    "Pokemon":"Ampharos",
    "Spe":55,
    "Total":500,
    "Type I":"Electric",
    "EXPV":194,
    "Catch":45
  },
  {
    "Nat":182,
    "Pokemon":"Bellossom",
    "Spe":50,
    "Total":480,
    "Type I":"Grass",
    "EXPV":184,
    "Catch":45
  },
  {
    "Nat":183,
    "Pokemon":"Marill",
    "Spe":40,
    "Total":250,
    "Type I":"Water",
    "EXPV":58,
    "Catch":190
  },
  {
    "Nat":184,
    "Pokemon":"Azumarill",
    "Spe":50,
    "Total":410,
    "Type I":"Water",
    "EXPV":153,
    "Catch":75
  },
  {
    "Nat":185,
    "Pokemon":"Sudowoodo",
    "Spe":30,
    "Total":410,
    "Type I":"Rock",
    "EXPV":135,
    "Catch":65
  },
  {
    "Nat":186,
    "Pokemon":"Politoed",
    "Spe":70,
    "Total":500,
    "Type I":"Water",
    "EXPV":185,
    "Catch":45
  },
  {
    "Nat":187,
    "Pokemon":"Hoppip",
    "Spe":50,
    "Total":250,
    "Type I":"Grass",
    "EXPV":74,
    "Catch":255
  },
  {
    "Nat":188,
    "Pokemon":"Skiploom",
    "Spe":80,
    "Total":340,
    "Type I":"Grass",
    "EXPV":136,
    "Catch":120
  },
  {
    "Nat":189,
    "Pokemon":"Jumpluff",
    "Spe":110,
    "Total":450,
    "Type I":"Grass",
    "EXPV":176,
    "Catch":45
  },
  {
    "Nat":190,
    "Pokemon":"Aipom",
    "Spe":85,
    "Total":360,
    "Type I":"Normal",
    "EXPV":94,
    "Catch":45
  },
  {
    "Nat":191,
    "Pokemon":"Sunkern",
    "Spe":30,
    "Total":180,
    "Type I":"Grass",
    "EXPV":52,
    "Catch":235
  },
  {
    "Nat":192,
    "Pokemon":"Sunflora",
    "Spe":30,
    "Total":425,
    "Type I":"Grass",
    "EXPV":146,
    "Catch":120
  },
  {
    "Nat":193,
    "Pokemon":"Yanma",
    "Spe":95,
    "Total":390,
    "Type I":"Bug",
    "EXPV":147,
    "Catch":75
  },
  {
    "Nat":194,
    "Pokemon":"Wooper",
    "Spe":15,
    "Total":210,
    "Type I":"Water",
    "EXPV":52,
    "Catch":255
  },
  {
    "Nat":195,
    "Pokemon":"Quagsire",
    "Spe":35,
    "Total":430,
    "Type I":"Water",
    "EXPV":137,
    "Catch":90
  },
  {
    "Nat":196,
    "Pokemon":"Espeon",
    "Spe":110,
    "Total":525,
    "Type I":"Psychic",
    "EXPV":197,
    "Catch":45
  },
  {
    "Nat":197,
    "Pokemon":"Umbreon",
    "Spe":65,
    "Total":525,
    "Type I":"Dark",
    "EXPV":197,
    "Catch":45
  },
  {
    "Nat":198,
    "Pokemon":"Murkrow",
    "Spe":91,
    "Total":405,
    "Type I":"Dark",
    "EXPV":107,
    "Catch":30
  },
  {
    "Nat":199,
    "Pokemon":"Slowking",
    "Spe":30,
    "Total":490,
    "Type I":"Water",
    "EXPV":164,
    "Catch":70
  },
  {
    "Nat":200,
    "Pokemon":"Misdreavus",
    "Spe":85,
    "Total":435,
    "Type I":"Ghost",
    "EXPV":147,
    "Catch":45
  },
  {
    "Nat":201,
    "Pokemon":"Unown",
    "Spe":48,
    "Total":336,
    "Type I":"Psychic",
    "EXPV":61,
    "Catch":225
  },
  {
    "Nat":202,
    "Pokemon":"Wobbuffet",
    "Spe":33,
    "Total":405,
    "Type I":"Psychic",
    "EXPV":177,
    "Catch":45
  },
  {
    "Nat":203,
    "Pokemon":"Girafarig",
    "Spe":85,
    "Total":455,
    "Type I":"Normal",
    "EXPV":149,
    "Catch":60
  },
  {
    "Nat":204,
    "Pokemon":"Pineco",
    "Spe":15,
    "Total":290,
    "Type I":"Bug",
    "EXPV":60,
    "Catch":190
  },
  {
    "Nat":205,
    "Pokemon":"Forretress",
    "Spe":40,
    "Total":465,
    "Type I":"Bug",
    "EXPV":118,
    "Catch":75
  },
  {
    "Nat":206,
    "Pokemon":"Dunsparce",
    "Spe":45,
    "Total":415,
    "Type I":"Normal",
    "EXPV":125,
    "Catch":190
  },
  {
    "Nat":207,
    "Pokemon":"Gligar",
    "Spe":85,
    "Total":430,
    "Type I":"Ground",
    "EXPV":108,
    "Catch":60
  },
  {
    "Nat":208,
    "Pokemon":"Steelix",
    "Spe":30,
    "Total":510,
    "Type I":"Steel",
    "EXPV":196,
    "Catch":25
  },
  {
    "Nat":209,
    "Pokemon":"Snubbull",
    "Spe":30,
    "Total":300,
    "Type I":"Normal",
    "EXPV":63,
    "Catch":190
  },
  {
    "Nat":210,
    "Pokemon":"Granbull",
    "Spe":45,
    "Total":450,
    "Type I":"Normal",
    "EXPV":178,
    "Catch":75
  },
  {
    "Nat":211,
    "Pokemon":"Qwilfish",
    "Spe":85,
    "Total":430,
    "Type I":"Water",
    "EXPV":100,
    "Catch":45
  },
  {
    "Nat":212,
    "Pokemon":"Scizor",
    "Spe":65,
    "Total":500,
    "Type I":"Bug",
    "EXPV":200,
    "Catch":25
  },
  {
    "Nat":213,
    "Pokemon":"Shuckle",
    "Spe":5,
    "Total":505,
    "Type I":"Bug",
    "EXPV":80,
    "Catch":190
  },
  {
    "Nat":214,
    "Pokemon":"Heracross",
    "Spe":85,
    "Total":500,
    "Type I":"Bug",
    "EXPV":200,
    "Catch":45
  },
  {
    "Nat":215,
    "Pokemon":"Sneasel",
    "Spe":115,
    "Total":430,
    "Type I":"Dark",
    "EXPV":132,
    "Catch":60
  },
  {
    "Nat":216,
    "Pokemon":"Teddiursa",
    "Spe":40,
    "Total":330,
    "Type I":"Normal",
    "EXPV":124,
    "Catch":120
  },
  {
    "Nat":217,
    "Pokemon":"Ursaring",
    "Spe":55,
    "Total":500,
    "Type I":"Normal",
    "EXPV":189,
    "Catch":60
  },
  {
    "Nat":218,
    "Pokemon":"Slugma",
    "Spe":20,
    "Total":250,
    "Type I":"Fire",
    "EXPV":78,
    "Catch":190
  },
  {
    "Nat":219,
    "Pokemon":"Magcargo",
    "Spe":30,
    "Total":410,
    "Type I":"Fire",
    "EXPV":154,
    "Catch":75
  },
  {
    "Nat":220,
    "Pokemon":"Swinub",
    "Spe":50,
    "Total":250,
    "Type I":"Ice",
    "EXPV":78,
    "Catch":225
  },
  {
    "Nat":221,
    "Pokemon":"Piloswine",
    "Spe":50,
    "Total":450,
    "Type I":"Ice",
    "EXPV":160,
    "Catch":75
  },
  {
    "Nat":222,
    "Pokemon":"Corsola",
    "Spe":35,
    "Total":380,
    "Type I":"Water",
    "EXPV":113,
    "Catch":60
  },
  {
    "Nat":223,
    "Pokemon":"Remoraid",
    "Spe":65,
    "Total":300,
    "Type I":"Water",
    "EXPV":78,
    "Catch":190
  },
  {
    "Nat":224,
    "Pokemon":"Octillery",
    "Spe":45,
    "Total":480,
    "Type I":"Water",
    "EXPV":164,
    "Catch":75
  },
  {
    "Nat":225,
    "Pokemon":"Delibird",
    "Spe":75,
    "Total":330,
    "Type I":"Ice",
    "EXPV":183,
    "Catch":45
  },
  {
    "Nat":226,
    "Pokemon":"Mantine",
    "Spe":70,
    "Total":465,
    "Type I":"Water",
    "EXPV":168,
    "Catch":25
  },
  {
    "Nat":227,
    "Pokemon":"Skarmory",
    "Spe":70,
    "Total":465,
    "Type I":"Steel",
    "EXPV":168,
    "Catch":25
  },
  {
    "Nat":228,
    "Pokemon":"Houndour",
    "Spe":65,
    "Total":330,
    "Type I":"Dark",
    "EXPV":114,
    "Catch":120
  },
  {
    "Nat":229,
    "Pokemon":"Houndoom",
    "Spe":95,
    "Total":500,
    "Type I":"Dark",
    "EXPV":204,
    "Catch":45
  },
  {
    "Nat":230,
    "Pokemon":"Kingdra",
    "Spe":85,
    "Total":540,
    "Type I":"Water",
    "EXPV":207,
    "Catch":45
  },
  {
    "Nat":231,
    "Pokemon":"Phanpy",
    "Spe":40,
    "Total":330,
    "Type I":"Ground",
    "EXPV":124,
    "Catch":120
  },
  {
    "Nat":232,
    "Pokemon":"Donphan",
    "Spe":50,
    "Total":500,
    "Type I":"Ground",
    "EXPV":189,
    "Catch":60
  },
  {
    "Nat":233,
    "Pokemon":"Porygon2",
    "Spe":60,
    "Total":515,
    "Type I":"Normal",
    "EXPV":180,
    "Catch":45
  },
  {
    "Nat":234,
    "Pokemon":"Stantler",
    "Spe":85,
    "Total":465,
    "Type I":"Normal",
    "EXPV":165,
    "Catch":45
  },
  {
    "Nat":235,
    "Pokemon":"Smeargle",
    "Spe":75,
    "Total":250,
    "Type I":"Normal",
    "EXPV":106,
    "Catch":45
  },
  {
    "Nat":236,
    "Pokemon":"Tyrogue",
    "Spe":35,
    "Total":210,
    "Type I":"Fighting",
    "EXPV":91,
    "Catch":75
  },
  {
    "Nat":237,
    "Pokemon":"Hitmontop",
    "Spe":70,
    "Total":455,
    "Type I":"Fighting",
    "EXPV":138,
    "Catch":45
  },
  {
    "Nat":238,
    "Pokemon":"Smoochum",
    "Spe":65,
    "Total":305,
    "Type I":"Ice",
    "EXPV":87,
    "Catch":45
  },
  {
    "Nat":239,
    "Pokemon":"Elekid",
    "Spe":95,
    "Total":360,
    "Type I":"Electric",
    "EXPV":106,
    "Catch":45
  },
  {
    "Nat":240,
    "Pokemon":"Magby",
    "Spe":83,
    "Total":365,
    "Type I":"Fire",
    "EXPV":117,
    "Catch":45
  },
  {
    "Nat":241,
    "Pokemon":"Miltank",
    "Spe":100,
    "Total":490,
    "Type I":"Normal",
    "EXPV":200,
    "Catch":45
  },
  {
    "Nat":242,
    "Pokemon":"Blissey",
    "Spe":55,
    "Total":540,
    "Type I":"Normal",
    "EXPV":255,
    "Catch":30
  },
  {
    "Nat":243,
    "Pokemon":"Raikou",
    "Spe":115,
    "Total":580,
    "Type I":"Electric",
    "EXPV":216,
    "Catch":3
  },
  {
    "Nat":244,
    "Pokemon":"Entei",
    "Spe":100,
    "Total":580,
    "Type I":"Fire",
    "EXPV":217,
    "Catch":3
  },
  {
    "Nat":245,
    "Pokemon":"Suicune",
    "Spe":85,
    "Total":580,
    "Type I":"Water",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":246,
    "Pokemon":"Larvitar",
    "Spe":41,
    "Total":300,
    "Type I":"Rock",
    "EXPV":67,
    "Catch":45
  },
  {
    "Nat":247,
    "Pokemon":"Pupitar",
    "Spe":51,
    "Total":410,
    "Type I":"Rock",
    "EXPV":144,
    "Catch":45
  },
  {
    "Nat":248,
    "Pokemon":"Tyranitar",
    "Spe":61,
    "Total":600,
    "Type I":"Rock",
    "EXPV":218,
    "Catch":45
  },
  {
    "Nat":249,
    "Pokemon":"Lugia",
    "Spe":110,
    "Total":680,
    "Type I":"Psychic",
    "EXPV":220,
    "Catch":3
  },
  {
    "Nat":250,
    "Pokemon":"Ho-oh",
    "Spe":90,
    "Total":680,
    "Type I":"Fire",
    "EXPV":220,
    "Catch":3
  },
  {
    "Nat":251,
    "Pokemon":"Celebi",
    "Spe":100,
    "Total":600,
    "Type I":"Psychic",
    "EXPV":64,
    "Catch":45
  },
  {
    "Nat":252,
    "Pokemon":"Treecko",
    "Spe":70,
    "Total":310,
    "Type I":"Grass",
    "EXPV":65,
    "Catch":45
  },
  {
    "Nat":253,
    "Pokemon":"Grovyle",
    "Spe":95,
    "Total":405,
    "Type I":"Grass",
    "EXPV":141,
    "Catch":45
  },
  {
    "Nat":254,
    "Pokemon":"Sceptile",
    "Spe":120,
    "Total":530,
    "Type I":"Grass",
    "EXPV":208,
    "Catch":45
  },
  {
    "Nat":255,
    "Pokemon":"Torchic",
    "Spe":45,
    "Total":310,
    "Type I":"Fire",
    "EXPV":65,
    "Catch":45
  },
  {
    "Nat":256,
    "Pokemon":"Combusken",
    "Spe":55,
    "Total":405,
    "Type I":"Fire",
    "EXPV":142,
    "Catch":45
  },
  {
    "Nat":257,
    "Pokemon":"Blaziken",
    "Spe":80,
    "Total":530,
    "Type I":"Fire",
    "EXPV":209,
    "Catch":45
  },
  {
    "Nat":258,
    "Pokemon":"Mudkip",
    "Spe":40,
    "Total":310,
    "Type I":"Water",
    "EXPV":65,
    "Catch":45
  },
  {
    "Nat":259,
    "Pokemon":"Marshtomp",
    "Spe":50,
    "Total":405,
    "Type I":"Water",
    "EXPV":143,
    "Catch":45
  },
  {
    "Nat":260,
    "Pokemon":"Swampert",
    "Spe":60,
    "Total":535,
    "Type I":"Water",
    "EXPV":210,
    "Catch":45
  },
  {
    "Nat":261,
    "Pokemon":"Poochyena",
    "Spe":35,
    "Total":220,
    "Type I":"Dark",
    "EXPV":55,
    "Catch":255
  },
  {
    "Nat":262,
    "Pokemon":"Mightyena",
    "Spe":70,
    "Total":420,
    "Type I":"Dark",
    "EXPV":128,
    "Catch":127
  },
  {
    "Nat":263,
    "Pokemon":"Zigzagoon",
    "Spe":60,
    "Total":240,
    "Type I":"Normal",
    "EXPV":60,
    "Catch":255
  },
  {
    "Nat":264,
    "Pokemon":"Linoone",
    "Spe":100,
    "Total":420,
    "Type I":"Normal",
    "EXPV":128,
    "Catch":90
  },
  {
    "Nat":265,
    "Pokemon":"Wurmple",
    "Spe":20,
    "Total":195,
    "Type I":"Bug",
    "EXPV":54,
    "Catch":255
  },
  {
    "Nat":266,
    "Pokemon":"Silcoon",
    "Spe":15,
    "Total":205,
    "Type I":"Bug",
    "EXPV":72,
    "Catch":120
  },
  {
    "Nat":267,
    "Pokemon":"Beautifly",
    "Spe":65,
    "Total":385,
    "Type I":"Bug",
    "EXPV":161,
    "Catch":45
  },
  {
    "Nat":268,
    "Pokemon":"Cascoon",
    "Spe":15,
    "Total":205,
    "Type I":"Bug",
    "EXPV":72,
    "Catch":120
  },
  {
    "Nat":269,
    "Pokemon":"Dustox",
    "Spe":65,
    "Total":385,
    "Type I":"Bug",
    "EXPV":161,
    "Catch":45
  },
  {
    "Nat":270,
    "Pokemon":"Lotad",
    "Spe":30,
    "Total":220,
    "Type I":"Water",
    "EXPV":74,
    "Catch":255
  },
  {
    "Nat":271,
    "Pokemon":"Lombre",
    "Spe":50,
    "Total":340,
    "Type I":"Water",
    "EXPV":141,
    "Catch":120
  },
  {
    "Nat":272,
    "Pokemon":"Ludicolo",
    "Spe":70,
    "Total":480,
    "Type I":"Water",
    "EXPV":181,
    "Catch":45
  },
  {
    "Nat":273,
    "Pokemon":"Seedot",
    "Spe":30,
    "Total":220,
    "Type I":"Grass",
    "EXPV":74,
    "Catch":255
  },
  {
    "Nat":274,
    "Pokemon":"Nuzleaf",
    "Spe":60,
    "Total":340,
    "Type I":"Grass",
    "EXPV":141,
    "Catch":120
  },
  {
    "Nat":275,
    "Pokemon":"Shiftry",
    "Spe":80,
    "Total":480,
    "Type I":"Grass",
    "EXPV":181,
    "Catch":45
  },
  {
    "Nat":276,
    "Pokemon":"Taillow",
    "Spe":85,
    "Total":270,
    "Type I":"Normal",
    "EXPV":59,
    "Catch":200
  },
  {
    "Nat":277,
    "Pokemon":"Swellow",
    "Spe":125,
    "Total":430,
    "Type I":"Normal",
    "EXPV":162,
    "Catch":45
  },
  {
    "Nat":278,
    "Pokemon":"Wingull",
    "Spe":85,
    "Total":270,
    "Type I":"Water",
    "EXPV":64,
    "Catch":190
  },
  {
    "Nat":279,
    "Pokemon":"Pelipper",
    "Spe":65,
    "Total":430,
    "Type I":"Water",
    "EXPV":164,
    "Catch":45
  },
  {
    "Nat":280,
    "Pokemon":"Ralts",
    "Spe":40,
    "Total":198,
    "Type I":"Psychic",
    "EXPV":70,
    "Catch":235
  },
  {
    "Nat":281,
    "Pokemon":"Kirlia",
    "Spe":50,
    "Total":278,
    "Type I":"Psychic",
    "EXPV":140,
    "Catch":120
  },
  {
    "Nat":282,
    "Pokemon":"Gardevoir",
    "Spe":80,
    "Total":518,
    "Type I":"Psychic",
    "EXPV":208,
    "Catch":45
  },
  {
    "Nat":283,
    "Pokemon":"Surskit",
    "Spe":65,
    "Total":269,
    "Type I":"Bug",
    "EXPV":63,
    "Catch":200
  },
  {
    "Nat":284,
    "Pokemon":"Masquerain",
    "Spe":60,
    "Total":414,
    "Type I":"Bug",
    "EXPV":128,
    "Catch":75
  },
  {
    "Nat":285,
    "Pokemon":"Shroomish",
    "Spe":35,
    "Total":295,
    "Type I":"Grass",
    "EXPV":65,
    "Catch":255
  },
  {
    "Nat":286,
    "Pokemon":"Breloom",
    "Spe":70,
    "Total":460,
    "Type I":"Grass",
    "EXPV":165,
    "Catch":90
  },
  {
    "Nat":287,
    "Pokemon":"Slakoth",
    "Spe":30,
    "Total":280,
    "Type I":"Normal",
    "EXPV":83,
    "Catch":255
  },
  {
    "Nat":288,
    "Pokemon":"Vigoroth",
    "Spe":90,
    "Total":440,
    "Type I":"Normal",
    "EXPV":126,
    "Catch":120
  },
  {
    "Nat":289,
    "Pokemon":"Slaking",
    "Spe":100,
    "Total":670,
    "Type I":"Normal",
    "EXPV":210,
    "Catch":45
  },
  {
    "Nat":290,
    "Pokemon":"Nincada",
    "Spe":40,
    "Total":266,
    "Type I":"Bug",
    "EXPV":65,
    "Catch":255
  },
  {
    "Nat":291,
    "Pokemon":"Ninjask",
    "Spe":160,
    "Total":456,
    "Type I":"Bug",
    "EXPV":155,
    "Catch":120
  },
  {
    "Nat":292,
    "Pokemon":"Shedinja",
    "Spe":40,
    "Total":236,
    "Type I":"Bug",
    "EXPV":95,
    "Catch":45
  },
  {
    "Nat":293,
    "Pokemon":"Whismur",
    "Spe":28,
    "Total":240,
    "Type I":"Normal",
    "EXPV":68,
    "Catch":190
  },
  {
    "Nat":294,
    "Pokemon":"Loudred",
    "Spe":48,
    "Total":360,
    "Type I":"Normal",
    "EXPV":126,
    "Catch":120
  },
  {
    "Nat":295,
    "Pokemon":"Exploud",
    "Spe":68,
    "Total":480,
    "Type I":"Normal",
    "EXPV":184,
    "Catch":45
  },
  {
    "Nat":296,
    "Pokemon":"Makuhita",
    "Spe":25,
    "Total":237,
    "Type I":"Fighting",
    "EXPV":87,
    "Catch":180
  },
  {
    "Nat":297,
    "Pokemon":"Hariyama",
    "Spe":50,
    "Total":474,
    "Type I":"Fighting",
    "EXPV":184,
    "Catch":200
  },
  {
    "Nat":298,
    "Pokemon":"Azurill",
    "Spe":20,
    "Total":190,
    "Type I":"Normal",
    "EXPV":33,
    "Catch":150
  },
  {
    "Nat":299,
    "Pokemon":"Nosepass",
    "Spe":30,
    "Total":375,
    "Type I":"Rock",
    "EXPV":108,
    "Catch":255
  },
  {
    "Nat":300,
    "Pokemon":"Skitty",
    "Spe":50,
    "Total":260,
    "Type I":"Normal",
    "EXPV":65,
    "Catch":255
  },
  {
    "Nat":301,
    "Pokemon":"Delcatty",
    "Spe":70,
    "Total":380,
    "Type I":"Normal",
    "EXPV":138,
    "Catch":60
  },
  {
    "Nat":302,
    "Pokemon":"Sableye",
    "Spe":50,
    "Total":380,
    "Type I":"Dark",
    "EXPV":98,
    "Catch":45
  },
  {
    "Nat":303,
    "Pokemon":"Mawile",
    "Spe":50,
    "Total":380,
    "Type I":"Steel",
    "EXPV":98,
    "Catch":45
  },
  {
    "Nat":304,
    "Pokemon":"Aron",
    "Spe":30,
    "Total":330,
    "Type I":"Steel",
    "EXPV":96,
    "Catch":180
  },
  {
    "Nat":305,
    "Pokemon":"Lairon",
    "Spe":40,
    "Total":430,
    "Type I":"Steel",
    "EXPV":152,
    "Catch":90
  },
  {
    "Nat":306,
    "Pokemon":"Aggron",
    "Spe":50,
    "Total":530,
    "Type I":"Steel",
    "EXPV":205,
    "Catch":45
  },
  {
    "Nat":307,
    "Pokemon":"Meditite",
    "Spe":60,
    "Total":280,
    "Type I":"Fighting",
    "EXPV":91,
    "Catch":180
  },
  {
    "Nat":308,
    "Pokemon":"Medicham",
    "Spe":80,
    "Total":410,
    "Type I":"Fighting",
    "EXPV":153,
    "Catch":90
  },
  {
    "Nat":309,
    "Pokemon":"Electrike",
    "Spe":65,
    "Total":295,
    "Type I":"Electric",
    "EXPV":104,
    "Catch":120
  },
  {
    "Nat":310,
    "Pokemon":"Manectric",
    "Spe":105,
    "Total":475,
    "Type I":"Electric",
    "EXPV":168,
    "Catch":45
  },
  {
    "Nat":311,
    "Pokemon":"Plusle",
    "Spe":95,
    "Total":405,
    "Type I":"Electric",
    "EXPV":120,
    "Catch":200
  },
  {
    "Nat":312,
    "Pokemon":"Minun",
    "Spe":95,
    "Total":405,
    "Type I":"Electric",
    "EXPV":120,
    "Catch":200
  },
  {
    "Nat":313,
    "Pokemon":"Volbeat",
    "Spe":85,
    "Total":400,
    "Type I":"Bug",
    "EXPV":146,
    "Catch":150
  },
  {
    "Nat":314,
    "Pokemon":"Illumise",
    "Spe":85,
    "Total":400,
    "Type I":"Bug",
    "EXPV":146,
    "Catch":150
  },
  {
    "Nat":315,
    "Pokemon":"Roselia",
    "Spe":65,
    "Total":400,
    "Type I":"Grass",
    "EXPV":152,
    "Catch":150
  },
  {
    "Nat":316,
    "Pokemon":"Gulpin",
    "Spe":40,
    "Total":302,
    "Type I":"Poison",
    "EXPV":75,
    "Catch":225
  },
  {
    "Nat":317,
    "Pokemon":"Swalot",
    "Spe":55,
    "Total":467,
    "Type I":"Poison",
    "EXPV":168,
    "Catch":75
  },
  {
    "Nat":318,
    "Pokemon":"Carvanha",
    "Spe":65,
    "Total":305,
    "Type I":"Water",
    "EXPV":88,
    "Catch":225
  },
  {
    "Nat":319,
    "Pokemon":"Sharpedo",
    "Spe":95,
    "Total":460,
    "Type I":"Water",
    "EXPV":175,
    "Catch":60
  },
  {
    "Nat":320,
    "Pokemon":"Wailmer",
    "Spe":60,
    "Total":400,
    "Type I":"Water",
    "EXPV":137,
    "Catch":125
  },
  {
    "Nat":321,
    "Pokemon":"Wailord",
    "Spe":60,
    "Total":500,
    "Type I":"Water",
    "EXPV":206,
    "Catch":60
  },
  {
    "Nat":322,
    "Pokemon":"Numel",
    "Spe":35,
    "Total":305,
    "Type I":"Fire",
    "EXPV":88,
    "Catch":255
  },
  {
    "Nat":323,
    "Pokemon":"Camerupt",
    "Spe":40,
    "Total":460,
    "Type I":"Fire",
    "EXPV":175,
    "Catch":150
  },
  {
    "Nat":324,
    "Pokemon":"Torkoal",
    "Spe":20,
    "Total":470,
    "Type I":"Fire",
    "EXPV":161,
    "Catch":90
  },
  {
    "Nat":325,
    "Pokemon":"Spoink",
    "Spe":60,
    "Total":330,
    "Type I":"Psychic",
    "EXPV":89,
    "Catch":255
  },
  {
    "Nat":326,
    "Pokemon":"Grumpig",
    "Spe":80,
    "Total":470,
    "Type I":"Psychic",
    "EXPV":164,
    "Catch":60
  },
  {
    "Nat":327,
    "Pokemon":"Spinda",
    "Spe":60,
    "Total":360,
    "Type I":"Normal",
    "EXPV":85,
    "Catch":255
  },
  {
    "Nat":328,
    "Pokemon":"Trapinch",
    "Spe":10,
    "Total":290,
    "Type I":"Ground",
    "EXPV":73,
    "Catch":255
  },
  {
    "Nat":329,
    "Pokemon":"Vibrava",
    "Spe":70,
    "Total":340,
    "Type I":"Ground",
    "EXPV":126,
    "Catch":120
  },
  {
    "Nat":330,
    "Pokemon":"Flygon",
    "Spe":100,
    "Total":520,
    "Type I":"Ground",
    "EXPV":197,
    "Catch":45
  },
  {
    "Nat":331,
    "Pokemon":"Cacnea",
    "Spe":35,
    "Total":335,
    "Type I":"Grass",
    "EXPV":97,
    "Catch":190
  },
  {
    "Nat":332,
    "Pokemon":"Cacturne",
    "Spe":55,
    "Total":475,
    "Type I":"Grass",
    "EXPV":177,
    "Catch":60
  },
  {
    "Nat":333,
    "Pokemon":"Swablu",
    "Spe":50,
    "Total":310,
    "Type I":"Normal",
    "EXPV":74,
    "Catch":255
  },
  {
    "Nat":334,
    "Pokemon":"Altaria",
    "Spe":80,
    "Total":490,
    "Type I":"Dragon",
    "EXPV":188,
    "Catch":45
  },
  {
    "Nat":335,
    "Pokemon":"Zangoose",
    "Spe":90,
    "Total":458,
    "Type I":"Normal",
    "EXPV":165,
    "Catch":90
  },
  {
    "Nat":336,
    "Pokemon":"Seviper",
    "Spe":65,
    "Total":458,
    "Type I":"Poison",
    "EXPV":165,
    "Catch":90
  },
  {
    "Nat":337,
    "Pokemon":"Lunatone",
    "Spe":70,
    "Total":440,
    "Type I":"Rock",
    "EXPV":150,
    "Catch":45
  },
  {
    "Nat":338,
    "Pokemon":"Solrock",
    "Spe":70,
    "Total":440,
    "Type I":"Rock",
    "EXPV":150,
    "Catch":45
  },
  {
    "Nat":339,
    "Pokemon":"Barboach",
    "Spe":60,
    "Total":288,
    "Type I":"Water",
    "EXPV":92,
    "Catch":190
  },
  {
    "Nat":340,
    "Pokemon":"Whiscash",
    "Spe":60,
    "Total":468,
    "Type I":"Water",
    "EXPV":158,
    "Catch":75
  },
  {
    "Nat":341,
    "Pokemon":"Corphish",
    "Spe":35,
    "Total":308,
    "Type I":"Water",
    "EXPV":111,
    "Catch":205
  },
  {
    "Nat":342,
    "Pokemon":"Crawdaunt",
    "Spe":55,
    "Total":468,
    "Type I":"Water",
    "EXPV":161,
    "Catch":155
  },
  {
    "Nat":343,
    "Pokemon":"Baltoy",
    "Spe":55,
    "Total":300,
    "Type I":"Ground",
    "EXPV":58,
    "Catch":255
  },
  {
    "Nat":344,
    "Pokemon":"Claydol",
    "Spe":75,
    "Total":500,
    "Type I":"Ground",
    "EXPV":189,
    "Catch":90
  },
  {
    "Nat":345,
    "Pokemon":"Lileep",
    "Spe":23,
    "Total":355,
    "Type I":"Rock",
    "EXPV":99,
    "Catch":45
  },
  {
    "Nat":346,
    "Pokemon":"Cradily",
    "Spe":43,
    "Total":495,
    "Type I":"Rock",
    "EXPV":199,
    "Catch":45
  },
  {
    "Nat":347,
    "Pokemon":"Anorith",
    "Spe":75,
    "Total":355,
    "Type I":"Rock",
    "EXPV":99,
    "Catch":45
  },
  {
    "Nat":348,
    "Pokemon":"Armaldo",
    "Spe":45,
    "Total":495,
    "Type I":"Rock",
    "EXPV":199,
    "Catch":45
  },
  {
    "Nat":349,
    "Pokemon":"Feebas",
    "Spe":80,
    "Total":200,
    "Type I":"Water",
    "EXPV":61,
    "Catch":255
  },
  {
    "Nat":350,
    "Pokemon":"Milotic",
    "Spe":81,
    "Total":540,
    "Type I":"Water",
    "EXPV":213,
    "Catch":60
  },
  {
    "Nat":351,
    "Pokemon":"Castform",
    "Spe":70,
    "Total":420,
    "Type I":"Normal",
    "EXPV":145,
    "Catch":45
  },
  {
    "Nat":352,
    "Pokemon":"Kecleon",
    "Spe":40,
    "Total":440,
    "Type I":"Normal",
    "EXPV":132,
    "Catch":200
  },
  {
    "Nat":353,
    "Pokemon":"Shuppet",
    "Spe":45,
    "Total":295,
    "Type I":"Ghost",
    "EXPV":97,
    "Catch":225
  },
  {
    "Nat":354,
    "Pokemon":"Banette",
    "Spe":65,
    "Total":455,
    "Type I":"Ghost",
    "EXPV":179,
    "Catch":45
  },
  {
    "Nat":355,
    "Pokemon":"Duskull",
    "Spe":25,
    "Total":295,
    "Type I":"Ghost",
    "EXPV":97,
    "Catch":190
  },
  {
    "Nat":356,
    "Pokemon":"Dusclops",
    "Spe":25,
    "Total":455,
    "Type I":"Ghost",
    "EXPV":179,
    "Catch":90
  },
  {
    "Nat":357,
    "Pokemon":"Tropius",
    "Spe":51,
    "Total":460,
    "Type I":"Grass",
    "EXPV":169,
    "Catch":200
  },
  {
    "Nat":358,
    "Pokemon":"Chimecho",
    "Spe":65,
    "Total":425,
    "Type I":"Psychic",
    "EXPV":147,
    "Catch":45
  },
  {
    "Nat":359,
    "Pokemon":"Absol",
    "Spe":75,
    "Total":465,
    "Type I":"Dark",
    "EXPV":174,
    "Catch":30
  },
  {
    "Nat":360,
    "Pokemon":"Wynaut",
    "Spe":23,
    "Total":260,
    "Type I":"Psychic",
    "EXPV":44,
    "Catch":125
  },
  {
    "Nat":361,
    "Pokemon":"Snorunt",
    "Spe":50,
    "Total":300,
    "Type I":"Ice",
    "EXPV":74,
    "Catch":190
  },
  {
    "Nat":362,
    "Pokemon":"Glalie",
    "Spe":80,
    "Total":480,
    "Type I":"Ice",
    "EXPV":187,
    "Catch":75
  },
  {
    "Nat":363,
    "Pokemon":"Spheal",
    "Spe":25,
    "Total":290,
    "Type I":"Ice",
    "EXPV":75,
    "Catch":255
  },
  {
    "Nat":364,
    "Pokemon":"Sealeo",
    "Spe":45,
    "Total":410,
    "Type I":"Ice",
    "EXPV":128,
    "Catch":120
  },
  {
    "Nat":365,
    "Pokemon":"Walrein",
    "Spe":65,
    "Total":530,
    "Type I":"Ice",
    "EXPV":192,
    "Catch":45
  },
  {
    "Nat":366,
    "Pokemon":"Clamperl",
    "Spe":32,
    "Total":345,
    "Type I":"Water",
    "EXPV":142,
    "Catch":255
  },
  {
    "Nat":367,
    "Pokemon":"Huntail",
    "Spe":52,
    "Total":485,
    "Type I":"Water",
    "EXPV":178,
    "Catch":60
  },
  {
    "Nat":368,
    "Pokemon":"Gorebyss",
    "Spe":52,
    "Total":485,
    "Type I":"Water",
    "EXPV":178,
    "Catch":60
  },
  {
    "Nat":369,
    "Pokemon":"Relicanth",
    "Spe":55,
    "Total":485,
    "Type I":"Water",
    "EXPV":198,
    "Catch":25
  },
  {
    "Nat":370,
    "Pokemon":"Luvdisc",
    "Spe":97,
    "Total":330,
    "Type I":"Water",
    "EXPV":110,
    "Catch":225
  },
  {
    "Nat":371,
    "Pokemon":"Bagon",
    "Spe":50,
    "Total":300,
    "Type I":"Dragon",
    "EXPV":89,
    "Catch":45
  },
  {
    "Nat":372,
    "Pokemon":"Shelgon",
    "Spe":50,
    "Total":420,
    "Type I":"Dragon",
    "EXPV":144,
    "Catch":45
  },
  {
    "Nat":373,
    "Pokemon":"Salamence",
    "Spe":100,
    "Total":600,
    "Type I":"Dragon",
    "EXPV":218,
    "Catch":45
  },
  {
    "Nat":374,
    "Pokemon":"Beldum",
    "Spe":30,
    "Total":300,
    "Type I":"Steel",
    "EXPV":103,
    "Catch":3
  },
  {
    "Nat":375,
    "Pokemon":"Metang",
    "Spe":50,
    "Total":420,
    "Type I":"Steel",
    "EXPV":153,
    "Catch":3
  },
  {
    "Nat":376,
    "Pokemon":"Metagross",
    "Spe":70,
    "Total":600,
    "Type I":"Steel",
    "EXPV":210,
    "Catch":3
  },
  {
    "Nat":377,
    "Pokemon":"Regirock",
    "Spe":50,
    "Total":580,
    "Type I":"Rock",
    "EXPV":217,
    "Catch":3
  },
  {
    "Nat":378,
    "Pokemon":"Regice",
    "Spe":50,
    "Total":580,
    "Type I":"Ice",
    "EXPV":216,
    "Catch":3
  },
  {
    "Nat":379,
    "Pokemon":"Registeel",
    "Spe":50,
    "Total":580,
    "Type I":"Steel",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":380,
    "Pokemon":"Latias",
    "Spe":110,
    "Total":600,
    "Type I":"Dragon",
    "EXPV":211,
    "Catch":3
  },
  {
    "Nat":381,
    "Pokemon":"Latios",
    "Spe":110,
    "Total":600,
    "Type I":"Dragon",
    "EXPV":211,
    "Catch":3
  },
  {
    "Nat":382,
    "Pokemon":"Kyogre",
    "Spe":90,
    "Total":670,
    "Type I":"Water",
    "EXPV":218,
    "Catch":5
  },
  {
    "Nat":383,
    "Pokemon":"Groudon",
    "Spe":90,
    "Total":670,
    "Type I":"Ground",
    "EXPV":218,
    "Catch":5
  },
  {
    "Nat":384,
    "Pokemon":"Rayquaza",
    "Spe":95,
    "Total":680,
    "Type I":"Dragon",
    "EXPV":220,
    "Catch":3
  },
  {
    "Nat":385,
    "Pokemon":"Jirachi",
    "Spe":100,
    "Total":600,
    "Type I":"Steel",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":386,
    "Pokemon":"Deoxys (N)",
    "Spe":150,
    "Total":600,
    "Type I":"Psychic",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":386.1,
    "Pokemon":"Deoxys (A)",
    "Spe":150,
    "Total":600,
    "Type I":"Psychic",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":386.2,
    "Pokemon":"Deoxys (D)",
    "Spe":90,
    "Total":600,
    "Type I":"Psychic",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":386.3,
    "Pokemon":"Deoxys (S)",
    "Spe":180,
    "Total":600,
    "Type I":"Psychic",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":387,
    "Pokemon":"Turtwig",
    "Spe":31,
    "Total":318,
    "Type I":"Grass",
    "EXPV":64,
    "Catch":45
  },
  {
    "Nat":388,
    "Pokemon":"Grotle",
    "Spe":36,
    "Total":405,
    "Type I":"Grass",
    "EXPV":141,
    "Catch":45
  },
  {
    "Nat":389,
    "Pokemon":"Torterra",
    "Spe":56,
    "Total":525,
    "Type I":"Grass",
    "EXPV":208,
    "Catch":45
  },
  {
    "Nat":390,
    "Pokemon":"Chimchar",
    "Spe":61,
    "Total":309,
    "Type I":"Fire",
    "EXPV":65,
    "Catch":45
  },
  {
    "Nat":391,
    "Pokemon":"Monferno",
    "Spe":81,
    "Total":405,
    "Type I":"Fire",
    "EXPV":142,
    "Catch":45
  },
  {
    "Nat":392,
    "Pokemon":"Infernape",
    "Spe":108,
    "Total":534,
    "Type I":"Fire",
    "EXPV":209,
    "Catch":45
  },
  {
    "Nat":393,
    "Pokemon":"Piplup",
    "Spe":40,
    "Total":314,
    "Type I":"Water",
    "EXPV":66,
    "Catch":45
  },
  {
    "Nat":394,
    "Pokemon":"Prinplup",
    "Spe":50,
    "Total":405,
    "Type I":"Water",
    "EXPV":143,
    "Catch":45
  },
  {
    "Nat":395,
    "Pokemon":"Empoleon",
    "Spe":60,
    "Total":530,
    "Type I":"Water",
    "EXPV":210,
    "Catch":45
  },
  {
    "Nat":396,
    "Pokemon":"Starly",
    "Spe":60,
    "Total":245,
    "Type I":"Normal",
    "EXPV":56,
    "Catch":255
  },
  {
    "Nat":397,
    "Pokemon":"Staravia",
    "Spe":80,
    "Total":340,
    "Type I":"Normal",
    "EXPV":113,
    "Catch":120
  },
  {
    "Nat":398,
    "Pokemon":"Staraptor",
    "Spe":100,
    "Total":475,
    "Type I":"Normal",
    "EXPV":172,
    "Catch":45
  },
  {
    "Nat":399,
    "Pokemon":"Bidoof",
    "Spe":31,
    "Total":250,
    "Type I":"Normal",
    "EXPV":58,
    "Catch":255
  },
  {
    "Nat":400,
    "Pokemon":"Bibarel",
    "Spe":55,
    "Total":410,
    "Type I":"Normal",
    "EXPV":116,
    "Catch":127
  },
  {
    "Nat":401,
    "Pokemon":"Kricketot",
    "Spe":25,
    "Total":194,
    "Type I":"Bug",
    "EXPV":54,
    "Catch":255
  },
  {
    "Nat":402,
    "Pokemon":"Kricketune",
    "Spe":65,
    "Total":384,
    "Type I":"Bug",
    "EXPV":159,
    "Catch":45
  },
  {
    "Nat":403,
    "Pokemon":"Shinx",
    "Spe":45,
    "Total":263,
    "Type I":"Electric",
    "EXPV":60,
    "Catch":235
  },
  {
    "Nat":404,
    "Pokemon":"Luxio",
    "Spe":60,
    "Total":363,
    "Type I":"Electric",
    "EXPV":117,
    "Catch":120
  },
  {
    "Nat":405,
    "Pokemon":"Luxray",
    "Spe":70,
    "Total":523,
    "Type I":"Electric",
    "EXPV":194,
    "Catch":45
  },
  {
    "Nat":406,
    "Pokemon":"Budew",
    "Spe":55,
    "Total":280,
    "Type I":"Grass",
    "EXPV":68,
    "Catch":255
  },
  {
    "Nat":407,
    "Pokemon":"Roserade",
    "Spe":90,
    "Total":505,
    "Type I":"Grass",
    "EXPV":204,
    "Catch":75
  },
  {
    "Nat":408,
    "Pokemon":"Cranidos",
    "Spe":58,
    "Total":350,
    "Type I":"Rock",
    "EXPV":99,
    "Catch":45
  },
  {
    "Nat":409,
    "Pokemon":"Rampardos",
    "Spe":58,
    "Total":495,
    "Type I":"Rock",
    "EXPV":199,
    "Catch":45
  },
  {
    "Nat":410,
    "Pokemon":"Shieldon",
    "Spe":30,
    "Total":350,
    "Type I":"Rock",
    "EXPV":99,
    "Catch":45
  },
  {
    "Nat":411,
    "Pokemon":"Bastiodon",
    "Spe":30,
    "Total":495,
    "Type I":"Rock",
    "EXPV":199,
    "Catch":45
  },
  {
    "Nat":412,
    "Pokemon":"Burmy",
    "Spe":36,
    "Total":224,
    "Type I":"Bug",
    "EXPV":61,
    "Catch":120
  },
  {
    "Nat":413,
    "Pokemon":"Wormadam (P)",
    "Spe":36,
    "Total":424,
    "Type I":"Bug",
    "EXPV":159,
    "Catch":45
  },
  {
    "Nat":413.1,
    "Pokemon":"Wormadam (S)",
    "Spe":36,
    "Total":424,
    "Type I":"Bug",
    "EXPV":159,
    "Catch":45
  },
  {
    "Nat":413.2,
    "Pokemon":"Wormadam (T)",
    "Spe":36,
    "Total":424,
    "Type I":"Bug",
    "EXPV":159,
    "Catch":45
  },
  {
    "Nat":414,
    "Pokemon":"Mothim",
    "Spe":66,
    "Total":424,
    "Type I":"Bug",
    "EXPV":159,
    "Catch":45
  },
  {
    "Nat":415,
    "Pokemon":"Combee",
    "Spe":70,
    "Total":244,
    "Type I":"Bug",
    "EXPV":63,
    "Catch":120
  },
  {
    "Nat":416,
    "Pokemon":"Vespiquen",
    "Spe":40,
    "Total":474,
    "Type I":"Bug",
    "EXPV":188,
    "Catch":45
  },
  {
    "Nat":417,
    "Pokemon":"Pachirisu",
    "Spe":95,
    "Total":405,
    "Type I":"Electric",
    "EXPV":120,
    "Catch":200
  },
  {
    "Nat":418,
    "Pokemon":"Buizel",
    "Spe":85,
    "Total":330,
    "Type I":"Water",
    "EXPV":75,
    "Catch":190
  },
  {
    "Nat":419,
    "Pokemon":"Floatzel",
    "Spe":115,
    "Total":495,
    "Type I":"Water",
    "EXPV":178,
    "Catch":75
  },
  {
    "Nat":420,
    "Pokemon":"Cherubi",
    "Spe":35,
    "Total":275,
    "Type I":"Grass",
    "EXPV":68,
    "Catch":190
  },
  {
    "Nat":421,
    "Pokemon":"Cherrim",
    "Spe":85,
    "Total":450,
    "Type I":"Grass",
    "EXPV":133,
    "Catch":75
  },
  {
    "Nat":422,
    "Pokemon":"Shellos",
    "Spe":34,
    "Total":325,
    "Type I":"Water",
    "EXPV":73,
    "Catch":190
  },
  {
    "Nat":423,
    "Pokemon":"Gastrodon",
    "Spe":39,
    "Total":475,
    "Type I":"Water",
    "EXPV":176,
    "Catch":75
  },
  {
    "Nat":424,
    "Pokemon":"Ambipom",
    "Spe":115,
    "Total":482,
    "Type I":"Normal",
    "EXPV":186,
    "Catch":45
  },
  {
    "Nat":425,
    "Pokemon":"Drifloon",
    "Spe":70,
    "Total":348,
    "Type I":"Ghost",
    "EXPV":127,
    "Catch":125
  },
  {
    "Nat":426,
    "Pokemon":"Drifblim",
    "Spe":80,
    "Total":498,
    "Type I":"Ghost",
    "EXPV":204,
    "Catch":60
  },
  {
    "Nat":427,
    "Pokemon":"Buneary",
    "Spe":85,
    "Total":350,
    "Type I":"Normal",
    "EXPV":84,
    "Catch":190
  },
  {
    "Nat":428,
    "Pokemon":"Lopunny",
    "Spe":105,
    "Total":480,
    "Type I":"Normal",
    "EXPV":178,
    "Catch":60
  },
  {
    "Nat":429,
    "Pokemon":"Mismagius",
    "Spe":105,
    "Total":495,
    "Type I":"Ghost",
    "EXPV":187,
    "Catch":45
  },
  {
    "Nat":430,
    "Pokemon":"Honchkrow",
    "Spe":71,
    "Total":505,
    "Type I":"Dark",
    "EXPV":187,
    "Catch":30
  },
  {
    "Nat":431,
    "Pokemon":"Glameow",
    "Spe":85,
    "Total":310,
    "Type I":"Normal",
    "EXPV":71,
    "Catch":190
  },
  {
    "Nat":432,
    "Pokemon":"Purugly",
    "Spe":112,
    "Total":452,
    "Type I":"Normal",
    "EXPV":183,
    "Catch":75
  },
  {
    "Nat":433,
    "Pokemon":"Chingling",
    "Spe":45,
    "Total":285,
    "Type I":"Psychic",
    "EXPV":74,
    "Catch":120
  },
  {
    "Nat":434,
    "Pokemon":"Stunky",
    "Spe":74,
    "Total":329,
    "Type I":"Poison",
    "EXPV":79,
    "Catch":225
  },
  {
    "Nat":435,
    "Pokemon":"Skuntank",
    "Spe":84,
    "Total":479,
    "Type I":"Poison",
    "EXPV":209,
    "Catch":60
  },
  {
    "Nat":436,
    "Pokemon":"Bronzor",
    "Spe":23,
    "Total":300,
    "Type I":"Steel",
    "EXPV":72,
    "Catch":255
  },
  {
    "Nat":437,
    "Pokemon":"Bronzong",
    "Spe":33,
    "Total":500,
    "Type I":"Steel",
    "EXPV":188,
    "Catch":90
  },
  {
    "Nat":438,
    "Pokemon":"Bonsly",
    "Spe":10,
    "Total":290,
    "Type I":"Rock",
    "EXPV":68,
    "Catch":255
  },
  {
    "Nat":439,
    "Pokemon":"Mime Jr.",
    "Spe":60,
    "Total":310,
    "Type I":"Psychic",
    "EXPV":78,
    "Catch":145
  },
  {
    "Nat":440,
    "Pokemon":"Happiny",
    "Spe":30,
    "Total":220,
    "Type I":"Normal",
    "EXPV":255,
    "Catch":130
  },
  {
    "Nat":441,
    "Pokemon":"Chatot",
    "Spe":91,
    "Total":411,
    "Type I":"Normal",
    "EXPV":107,
    "Catch":30
  },
  {
    "Nat":442,
    "Pokemon":"Spiritomb",
    "Spe":35,
    "Total":485,
    "Type I":"Ghost",
    "EXPV":168,
    "Catch":100
  },
  {
    "Nat":443,
    "Pokemon":"Gible",
    "Spe":42,
    "Total":300,
    "Type I":"Dragon",
    "EXPV":67,
    "Catch":45
  },
  {
    "Nat":444,
    "Pokemon":"Gabite",
    "Spe":82,
    "Total":410,
    "Type I":"Dragon",
    "EXPV":144,
    "Catch":45
  },
  {
    "Nat":445,
    "Pokemon":"Garchomp",
    "Spe":102,
    "Total":600,
    "Type I":"Dragon",
    "EXPV":218,
    "Catch":45
  },
  {
    "Nat":446,
    "Pokemon":"Munchlax",
    "Spe":5,
    "Total":390,
    "Type I":"Normal",
    "EXPV":94,
    "Catch":50
  },
  {
    "Nat":447,
    "Pokemon":"Riolu",
    "Spe":60,
    "Total":285,
    "Type I":"Fighting",
    "EXPV":72,
    "Catch":75
  },
  {
    "Nat":448,
    "Pokemon":"Lucario",
    "Spe":90,
    "Total":525,
    "Type I":"Fighting",
    "EXPV":204,
    "Catch":45
  },
  {
    "Nat":449,
    "Pokemon":"Hippopotas",
    "Spe":32,
    "Total":330,
    "Type I":"Ground",
    "EXPV":95,
    "Catch":140
  },
  {
    "Nat":450,
    "Pokemon":"Hippowdon",
    "Spe":47,
    "Total":525,
    "Type I":"Ground",
    "EXPV":198,
    "Catch":60
  },
  {
    "Nat":451,
    "Pokemon":"Skorupi",
    "Spe":65,
    "Total":330,
    "Type I":"Poison",
    "EXPV":114,
    "Catch":120
  },
  {
    "Nat":452,
    "Pokemon":"Drapion",
    "Spe":95,
    "Total":500,
    "Type I":"Poison",
    "EXPV":204,
    "Catch":45
  },
  {
    "Nat":453,
    "Pokemon":"Croagunk",
    "Spe":50,
    "Total":300,
    "Type I":"Poison",
    "EXPV":83,
    "Catch":140
  },
  {
    "Nat":454,
    "Pokemon":"Toxicroak",
    "Spe":85,
    "Total":490,
    "Type I":"Poison",
    "EXPV":181,
    "Catch":75
  },
  {
    "Nat":455,
    "Pokemon":"Carnivine",
    "Spe":46,
    "Total":454,
    "Type I":"Grass",
    "EXPV":164,
    "Catch":200
  },
  {
    "Nat":456,
    "Pokemon":"Finneon",
    "Spe":66,
    "Total":330,
    "Type I":"Water",
    "EXPV":90,
    "Catch":190
  },
  {
    "Nat":457,
    "Pokemon":"Lumineon",
    "Spe":91,
    "Total":460,
    "Type I":"Water",
    "EXPV":156,
    "Catch":75
  },
  {
    "Nat":458,
    "Pokemon":"Mantyke",
    "Spe":50,
    "Total":345,
    "Type I":"Water",
    "EXPV":108,
    "Catch":25
  },
  {
    "Nat":459,
    "Pokemon":"Snover",
    "Spe":40,
    "Total":334,
    "Type I":"Ice",
    "EXPV":131,
    "Catch":120
  },
  {
    "Nat":460,
    "Pokemon":"Abomasnow",
    "Spe":60,
    "Total":494,
    "Type I":"Ice",
    "EXPV":214,
    "Catch":60
  },
  {
    "Nat":461,
    "Pokemon":"Weavile",
    "Spe":125,
    "Total":510,
    "Type I":"Dark",
    "EXPV":199,
    "Catch":45
  },
  {
    "Nat":462,
    "Pokemon":"Magnezone",
    "Spe":60,
    "Total":535,
    "Type I":"Electric",
    "EXPV":211,
    "Catch":30
  },
  {
    "Nat":463,
    "Pokemon":"Lickilicky",
    "Spe":50,
    "Total":515,
    "Type I":"Normal",
    "EXPV":193,
    "Catch":30
  },
  {
    "Nat":464,
    "Pokemon":"Rhyperior",
    "Spe":40,
    "Total":535,
    "Type I":"Ground",
    "EXPV":217,
    "Catch":30
  },
  {
    "Nat":465,
    "Pokemon":"Tangrowth",
    "Spe":50,
    "Total":535,
    "Type I":"Grass",
    "EXPV":211,
    "Catch":30
  },
  {
    "Nat":466,
    "Pokemon":"Electivire",
    "Spe":95,
    "Total":540,
    "Type I":"Electric",
    "EXPV":199,
    "Catch":30
  },
  {
    "Nat":467,
    "Pokemon":"Magmortar",
    "Spe":83,
    "Total":540,
    "Type I":"Fire",
    "EXPV":199,
    "Catch":30
  },
  {
    "Nat":468,
    "Pokemon":"Togekiss",
    "Spe":80,
    "Total":545,
    "Type I":"Normal",
    "EXPV":220,
    "Catch":30
  },
  {
    "Nat":469,
    "Pokemon":"Yanmega",
    "Spe":95,
    "Total":515,
    "Type I":"Bug",
    "EXPV":198,
    "Catch":30
  },
  {
    "Nat":470,
    "Pokemon":"Leafeon",
    "Spe":95,
    "Total":525,
    "Type I":"Grass",
    "EXPV":196,
    "Catch":45
  },
  {
    "Nat":471,
    "Pokemon":"Glaceon",
    "Spe":65,
    "Total":525,
    "Type I":"Ice",
    "EXPV":196,
    "Catch":45
  },
  {
    "Nat":472,
    "Pokemon":"Gliscor",
    "Spe":95,
    "Total":510,
    "Type I":"Ground",
    "EXPV":192,
    "Catch":30
  },
  {
    "Nat":473,
    "Pokemon":"Mamoswine",
    "Spe":80,
    "Total":530,
    "Type I":"Ice",
    "EXPV":207,
    "Catch":50
  },
  {
    "Nat":474,
    "Pokemon":"Porygon-Z",
    "Spe":90,
    "Total":535,
    "Type I":"Normal",
    "EXPV":185,
    "Catch":30
  },
  {
    "Nat":475,
    "Pokemon":"Gallade",
    "Spe":80,
    "Total":518,
    "Type I":"Psychic",
    "EXPV":208,
    "Catch":45
  },
  {
    "Nat":476,
    "Pokemon":"Probopass",
    "Spe":40,
    "Total":525,
    "Type I":"Rock",
    "EXPV":198,
    "Catch":60
  },
  {
    "Nat":477,
    "Pokemon":"Dusknoir",
    "Spe":45,
    "Total":525,
    "Type I":"Ghost",
    "EXPV":210,
    "Catch":45
  },
  {
    "Nat":478,
    "Pokemon":"Froslass",
    "Spe":110,
    "Total":480,
    "Type I":"Ice",
    "EXPV":187,
    "Catch":75
  },
  {
    "Nat":479,
    "Pokemon":"Rotom",
    "Spe":91,
    "Total":440,
    "Type I":"Electric",
    "EXPV":132,
    "Catch":45
  },
  {
    "Nat":479.1,
    "Pokemon":"Rotom (Heat)",
    "Spe":86,
    "Total":520,
    "Type I":"Electric",
    "EXPV":132,
    "Catch":45
  },
  {
    "Nat":479.2,
    "Pokemon":"Rotom (Wash)",
    "Spe":86,
    "Total":520,
    "Type I":"Electric",
    "EXPV":132,
    "Catch":45
  },
  {
    "Nat":479.3,
    "Pokemon":"Rotom (Frost)",
    "Spe":86,
    "Total":520,
    "Type I":"Electric",
    "EXPV":132,
    "Catch":45
  },
  {
    "Nat":479.4,
    "Pokemon":"Rotom (Spin)",
    "Spe":86,
    "Total":520,
    "Type I":"Electric",
    "EXPV":132,
    "Catch":45
  },
  {
    "Nat":479.5,
    "Pokemon":"Rotom (Cut)",
    "Spe":86,
    "Total":520,
    "Type I":"Electric",
    "EXPV":132,
    "Catch":45
  },
  {
    "Nat":480,
    "Pokemon":"Uxie",
    "Spe":95,
    "Total":580,
    "Type I":"Psychic",
    "EXPV":210,
    "Catch":3
  },
  {
    "Nat":481,
    "Pokemon":"Mesprit",
    "Spe":80,
    "Total":580,
    "Type I":"Psychic",
    "EXPV":210,
    "Catch":3
  },
  {
    "Nat":482,
    "Pokemon":"Azelf",
    "Spe":115,
    "Total":580,
    "Type I":"Psychic",
    "EXPV":210,
    "Catch":3
  },
  {
    "Nat":483,
    "Pokemon":"Dialga",
    "Spe":90,
    "Total":680,
    "Type I":"Steel",
    "EXPV":220,
    "Catch":30
  },
  {
    "Nat":484,
    "Pokemon":"Palkia",
    "Spe":100,
    "Total":680,
    "Type I":"Water",
    "EXPV":220,
    "Catch":30
  },
  {
    "Nat":485,
    "Pokemon":"Heatran",
    "Spe":77,
    "Total":600,
    "Type I":"Fire",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":486,
    "Pokemon":"Regigigas",
    "Spe":100,
    "Total":670,
    "Type I":"Normal",
    "EXPV":220,
    "Catch":3
  },
  {
    "Nat":487,
    "Pokemon":"Giratina",
    "Spe":90,
    "Total":680,
    "Type I":"Ghost",
    "EXPV":220,
    "Catch":3
  },
  {
    "Nat":487.1,
    "Pokemon":"Giratina (O)",
    "Spe":90,
    "Total":680,
    "Type I":"Ghost",
    "EXPV":220,
    "Catch":3
  },
  {
    "Nat":488,
    "Pokemon":"Cresselia",
    "Spe":85,
    "Total":600,
    "Type I":"Psychic",
    "EXPV":210,
    "Catch":3
  },
  {
    "Nat":489,
    "Pokemon":"Phione",
    "Spe":80,
    "Total":480,
    "Type I":"Water",
    "EXPV":165,
    "Catch":30
  },
  {
    "Nat":490,
    "Pokemon":"Manaphy",
    "Spe":100,
    "Total":600,
    "Type I":"Water",
    "EXPV":215,
    "Catch":3
  },
  {
    "Nat":491,
    "Pokemon":"Darkrai",
    "Spe":125,
    "Total":600,
    "Type I":"Dark",
    "EXPV":210,
    "Catch":3
  },
  {
    "Nat":492,
    "Pokemon":"Shaymin",
    "Spe":100,
    "Total":600,
    "Type I":"Grass",
    "EXPV":64,
    "Catch":45
  },
  {
    "Nat":492.1,
    "Pokemon":"Shaymin (S)",
    "Spe":127,
    "Total":600,
    "Type I":"Grass",
    "EXPV":64,
    "Catch":45
  },
  {
    "Nat":493,
    "Pokemon":"Arceus",
    "Spe":120,
    "Total":720,
    "Type I":"Normal",
    "EXPV":255,
    "Catch":3
  },
  {
    "Nat":494,
    "Pokemon":"Victini",
    "Spe":100,
    "Total":600,
    "Type I":"Psychic",
    "EXPV":270,
    "Catch":3
  },
  {
    "Nat":495,
    "Pokemon":"Snivy",
    "Spe":63,
    "Total":308,
    "Type I":"Grass",
    "EXPV":28,
    "Catch":45
  },
  {
    "Nat":496,
    "Pokemon":"Servine",
    "Spe":83,
    "Total":413,
    "Type I":"Grass",
    "EXPV":145,
    "Catch":45
  },
  {
    "Nat":497,
    "Pokemon":"Serperior",
    "Spe":113,
    "Total":528,
    "Type I":"Grass",
    "EXPV":238,
    "Catch":45
  },
  {
    "Nat":498,
    "Pokemon":"Tepig",
    "Spe":45,
    "Total":308,
    "Type I":"Fire",
    "EXPV":28,
    "Catch":45
  },
  {
    "Nat":499,
    "Pokemon":"Pignite",
    "Spe":55,
    "Total":418,
    "Type I":"Fire",
    "EXPV":146,
    "Catch":45
  },
  {
    "Nat":500,
    "Pokemon":"Emboar",
    "Spe":65,
    "Total":528,
    "Type I":"Fire",
    "EXPV":238,
    "Catch":45
  },
  {
    "Nat":501,
    "Pokemon":"Oshawott",
    "Spe":45,
    "Total":308,
    "Type I":"Water",
    "EXPV":28,
    "Catch":45
  },
  {
    "Nat":502,
    "Pokemon":"Dewott",
    "Spe":60,
    "Total":413,
    "Type I":"Water",
    "EXPV":145,
    "Catch":45
  },
  {
    "Nat":503,
    "Pokemon":"Samurott",
    "Spe":70,
    "Total":528,
    "Type I":"Water",
    "EXPV":238,
    "Catch":45
  },
  {
    "Nat":504,
    "Pokemon":"Patrat",
    "Spe":42,
    "Total":255,
    "Type I":"Normal",
    "EXPV":51,
    "Catch":255
  },
  {
    "Nat":505,
    "Pokemon":"Watchog",
    "Spe":77,
    "Total":420,
    "Type I":"Normal",
    "EXPV":147,
    "Catch":255
  },
  {
    "Nat":506,
    "Pokemon":"Lillipup",
    "Spe":55,
    "Total":275,
    "Type I":"Normal",
    "EXPV":55,
    "Catch":255
  },
  {
    "Nat":507,
    "Pokemon":"Herdier",
    "Spe":60,
    "Total":370,
    "Type I":"Normal",
    "EXPV":130,
    "Catch":120
  },
  {
    "Nat":508,
    "Pokemon":"Stoutland",
    "Spe":80,
    "Total":490,
    "Type I":"Normal",
    "EXPV":221,
    "Catch":45
  },
  {
    "Nat":509,
    "Pokemon":"Purrloin",
    "Spe":66,
    "Total":281,
    "Type I":"Dark",
    "EXPV":56,
    "Catch":255
  },
  {
    "Nat":510,
    "Pokemon":"Liepard",
    "Spe":106,
    "Total":446,
    "Type I":"Dark",
    "EXPV":156,
    "Catch":90
  },
  {
    "Nat":511,
    "Pokemon":"Pansage",
    "Spe":64,
    "Total":316,
    "Type I":"Grass",
    "EXPV":63,
    "Catch":190
  },
  {
    "Nat":512,
    "Pokemon":"Simisage",
    "Spe":101,
    "Total":498,
    "Type I":"Grass",
    "EXPV":174,
    "Catch":75
  },
  {
    "Nat":513,
    "Pokemon":"Pansear",
    "Spe":64,
    "Total":316,
    "Type I":"Fire",
    "EXPV":63,
    "Catch":190
  },
  {
    "Nat":514,
    "Pokemon":"Simisear",
    "Spe":101,
    "Total":498,
    "Type I":"Fire",
    "EXPV":174,
    "Catch":75
  },
  {
    "Nat":515,
    "Pokemon":"Panpour",
    "Spe":64,
    "Total":316,
    "Type I":"Water",
    "EXPV":63,
    "Catch":190
  },
  {
    "Nat":516,
    "Pokemon":"Simipour",
    "Spe":101,
    "Total":498,
    "Type I":"Water",
    "EXPV":174,
    "Catch":75
  },
  {
    "Nat":517,
    "Pokemon":"Munna",
    "Spe":24,
    "Total":292,
    "Type I":"Psychic",
    "EXPV":58,
    "Catch":190
  },
  {
    "Nat":518,
    "Pokemon":"Musharna",
    "Spe":29,
    "Total":487,
    "Type I":"Psychic",
    "EXPV":170,
    "Catch":75
  },
  {
    "Nat":519,
    "Pokemon":"Pidove",
    "Spe":43,
    "Total":264,
    "Type I":"Normal",
    "EXPV":53,
    "Catch":255
  },
  {
    "Nat":520,
    "Pokemon":"Tranquill",
    "Spe":65,
    "Total":358,
    "Type I":"Normal",
    "EXPV":125,
    "Catch":120
  },
  {
    "Nat":521,
    "Pokemon":"Unfezant",
    "Spe":93,
    "Total":478,
    "Type I":"Normal",
    "EXPV":215,
    "Catch":45
  },
  {
    "Nat":522,
    "Pokemon":"Blitzle",
    "Spe":76,
    "Total":295,
    "Type I":"Electric",
    "EXPV":59,
    "Catch":190
  },
  {
    "Nat":523,
    "Pokemon":"Zebstrika",
    "Spe":116,
    "Total":497,
    "Type I":"Electric",
    "EXPV":174,
    "Catch":75
  },
  {
    "Nat":524,
    "Pokemon":"Roggenrola",
    "Spe":15,
    "Total":280,
    "Type I":"Rock",
    "EXPV":56,
    "Catch":255
  },
  {
    "Nat":525,
    "Pokemon":"Boldore",
    "Spe":20,
    "Total":390,
    "Type I":"Rock",
    "EXPV":137,
    "Catch":120
  },
  {
    "Nat":526,
    "Pokemon":"Gigalith",
    "Spe":25,
    "Total":505,
    "Type I":"Rock",
    "EXPV":227,
    "Catch":45
  },
  {
    "Nat":527,
    "Pokemon":"Woobat",
    "Spe":72,
    "Total":313,
    "Type I":"Psychic",
    "EXPV":63,
    "Catch":190
  },
  {
    "Nat":528,
    "Pokemon":"Swoobat",
    "Spe":114,
    "Total":425,
    "Type I":"Psychic",
    "EXPV":149,
    "Catch":45
  },
  {
    "Nat":529,
    "Pokemon":"Drilbur",
    "Spe":68,
    "Total":328,
    "Type I":"Ground",
    "EXPV":66,
    "Catch":120
  },
  {
    "Nat":530,
    "Pokemon":"Excadrill",
    "Spe":88,
    "Total":508,
    "Type I":"Ground",
    "EXPV":178,
    "Catch":60
  },
  {
    "Nat":531,
    "Pokemon":"Audino",
    "Spe":50,
    "Total":445,
    "Type I":"Normal",
    "EXPV":390,
    "Catch":255
  },
  {
    "Nat":532,
    "Pokemon":"Timburr",
    "Spe":35,
    "Total":305,
    "Type I":"Fighting",
    "EXPV":61,
    "Catch":180
  },
  {
    "Nat":533,
    "Pokemon":"Gurdurr",
    "Spe":40,
    "Total":405,
    "Type I":"Fighting",
    "EXPV":142,
    "Catch":90
  },
  {
    "Nat":534,
    "Pokemon":"Conkeldurr",
    "Spe":45,
    "Total":505,
    "Type I":"Fighting",
    "EXPV":227,
    "Catch":45
  },
  {
    "Nat":535,
    "Pokemon":"Tympole",
    "Spe":64,
    "Total":294,
    "Type I":"Water",
    "EXPV":59,
    "Catch":255
  },
  {
    "Nat":536,
    "Pokemon":"Palpitoad",
    "Spe":69,
    "Total":384,
    "Type I":"Water",
    "EXPV":134,
    "Catch":120
  },
  {
    "Nat":537,
    "Pokemon":"Seismitoad",
    "Spe":74,
    "Total":499,
    "Type I":"Water",
    "EXPV":225,
    "Catch":45
  },
  {
    "Nat":538,
    "Pokemon":"Throh",
    "Spe":45,
    "Total":465,
    "Type I":"Fighting",
    "EXPV":163,
    "Catch":45
  },
  {
    "Nat":539,
    "Pokemon":"Sawk",
    "Spe":85,
    "Total":465,
    "Type I":"Fighting",
    "EXPV":163,
    "Catch":45
  },
  {
    "Nat":540,
    "Pokemon":"Sewaddle",
    "Spe":42,
    "Total":310,
    "Type I":"Bug",
    "EXPV":62,
    "Catch":255
  },
  {
    "Nat":541,
    "Pokemon":"Swadloon",
    "Spe":42,
    "Total":380,
    "Type I":"Bug",
    "EXPV":133,
    "Catch":120
  },
  {
    "Nat":542,
    "Pokemon":"Leavanny",
    "Spe":92,
    "Total":490,
    "Type I":"Bug",
    "EXPV":221,
    "Catch":45
  },
  {
    "Nat":543,
    "Pokemon":"Venipede",
    "Spe":57,
    "Total":260,
    "Type I":"Bug",
    "EXPV":52,
    "Catch":255
  },
  {
    "Nat":544,
    "Pokemon":"Whirlipede",
    "Spe":47,
    "Total":360,
    "Type I":"Bug",
    "EXPV":126,
    "Catch":120
  },
  {
    "Nat":545,
    "Pokemon":"Scolipede",
    "Spe":112,
    "Total":475,
    "Type I":"Bug",
    "EXPV":214,
    "Catch":45
  },
  {
    "Nat":546,
    "Pokemon":"Cottonee",
    "Spe":66,
    "Total":280,
    "Type I":"Grass",
    "EXPV":56,
    "Catch":190
  },
  {
    "Nat":547,
    "Pokemon":"Whimsicott",
    "Spe":116,
    "Total":480,
    "Type I":"Grass",
    "EXPV":168,
    "Catch":75
  },
  {
    "Nat":548,
    "Pokemon":"Petilil",
    "Spe":30,
    "Total":280,
    "Type I":"Grass",
    "EXPV":56,
    "Catch":190
  },
  {
    "Nat":549,
    "Pokemon":"Lilligant",
    "Spe":90,
    "Total":480,
    "Type I":"Grass",
    "EXPV":168,
    "Catch":75
  },
  {
    "Nat":550,
    "Pokemon":"Basculin",
    "Spe":98,
    "Total":460,
    "Type I":"Water",
    "EXPV":161,
    "Catch":25
  },
  {
    "Nat":551,
    "Pokemon":"Sandile",
    "Spe":65,
    "Total":292,
    "Type I":"Ground",
    "EXPV":58,
    "Catch":180
  },
  {
    "Nat":552,
    "Pokemon":"Krokorok",
    "Spe":74,
    "Total":351,
    "Type I":"Ground",
    "EXPV":123,
    "Catch":90
  },
  {
    "Nat":553,
    "Pokemon":"Krookodile",
    "Spe":92,
    "Total":509,
    "Type I":"Ground",
    "EXPV":229,
    "Catch":45
  },
  {
    "Nat":554,
    "Pokemon":"Darumaka",
    "Spe":50,
    "Total":315,
    "Type I":"Fire",
    "EXPV":63,
    "Catch":120
  },
  {
    "Nat":555,
    "Pokemon":"Darmanitan",
    "Spe":95,
    "Total":480,
    "Type I":"Fire",
    "EXPV":168,
    "Catch":60
  },
  {
    "Nat":555.1,
    "Pokemon":"Darmanitan (Z)",
    "Spe":55,
    "Total":540,
    "Type I":"Fire",
    "EXPV":189,
    "Catch":60
  },
  {
    "Nat":556,
    "Pokemon":"Maractus",
    "Spe":60,
    "Total":461,
    "Type I":"Grass",
    "EXPV":161,
    "Catch":255
  },
  {
    "Nat":557,
    "Pokemon":"Dwebble",
    "Spe":55,
    "Total":325,
    "Type I":"Bug",
    "EXPV":65,
    "Catch":190
  },
  {
    "Nat":558,
    "Pokemon":"Crustle",
    "Spe":45,
    "Total":475,
    "Type I":"Bug",
    "EXPV":166,
    "Catch":75
  },
  {
    "Nat":559,
    "Pokemon":"Scraggy",
    "Spe":48,
    "Total":348,
    "Type I":"Dark",
    "EXPV":70,
    "Catch":180
  },
  {
    "Nat":560,
    "Pokemon":"Scrafty",
    "Spe":58,
    "Total":488,
    "Type I":"Dark",
    "EXPV":171,
    "Catch":90
  },
  {
    "Nat":561,
    "Pokemon":"Sigilyph",
    "Spe":97,
    "Total":490,
    "Type I":"Psychic",
    "EXPV":172,
    "Catch":45
  },
  {
    "Nat":562,
    "Pokemon":"Yamask",
    "Spe":30,
    "Total":303,
    "Type I":"Ghost",
    "EXPV":61,
    "Catch":190
  },
  {
    "Nat":563,
    "Pokemon":"Cofagrigus",
    "Spe":30,
    "Total":483,
    "Type I":"Ghost",
    "EXPV":169,
    "Catch":90
  },
  {
    "Nat":564,
    "Pokemon":"Tirtouga",
    "Spe":22,
    "Total":355,
    "Type I":"Water",
    "EXPV":71,
    "Catch":45
  },
  {
    "Nat":565,
    "Pokemon":"Carracosta",
    "Spe":32,
    "Total":495,
    "Type I":"Water",
    "EXPV":173,
    "Catch":45
  },
  {
    "Nat":566,
    "Pokemon":"Archen",
    "Spe":70,
    "Total":401,
    "Type I":"Rock",
    "EXPV":71,
    "Catch":45
  },
  {
    "Nat":567,
    "Pokemon":"Archeops",
    "Spe":110,
    "Total":567,
    "Type I":"Rock",
    "EXPV":177,
    "Catch":45
  },
  {
    "Nat":568,
    "Pokemon":"Trubbish",
    "Spe":65,
    "Total":329,
    "Type I":"Poison",
    "EXPV":66,
    "Catch":190
  },
  {
    "Nat":569,
    "Pokemon":"Garbodor",
    "Spe":75,
    "Total":484,
    "Type I":"Poison",
    "EXPV":166,
    "Catch":60
  },
  {
    "Nat":570,
    "Pokemon":"Zorua",
    "Spe":65,
    "Total":330,
    "Type I":"Dark",
    "EXPV":66,
    "Catch":75
  },
  {
    "Nat":571,
    "Pokemon":"Zoroark",
    "Spe":105,
    "Total":510,
    "Type I":"Dark",
    "EXPV":179,
    "Catch":45
  },
  {
    "Nat":572,
    "Pokemon":"Minccino",
    "Spe":75,
    "Total":300,
    "Type I":"Normal",
    "EXPV":60,
    "Catch":255
  },
  {
    "Nat":573,
    "Pokemon":"Ciccino",
    "Spe":115,
    "Total":470,
    "Type I":"Normal",
    "EXPV":165,
    "Catch":60
  },
  {
    "Nat":574,
    "Pokemon":"Gothita",
    "Spe":45,
    "Total":290,
    "Type I":"Psychic",
    "EXPV":58,
    "Catch":200
  },
  {
    "Nat":575,
    "Pokemon":"Gothorita",
    "Spe":55,
    "Total":390,
    "Type I":"Psychic",
    "EXPV":137,
    "Catch":100
  },
  {
    "Nat":576,
    "Pokemon":"Gothitelle",
    "Spe":65,
    "Total":490,
    "Type I":"Psychic",
    "EXPV":221,
    "Catch":50
  },
  {
    "Nat":577,
    "Pokemon":"Solosis",
    "Spe":20,
    "Total":290,
    "Type I":"Psychic",
    "EXPV":58,
    "Catch":200
  },
  {
    "Nat":578,
    "Pokemon":"Duosion",
    "Spe":30,
    "Total":370,
    "Type I":"Psychic",
    "EXPV":130,
    "Catch":100
  },
  {
    "Nat":579,
    "Pokemon":"Reuniclus",
    "Spe":30,
    "Total":490,
    "Type I":"Psychic",
    "EXPV":221,
    "Catch":50
  },
  {
    "Nat":580,
    "Pokemon":"Ducklett",
    "Spe":55,
    "Total":305,
    "Type I":"Water",
    "EXPV":61,
    "Catch":190
  },
  {
    "Nat":581,
    "Pokemon":"Swanna",
    "Spe":98,
    "Total":473,
    "Type I":"Water",
    "EXPV":166,
    "Catch":45
  },
  {
    "Nat":582,
    "Pokemon":"Vanillite",
    "Spe":44,
    "Total":305,
    "Type I":"Ice",
    "EXPV":61,
    "Catch":255
  },
  {
    "Nat":583,
    "Pokemon":"Vanillish",
    "Spe":59,
    "Total":395,
    "Type I":"Ice",
    "EXPV":138,
    "Catch":120
  },
  {
    "Nat":584,
    "Pokemon":"Vanilluxe",
    "Spe":79,
    "Total":535,
    "Type I":"Ice",
    "EXPV":241,
    "Catch":45
  },
  {
    "Nat":585,
    "Pokemon":"Deerling",
    "Spe":75,
    "Total":335,
    "Type I":"Normal",
    "EXPV":67,
    "Catch":190
  },
  {
    "Nat":586,
    "Pokemon":"Sawsbuck",
    "Spe":95,
    "Total":475,
    "Type I":"Normal",
    "EXPV":166,
    "Catch":75
  },
  {
    "Nat":587,
    "Pokemon":"Emolga",
    "Spe":103,
    "Total":428,
    "Type I":"Electric",
    "EXPV":150,
    "Catch":200
  },
  {
    "Nat":588,
    "Pokemon":"Karrablast",
    "Spe":60,
    "Total":315,
    "Type I":"Bug",
    "EXPV":63,
    "Catch":200
  },
  {
    "Nat":589,
    "Pokemon":"Escavalier",
    "Spe":20,
    "Total":495,
    "Type I":"Bug",
    "EXPV":173,
    "Catch":75
  },
  {
    "Nat":590,
    "Pokemon":"Foongus",
    "Spe":15,
    "Total":294,
    "Type I":"Grass",
    "EXPV":59,
    "Catch":190
  },
  {
    "Nat":591,
    "Pokemon":"Amoonguss",
    "Spe":30,
    "Total":464,
    "Type I":"Grass",
    "EXPV":162,
    "Catch":75
  },
  {
    "Nat":592,
    "Pokemon":"Frillish",
    "Spe":40,
    "Total":335,
    "Type I":"Water",
    "EXPV":67,
    "Catch":190
  },
  {
    "Nat":593,
    "Pokemon":"Jellicent",
    "Spe":60,
    "Total":480,
    "Type I":"Water",
    "EXPV":168,
    "Catch":60
  },
  {
    "Nat":594,
    "Pokemon":"Alomomola",
    "Spe":65,
    "Total":470,
    "Type I":"Water",
    "EXPV":165,
    "Catch":75
  },
  {
    "Nat":595,
    "Pokemon":"Joltik",
    "Spe":65,
    "Total":319,
    "Type I":"Bug",
    "EXPV":64,
    "Catch":190
  },
  {
    "Nat":596,
    "Pokemon":"Galvantula",
    "Spe":108,
    "Total":472,
    "Type I":"Bug",
    "EXPV":165,
    "Catch":75
  },
  {
    "Nat":597,
    "Pokemon":"Ferroseed",
    "Spe":10,
    "Total":305,
    "Type I":"Grass",
    "EXPV":61,
    "Catch":255
  },
  {
    "Nat":598,
    "Pokemon":"Ferrothorn",
    "Spe":20,
    "Total":489,
    "Type I":"Grass",
    "EXPV":171,
    "Catch":90
  },
  {
    "Nat":599,
    "Pokemon":"Klink",
    "Spe":30,
    "Total":300,
    "Type I":"Steel",
    "EXPV":60,
    "Catch":130
  },
  {
    "Nat":600,
    "Pokemon":"Klang",
    "Spe":50,
    "Total":440,
    "Type I":"Steel",
    "EXPV":154,
    "Catch":60
  },
  {
    "Nat":601,
    "Pokemon":"Klinklang",
    "Spe":90,
    "Total":520,
    "Type I":"Steel",
    "EXPV":234,
    "Catch":30
  },
  {
    "Nat":602,
    "Pokemon":"Tynamo",
    "Spe":60,
    "Total":275,
    "Type I":"Electric",
    "EXPV":55,
    "Catch":190
  },
  {
    "Nat":603,
    "Pokemon":"Eelektrik",
    "Spe":40,
    "Total":405,
    "Type I":"Electric",
    "EXPV":142,
    "Catch":60
  },
  {
    "Nat":604,
    "Pokemon":"Eelektross",
    "Spe":50,
    "Total":515,
    "Type I":"Electric",
    "EXPV":232,
    "Catch":30
  },
  {
    "Nat":605,
    "Pokemon":"Elgyem",
    "Spe":30,
    "Total":335,
    "Type I":"Psychic",
    "EXPV":67,
    "Catch":255
  },
  {
    "Nat":606,
    "Pokemon":"Beheeyem",
    "Spe":40,
    "Total":485,
    "Type I":"Psychic",
    "EXPV":170,
    "Catch":90
  },
  {
    "Nat":607,
    "Pokemon":"Litwick",
    "Spe":20,
    "Total":275,
    "Type I":"Ghost",
    "EXPV":55,
    "Catch":190
  },
  {
    "Nat":608,
    "Pokemon":"Lampent",
    "Spe":55,
    "Total":370,
    "Type I":"Ghost",
    "EXPV":130,
    "Catch":90
  },
  {
    "Nat":609,
    "Pokemon":"Chandelure",
    "Spe":80,
    "Total":520,
    "Type I":"Ghost",
    "EXPV":234,
    "Catch":45
  },
  {
    "Nat":610,
    "Pokemon":"Axew",
    "Spe":57,
    "Total":320,
    "Type I":"Dragon",
    "EXPV":64,
    "Catch":75
  },
  {
    "Nat":611,
    "Pokemon":"Fraxure",
    "Spe":67,
    "Total":410,
    "Type I":"Dragon",
    "EXPV":144,
    "Catch":60
  },
  {
    "Nat":612,
    "Pokemon":"Haxorus",
    "Spe":97,
    "Total":540,
    "Type I":"Dragon",
    "EXPV":243,
    "Catch":45
  },
  {
    "Nat":613,
    "Pokemon":"Cubchoo",
    "Spe":40,
    "Total":305,
    "Type I":"Ice",
    "EXPV":61,
    "Catch":120
  },
  {
    "Nat":614,
    "Pokemon":"Beartic",
    "Spe":50,
    "Total":485,
    "Type I":"Ice",
    "EXPV":170,
    "Catch":60
  },
  {
    "Nat":615,
    "Pokemon":"Cryogonal",
    "Spe":105,
    "Total":485,
    "Type I":"Ice",
    "EXPV":170,
    "Catch":25
  },
  {
    "Nat":616,
    "Pokemon":"Shelmet",
    "Spe":25,
    "Total":305,
    "Type I":"Bug",
    "EXPV":61,
    "Catch":200
  },
  {
    "Nat":617,
    "Pokemon":"Accelgor",
    "Spe":145,
    "Total":495,
    "Type I":"Bug",
    "EXPV":173,
    "Catch":75
  },
  {
    "Nat":618,
    "Pokemon":"Stunfisk",
    "Spe":32,
    "Total":471,
    "Type I":"Ground",
    "EXPV":165,
    "Catch":75
  },
  {
    "Nat":619,
    "Pokemon":"Mienfoo",
    "Spe":65,
    "Total":350,
    "Type I":"Fighting",
    "EXPV":70,
    "Catch":180
  },
  {
    "Nat":620,
    "Pokemon":"Mienshao",
    "Spe":105,
    "Total":510,
    "Type I":"Fighting",
    "EXPV":179,
    "Catch":45
  },
  {
    "Nat":621,
    "Pokemon":"Druddigon",
    "Spe":48,
    "Total":485,
    "Type I":"Dragon",
    "EXPV":170,
    "Catch":45
  },
  {
    "Nat":622,
    "Pokemon":"Golett",
    "Spe":35,
    "Total":303,
    "Type I":"Ground",
    "EXPV":61,
    "Catch":190
  },
  {
    "Nat":623,
    "Pokemon":"Golurk",
    "Spe":55,
    "Total":483,
    "Type I":"Ground",
    "EXPV":169,
    "Catch":90
  },
  {
    "Nat":624,
    "Pokemon":"Pawniard",
    "Spe":60,
    "Total":340,
    "Type I":"Dark",
    "EXPV":68,
    "Catch":120
  },
  {
    "Nat":625,
    "Pokemon":"Bisharp",
    "Spe":70,
    "Total":490,
    "Type I":"Dark",
    "EXPV":172,
    "Catch":45
  },
  {
    "Nat":626,
    "Pokemon":"Bouffalant",
    "Spe":55,
    "Total":490,
    "Type I":"Normal",
    "EXPV":172,
    "Catch":45
  },
  {
    "Nat":627,
    "Pokemon":"Rufflet",
    "Spe":60,
    "Total":350,
    "Type I":"Normal",
    "EXPV":70,
    "Catch":190
  },
  {
    "Nat":628,
    "Pokemon":"Braviary",
    "Spe":80,
    "Total":510,
    "Type I":"Normal",
    "EXPV":179,
    "Catch":60
  },
  {
    "Nat":629,
    "Pokemon":"Vullaby",
    "Spe":60,
    "Total":370,
    "Type I":"Dark",
    "EXPV":74,
    "Catch":190
  },
  {
    "Nat":630,
    "Pokemon":"Mandibuzz",
    "Spe":80,
    "Total":510,
    "Type I":"Dark",
    "EXPV":179,
    "Catch":60
  },
  {
    "Nat":631,
    "Pokemon":"Heatmor",
    "Spe":65,
    "Total":484,
    "Type I":"Fire",
    "EXPV":169,
    "Catch":90
  },
  {
    "Nat":632,
    "Pokemon":"Durant",
    "Spe":109,
    "Total":484,
    "Type I":"Bug",
    "EXPV":169,
    "Catch":90
  },
  {
    "Nat":633,
    "Pokemon":"Deino",
    "Spe":38,
    "Total":300,
    "Type I":"Dark",
    "EXPV":60,
    "Catch":45
  },
  {
    "Nat":634,
    "Pokemon":"Zweilous",
    "Spe":58,
    "Total":420,
    "Type I":"Dark",
    "EXPV":147,
    "Catch":45
  },
  {
    "Nat":635,
    "Pokemon":"Hydreigon",
    "Spe":98,
    "Total":600,
    "Type I":"Dark",
    "EXPV":270,
    "Catch":45
  },
  {
    "Nat":636,
    "Pokemon":"Larvesta",
    "Spe":60,
    "Total":360,
    "Type I":"Bug",
    "EXPV":72,
    "Catch":45
  },
  {
    "Nat":637,
    "Pokemon":"Volcarona",
    "Spe":100,
    "Total":550,
    "Type I":"Bug",
    "EXPV":248,
    "Catch":15
  },
  {
    "Nat":638,
    "Pokemon":"Cobalion",
    "Spe":108,
    "Total":580,
    "Type I":"Steel",
    "EXPV":261,
    "Catch":3
  },
  {
    "Nat":639,
    "Pokemon":"Terrakion",
    "Spe":108,
    "Total":580,
    "Type I":"Rock",
    "EXPV":261,
    "Catch":3
  },
  {
    "Nat":640,
    "Pokemon":"Virizion",
    "Spe":108,
    "Total":580,
    "Type I":"Grass",
    "EXPV":261,
    "Catch":3
  },
  {
    "Nat":641,
    "Pokemon":"Tornadus",
    "Spe":111,
    "Total":580,
    "Type I":"Flying",
    "EXPV":261,
    "Catch":3
  },
  {
    "Nat":642,
    "Pokemon":"Thundurus",
    "Spe":111,
    "Total":580,
    "Type I":"Electric",
    "EXPV":261,
    "Catch":3
  },
  {
    "Nat":643,
    "Pokemon":"Reshiram",
    "Spe":90,
    "Total":680,
    "Type I":"Dragon",
    "EXPV":306,
    "Catch":45
  },
  {
    "Nat":644,
    "Pokemon":"Zekrom",
    "Spe":90,
    "Total":680,
    "Type I":"Dragon",
    "EXPV":306,
    "Catch":45
  },
  {
    "Nat":645,
    "Pokemon":"Landorus",
    "Spe":101,
    "Total":600,
    "Type I":"Ground",
    "EXPV":270,
    "Catch":3
  },
  {
    "Nat":646,
    "Pokemon":"Kyurem",
    "Spe":95,
    "Total":660,
    "Type I":"Dragon",
    "EXPV":297,
    "Catch":3
  },
  {
    "Nat":647,
    "Pokemon":"Keldeo",
    "Spe":108,
    "Total":580,
    "Type I":"Water",
    "EXPV":261,
    "Catch":3
  },
  {
    "Nat":648,
    "Pokemon":"Meloetta (A)",
    "Spe":90,
    "Total":600,
    "Type I":"Normal",
    "EXPV":270,
    "Catch":3
  },
  {
    "Nat":648.1,
    "Pokemon":"Meloetta (P)",
    "Spe":128,
    "Total":600,
    "Type I":"Normal",
    "EXPV":270,
    "Catch":3
  },
  {
    "Nat":649,
    "Pokemon":"Genesect",
    "Spe":99,
    "Total":600,
    "Type I":"Bug",
    "EXPV":270,
    "Catch":3
  }
];