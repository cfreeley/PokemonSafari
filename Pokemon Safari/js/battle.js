// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */

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



var condition = 'wary'; // Either wary, angry, or eating
var pokemon, sprite;
var crate = 0;
var counter = 0;
var turn = 1;
var level = 20;
var iv = Math.floor(Math.random() * 15) + 1;
var pokeindex;
var trainer = JSON.parse(localStorage['trainer']);
var dex = JSON.parse(localStorage['pokedex']);
var pokemonGenerator = {
  /**
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */
  sprUrl: 'http://pokeapi.co/api/v1/sprite/',
  pokeUrl: 'http://pokeapi.co/api/v1/pokemon/',
  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
   *
   * @public
   */
  requestPokemon: function() {
    chrome.browserAction.setIcon({"path":localStorage['location'] + ".png"});
    chrome.browserAction.setPopup({"popup":"menu.html"});
    chrome.notifications.clear("poke", function(){});
    pokeindex = choosePokemon();
    var req = new XMLHttpRequest();
    req.open("GET", this.sprUrl + (pokeindex + 1) + '/', true);
    req.onload = this.showPokemon.bind(this);
    req.send(null);

    req = new XMLHttpRequest();
    req.open("GET", this.pokeUrl + pokeindex + '/', true);
    req.onload = this.initBattle.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */



  showPokemon: function (e) {
    var entry = JSON.parse(e.target.responseText); //JSON of sprite
    sprite = 'http://www.serebii.net/xy/pokemon/' + urlifyNumber(pokeindex) + '.png'; //+ entry.image; // Actual sprite
    var pokeName = entry.pokemon.name;
    var txtNode = document.createTextNode("Wild " + pokeName.toUpperCase());
    document.getElementById("Pokemon").appendChild(txtNode);
    document.getElementById("Pokemon").appendChild(document.createElement('br'));
    txtNode = document.createTextNode("appeared! ");
    document.getElementById("Pokemon").appendChild(txtNode);
    if (dex[pokeindex]) {
      var caught = document.createElement('img');
      caught.src = "caughtSymbol.png";
      caught.id = "symbol";
      document.getElementById("Pokemon").appendChild(caught);
    }
    document.getElementById("Pokemon").appendChild(document.createElement('br'));
    var img = document.createElement('img');
    img.src = sprite;
    img.id = "sprite";
    document.getElementById("Pokemon").appendChild(img);
  },

  initBattle: function (e) {
    pokemon = JSON.parse(e.target.responseText);
    crate = 101; 
    var ballButton = document.createElement("input");
    ballButton.type = "button";
    ballButton.value = "Pokeball";
    ballButton.onclick = throwBall;
    document.getElementById("Options").appendChild(ballButton);

/*
    if(trainer.greatballs && trainer.greatballs > 0) {
      var gbButton = document.createElement("input");
      gbButton.type = "button";
      gbButton.value = "Great Ball (x" + trainer.greatballs + ")";
      gbButton.onclick = throwBall;
      document.getElementById("Options").appendChild(gbButton);
    }
  */  
    var rockButton = document.createElement("input");
    rockButton.type = "button";
    rockButton.value = "Rock";
    rockButton.onclick = throwRock;
    document.getElementById("Options").appendChild(rockButton);
    
    var baitButton = document.createElement("input");
    baitButton.type = "button";
    baitButton.value = "Bait";
    baitButton.onclick = throwBait;
    document.getElementById("Options").appendChild(baitButton);

  }
};

var urlifyNumber = function(e) {
  var s = '' + e;
  while (s.length < 3)
    s = '0' + s;
  return s;
};

var choosePokemon = function() {
  if (!localStorage['location'])
    localStorage['location'] = "forest";
  var lst = habitats[localStorage['location']];
  if (Math.random() < .001)
    return 150 + Math.round(Math.random());
  return lst[Math.floor(Math.random() * lst.length)];
  
};

var throwBall = 
  function(e) {
    var resultText = "You threw a Safari Ball. ";
    if (isCaught()) {
      resultText += "1... 2... 3... Gotcha! " + pokemon.name + " was caught!";
      document.body.removeChild(document.getElementById("status"));
      document.body.removeChild(document.getElementById("Options"));
      document.getElementById("console").textContent = resultText;
      document.getElementById("turn").textContent = "Turn " + (turn + 1);
      document.getElementById("sprite").style["background-color"] = "lightgreen";
      if (!dex[pokeindex]) 
        document.getElementById("caught").textContent = pokemon.name + " has been added to your Pokedex!"
      document.getElementById("yield").textContent = "Received " + pokemon.exp + " PokeDollars!";
      //document.write("<body bgcolor=\"#FF9900\">");
      recordCapture();
      var d = JSON.parse(localStorage['pokedex']);
      if ((Object.keys(d).length) == 75 && !dex[pokeindex]) 
        document.getElementById("safari").textContent = "NEW SAFARI ZONE UNLOCKED!";
    }
    else {
      var letdowns = ["1... Oh.", "1... Hmm.", "1... Ugh.", "1... 2... Darn!", "1... 2... Gah!", "1... 2... Shucks!", "1... 2... 3... NO-"];
      resultText += letdowns[Math.floor(Math.random() * letdowns.length)];
      resultText += " The " + pokemon.name + " broke free!";
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

var willRun = 
  function() {
    var spd = Math.floor(((pokemon.speed + iv) * level) / 50) + 10;
    var x = spd * 2;
    if (condition == 'angry') {
      x *= 1.5;
    }
    else if (condition == 'eating') {
      x /= 4;
    }
    console.log(x);
    return x > (Math.random() * 255);
  };

var isCaught =
  function() {
    var chance = crate / 450; //math.min(151,)
    return Math.random() < chance;
  };

var pokeTurn =
  function() {
    var resultText = pokemon.name;
    turn++;
    document.getElementById("turn").textContent = "Turn " + turn;
    if (counter <= 0) {
      condition = 'wary';
      crate = 101;
    }
    else {
      counter--;
    }
    if (willRun()) {
      resultText += " ran away!";
      document.body.removeChild(document.getElementById("Options"));
      document.getElementById("sprite").style["background-color"] = "lightpink";
    }
    else {
      resultText += " is " + condition;
    }
    document.getElementById("status").textContent = resultText;
  };

var recordCapture = 
  function() {
    var pkdex = JSON.parse(localStorage['pokedex']);
    pkdex[pokemon.national_id] = {name:pokemon.name, img:sprite};
    localStorage['pokedex'] = JSON.stringify(pkdex);
        var pokee = JSON.parse(localStorage['trainer']);
    pokee.poke += pokemon.exp;
    localStorage['trainer'] = JSON.stringify(pokee);
  };

// Run our script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  pokemonGenerator.requestPokemon();
});
