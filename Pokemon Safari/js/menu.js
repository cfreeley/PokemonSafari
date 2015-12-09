function getLocation() {
	switch(localStorage._location){
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

var setup = function(e) {
	if(!localStorage._location){
		localStorage._location = 'forest';
	}
	_location = getLocation();
	chrome.browserAction.setIcon({"path":"/images/"+_location+ ".png"});
	displayZone(localStorage._location);
	displayTrainerInfo();
};

document.addEventListener('DOMContentLoaded', function () {
	setup();
});

var displayZone = function (zoneName){
	//move these _locations into a separate file
	var _locations = {
	"forest"   : "Feldgrau Forest",
	"tunnel"   : "Taupe Tunnel",
	"beach"    : "Burnt-Sienna Beach",
	"city"     : "Chrome City",
	"park"     : "Peony Park",
	"glacier"  : "Galanthus Glacier",
	"tower"    : "Thistle Tower",
	"jungle"   : "Jungle",
	"sea"      : "Miracle Sea",
	"mountain" : "Mt. Chimney"
	};

	var _locationName = document.getElementById("location_name");
	_locationName.innerHTML = _locations[zoneName];

	var _locationElement = document.getElementById("showzone");
	_locationElement.className = "";
	_locationElement.className = "showzone "+zoneName;
};

var displayTrainerInfo = function(){
	var trainer = JSON.parse(localStorage.trainer);
	var pokedex = JSON.parse(localStorage.pokedex);
	document.getElementById('balance').innerHTML = trainer.poke;
	document.getElementById('found_pokemon').innerHTML = Object.keys(pokedex).length;
	var totalPokemon = 151;
	if(trainer.jticket){
		totalPokemon = 251;
	}
	if(trainer.hticket){
		totalPokemon = 386;
	}
	document.getElementById('total_pokemon').innerHTML = totalPokemon;
};	
