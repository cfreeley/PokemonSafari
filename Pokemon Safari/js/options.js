function save_options() {
	var select = document.getElementById("frequency");
	var freq = select.children[select.selectedIndex].value;
	localStorage.frequency = freq;

	select = document.getElementById("notifications");
	var notif = select.children[select.selectedIndex].value;
	localStorage.notifications = notif;

	select = document.getElementById("style");
	var sty = select.children[select.selectedIndex].value;
	localStorage.style = sty;

	select = document.getElementById("sound");
	sty = select.children[select.selectedIndex].value;
	localStorage.sound = sty;

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerText = "Options saved";
	setTimeout(function() {
		status.innerText = "Save";
	}, 750);

	chrome.alarms.clearAll();
	setAlarm(0);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var favorite = localStorage.frequency;
	if (!favorite) {
		return;
	}
	var select = document.getElementById("frequency");
	var child;
	var i;
	for (i = 0; i < select.children.length; i++) {
		child = select.children[i];
		if (child.value == favorite) {
			child.selected = "true";
			break;
		}
	}
	favorite = localStorage.notifications;
	select = document.getElementById("notifications");
	for (i = 0; i < select.children.length; i++) {
		child = select.children[i];
		if (child.value == favorite) {
			child.selected = "true";
			break;
		}
	}

	if (!localStorage.style) {localStorage.style = '3d'; }
	favorite = localStorage.style;
	select = document.getElementById("style");
	
	for (i = 0; i < select.children.length; i++) {
		child = select.children[i];
		if (child.value == favorite) {
			child.selected = "true";
			break;
		}
	}

	if (!localStorage.sound) {localStorage.sound = 'off';};
	favorite = localStorage.sound;
	select = document.getElementById("sound");
	for (i = 0; i < select.children.length; i++) {
		child = select.children[i];
		if (child.value == favorite) {
			child.selected = "true";
			break;
		}
	}

}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('status').addEventListener('click', save_options);

var setAlarm = function(e) {
	if(localStorage.frequency == "veryrare")
		chrome.alarms.create("", {"delayInMinutes":240});
	else if(localStorage.frequency == "rare")
		chrome.alarms.create("", {"delayInMinutes":45});
	else if(localStorage.frequency == "uncommon")
		chrome.alarms.create("", {"delayInMinutes":10});
	else if(localStorage.frequency == "random") 
		chrome.alarms.create("", {"delayInMinutes":(Math.random() * 120)});
	else
		chrome.alarms.create("", {"delayInMinutes":1});
};