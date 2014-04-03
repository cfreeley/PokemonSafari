var start = function(e) {
	if(!localStorage['trainer']) {
		update();
	}
	if(localStorage['location'])
		chrome.browserAction.setIcon({"path":localStorage['location'] + ".png"});
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
	chrome.browserAction.setIcon({"path":"icon!.png"});
	chrome.browserAction.setPopup({"popup":"battle.html"});
	var opt = {
        type: "basic",
        title: "Wild Pokemon Appeared!",
        message: "Select the \"!\" icon in your browser to battle!",
        iconUrl: "notification.png"
    };
    if (localStorage['notifications'] != "off") {
		chrome.notifications.create("poke", opt, function () {console.log("notified");});
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

chrome.alarms.onAlarm.addListener(pokemonFound);