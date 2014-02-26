var start = function(e) {
	setAlarm();
};

var setAlarm = function(e) {
	chrome.alarms.create("", {"delayInMinutes":1});
};

var pokemonFound = function(e) {
	setAlarm();
	chrome.browserAction.setIcon({"path":"icon!.png"});
	chrome.browserAction.setPopup({"popup":"battle.html"});
};

document.addEventListener('DOMContentLoaded', function () {
	if(!localStorage['location'])
		chrome.browserAction.setIcon({"path":localStorage['location'] + ".png"});
	start();
});

chrome.alarms.onAlarm.addListener(pokemonFound);