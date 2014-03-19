var setup = function(e) {
	var container = document.getElementById("container");
	
	var dex = JSON.parse(localStorage['pokedex']);
	if ((Object.keys(dex).length) > 75) { // Add Chrome City as a button :)
		var chromeCity = document.createElement('div');
		chromeCity.className = "button city";
		chromeCity.id = "city";
		chromeCity.innerHTML = "<span>Chrome City</span>";
	
		container.appendChild(chromeCity);
	}
	
	var buttons = document.getElementsByClassName("button");
	for (var i = buttons.length - 1; i >= 0; i--) {
		buttons[i].onclick = click(buttons[i]);
		console.log(buttons[i].onclick);
	};
};

var click = function(e) {
	return function() {
		localStorage['location'] = e.id;
		chrome.browserAction.setIcon({"path":localStorage['location'] + ".png"});
		
		document.location = "menu.html";
	};
}

document.addEventListener('DOMContentLoaded', function () {
	setup();
});
