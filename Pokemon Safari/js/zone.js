var setup = function(e) {
	var container = document.getElementById("container");
	
	var dex = JSON.parse(localStorage['pokedex']);
	if ((Object.keys(dex).length) > 75) { // Add Chrome City
		container.appendChild(createZone('city', 'Chrome City'));
	}

	var trainer = JSON.parse(localStorage['trainer']);
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
	};
};

var createZone = function(id, name){
	var zone = document.createElement('div');
	zone.className = 'button '+id;
	zone.id = id;
	zone.innerHTML = '<span>'+name+'</span>';
	return zone;
}

var createHeader = function(name){
		var header = document.createElement('div');
		header.className = "title";
		header.innerHTML = name;
		return header;
}

var click = function(e) {
	return function() {
		localStorage.location = e.id;
		var location = e.id;
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
		document.location = "menu.html";
	};
}

document.addEventListener('DOMContentLoaded', function () {
	setup();
});
