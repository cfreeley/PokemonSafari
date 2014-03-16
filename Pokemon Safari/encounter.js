var start = function(e) {
	if(localStorage['location'])
		chrome.browserAction.setIcon({"path":localStorage['location'] + ".png"});
	setAlarm();
};

var setAlarm = function(e) {
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
        iconUrl: "iconPokeball.png"
    };
	chrome.notifications.create("poke", opt, function () {console.log("notified");});
};

document.addEventListener('DOMContentLoaded', function () {
	start();
});

chrome.alarms.onAlarm.addListener(pokemonFound);