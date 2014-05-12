var setup = function(e) {
	var container = document.getElementById("buttons");
	
	var dex = JSON.parse(localStorage['pokedex']);
	if ((Object.keys(dex).length) > 75) { // Add Chrome City
		var chromeCity = document.createElement('div');
		chromeCity.className = "button city";
		chromeCity.id = "city";
		chromeCity.innerHTML = "<span>Chrome City</span>";
	
		container.appendChild(chromeCity);
	}

	var trainer = JSON.parse(localStorage['trainer']);
	if (trainer.jticket) { // Add Johto Tour

		var johtoTour = document.createElement('div');
		johtoTour.className = "title";
		johtoTour.innerHTML = "Johto Tour";	
		container.appendChild(johtoTour);


		var peonyPark = document.createElement('div');
		peonyPark.className = "button park";
		peonyPark.id = "park";
		peonyPark.innerHTML = "<span>Peony Park</span>";	
		container.appendChild(peonyPark);


		var galanthusGlacier = document.createElement('div');
		galanthusGlacier.className = "button glacier";
		galanthusGlacier.id = "glacier";
		galanthusGlacier.innerHTML = "<span>Galanthus Glacier</span>";	
		container.appendChild(galanthusGlacier);


		var thistleTower = document.createElement('div');
		thistleTower.className = "button tower";
		thistleTower.id = "tower";
		thistleTower.innerHTML = "<span>Thistle Tower</span>";
		container.appendChild(thistleTower);
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
