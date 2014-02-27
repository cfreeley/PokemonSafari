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
                   143,151];

habitats.beach = [7,8,9,54,55,60,61,62,72,73,79,80,86,87,90,91,98,99,103,116,117,118,119,
                  120,121,129,130,131,138,139,140,141,142,144,147,148,149];

habitats.tunnel = [4,5,6,25,26,27,28,35,36,37,38,39,40,41,42,50,51,56,57,58,59,66,67,68,74,
                   75,76,77,78,95,104,105,106,107,111,112,126,146];

habitats.city = [63,64,65,81,82,88,89,92,93,94,96,97,100,101,108,109,110,122,124,125,132,
                 133,134,135,136,137,145,150];


var condition = 'wary'; // Either wary, angry, or eating
var pokemon, sprite;
var crate = 0;
var counter = 0;
var turn = 1;
var level = 20;
var iv = Math.floor(Math.random() * 15) + 1;
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
    var pokeindex = choosePokemon();
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
    sprite = 'http://pokeapi.co' + entry.image; // Actual sprite
    var pokeName = entry.pokemon.name;
    var txtNode = document.createTextNode("Wild " + pokeName.toUpperCase() + " appeared!");
    document.getElementById("Pokemon").appendChild(txtNode);
    var img = document.createElement('img');
    img.src = sprite;
    img.id = "sprite";
    document.getElementById("Pokemon").appendChild(img);
  },

  initBattle: function (e) {
    pokemon = JSON.parse(e.target.responseText);
    crate = 120; 
    var ballButton = document.createElement("input");
    ballButton.type = "button";
    ballButton.value = "Pokeball";
    ballButton.onclick = throwBall;
    document.getElementById("Options").appendChild(ballButton);
    
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

var choosePokemon = function() {
  var lst = habitats[localStorage['location']];
  if (!lst)
    return 151;
  return lst[Math.floor(Math.random() * lst.length)];
  
};

var throwBall = 
  function(e) {
    var resultText = "You threw a Pokeball. ";
    if (isCaught()) {
      resultText += "Gotcha! " + pokemon.name + " was caught!";
      document.body.removeChild(document.getElementById("status"));
      document.body.removeChild(document.getElementById("Options"));
      document.getElementById("console").textContent = resultText;
      document.getElementById("turn").textContent = "Turn " + (turn + 1);
      document.getElementById("sprite").style["background-color"] = "lightgreen";
      //document.write("<body bgcolor=\"#FF9900\">");
      recordCapture();
    }
    else {
      resultText += "But it missed!";
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
    crate /= 2;
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
      x *= 2;
    }
    else if (condition == 'eating') {
      x /= 4;
    }
    console.log(x);
    return x > (Math.random() * 255);
  };

var isCaught =
  function() {
    var chance = Math.min(crate, 151) / 450;
    return Math.random() < chance;
  };

var pokeTurn =
  function() {
    var resultText = pokemon.name;
    turn++;
    document.getElementById("turn").textContent = "Turn " + turn;
    if (counter <= 0) {
      condition = 'wary';
      crate = 120;
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
    var dexEntry = JSON.stringify({name:pokemon.name, img:sprite});
    localStorage[pokemon.national_id.toString()] = dexEntry;
  };

// Run our script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  pokemonGenerator.requestPokemon();
});
