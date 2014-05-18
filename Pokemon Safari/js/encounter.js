var start = function(e) {
	if(!localStorage['trainer']) {
		update();
	}
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
  	chrome.browserAction.setIcon({"path":"/images/"+location+ ".png"});
	
	console.log('start');
	chrome.alarms.create("", {"delayInMinutes":1});
};

var setAlarm = function(e) {
	if(localStorage['frequency'] == "veryrare")
		chrome.alarms.create("", {"delayInMinutes":240});
	else if(localStorage['frequency'] == "rare")
		chrome.alarms.create("", {"delayInMinutes":45});
	else if(localStorage['frequency'] == "uncommon")
		chrome.alarms.create("", {"delayInMinutes":10});
	else if(localStorage['frequency'] == "random") 
		chrome.alarms.create("", {"delayInMinutes":(Math.random() * 120)});
	else
		chrome.alarms.create("", {"delayInMinutes":1});
};

var pokemonFound = function(e) {
	setAlarm();
	chrome.browserAction.setIcon({"path":"/images/icon!.png"});
	chrome.browserAction.setPopup({"popup":"/html/battle.html"});
	var opt = {
        type: "basic",
        title: "Wild Pokemon Appeared!",
        message: "Select the \"!\" icon in your browser to battle!",
        iconUrl: "/images/notification.png"
    };
  if (localStorage['notifications'] != "off") {
		chrome.notifications.create("poke", opt, function () {});
		console.log(localStorage['notifications'] != "off");
	}
	else {
		chrome.notifications.clear("",function(e){});
		console.log("um");
	}
	if (localStorage['sound'] == "on") {
		var aud = new Audio('http://50.7.60.82:777/ost/pokemon-gameboy-sound-collection/fllwdebjsg/107-battle-vs-wild-pokemon-.mp3#t=,4.7');
		aud.play();
	}
};

document.addEventListener('DOMContentLoaded', function () {
	start();
});

var update = function() {
	localStorage['frequency'] = "uncommon";
	localStorage['notifications'] = "on";
	localStorage['trainer'] = JSON.stringify({poke:0});
	localStorage['pokedex'] = JSON.stringify({});
	for (var i = 1; i < 152; i++) {
		if (localStorage[i]) {
			var pk = JSON.parse(localStorage['pokedex']);
			pk[i] = JSON.parse(localStorage[i]);
			localStorage['pokedex'] = JSON.stringify(pk);
		}
	}
};

// var reset = function() {
//   localStorage['frequency'] = "common";
//   localStorage['notifications'] = "on";
//   localStorage['location'] = "forest";
//   localStorage['trainer'] = JSON.stringify({poke:0});
//   localStorage['pokedex'] = JSON.stringify({});
// };

chrome.alarms.onAlarm.addListener(pokemonFound);