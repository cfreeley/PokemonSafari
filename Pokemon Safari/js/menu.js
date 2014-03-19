var setup = function(e) {
	if(!localStorage['location'])
		localStorage['location'] = 'forest';
	chrome.browserAction.setIcon({"path":localStorage['location'] + ".png"}); 

	document.getElementById('balance').textContent = JSON.parse(localStorage['trainer']).poke;
	document.getElementById("found_pokemon").innerHTML = Object.keys(JSON.parse(localStorage['pokedex'])).length;

	document.getElementById("showzone").style.backgroundImage = "url('images/big_sprites/" + localStorage['location'] + ".png')";
	
	var locationName;
	switch (localStorage['location']) {
		case "forest":
			locationName = "Feldgau Forest";break;
		case "tunnel":
			locationName = "Taupe Tunnel"; break;
		case "city":
			locatioName = "Chrome City"; break;
		case "beach":
			locationName = "Burnt-Sienna Beach"; break;
		default:
			locationName = "Unknown Zone";
	}
	
	document.getElementById("location_name").innerHTML = locationName;
};

document.addEventListener('DOMContentLoaded', function () {
  setup();
});
