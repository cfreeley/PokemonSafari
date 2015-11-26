var setup = function(e) {
	var container = document.getElementById("container");
	
	var dex = JSON.parse(localStorage.pokedex);
	if ((Object.keys(dex).length) > 75) { // Add Chrome City
		container.appendChild(createZone('city', 'Chrome City'));
	}

	var trainer = JSON.parse(localStorage.trainer);
	if (trainer.jticket) {
		container.appendChild(createHeader('Johto Tour'));
		container.appendChild(createZone('park', 'Peony Park'));
		container.appendChild(createZone('glacier', 'Galanthus Glacier'));
		container.appendChild(createZone('tower', 'Thistle Tower'));
	}
		if (trainer.hticket) {
		container.appendChild(createHeader('Hoenn Tour'));
		container.appendChild(createZone('jungle', 'Jungle'));
		container.appendChild(createZone('sea', 'Miracle Sea'));
		container.appendChild(createZone('mountain', 'Mt. Chimney'));
	}

	var buttons = document.getElementsByClassName("button");
	for (var i = buttons.length - 1; i >= 0; i--) {
		buttons[i].onclick = click(buttons[i]);
	}
};

var createZone = function(id, name){
	var zone = document.createElement('div');
	zone.className = 'button '+id;
	zone.id = id;
	zone.innerHTML = '<span>'+name+'</span>';
	return zone;
};

var createHeader = function(name){
		var header = document.createElement('div');
		header.className = "title";
		header.innerHTML = name;
		return header;
};

function getLocation(e){
	localStorage._location = e.id;
	var _location = e.id;
  	switch(_location){
		case 'park':
			_location = 'park';
			break;
		case 'forest' || 'jungle':
			_location = 'forest';
			break;
		case 'glacier' || 'mountain':
			_location = 'glacier';
			break;
		case 'tunnel':
			_location = 'tunnel';
			break;
		case 'beach' || 'sea':
			_location = 'beach';
			break;
		case 'city':
			_location = 'city';
			break;
		case 'tower':
			_location = 'tower';
			break;
		default:
			_location = 'forest';
			break;
		}
		return _location;
}

var click = function(e) {
	return function() {
		_location = getLocation(e);
  		chrome.browserAction.setIcon({"path":"/images/"+_location+ ".png"});
		document.location = "menu.html";
	};
};

document.addEventListener('DOMContentLoaded', function () {
	setup();
});
