var setup = function(e) {
	if(!localStorage['location']){
		localStorage['location'] = 'forest';
	}

  var location = localStorage.location;
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

  displayZone(localStorage.location);
  displayTrainerInfo();
};

document.addEventListener('DOMContentLoaded', function () {
  setup();
});

var displayZone = function (zoneName){
  //move these locations into a separate file
  var locations = {
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

  var locationName = document.getElementById("location_name");
  locationName.innerHTML = locations[zoneName];

  var locationElement = document.getElementById("showzone");
  locationElement.className = "";
  locationElement.className = "showzone "+zoneName;
}

var displayTrainerInfo = function(){
  var trainer = JSON.parse(localStorage['trainer']);
  var pokedex = JSON.parse(localStorage['pokedex']);
  document.getElementById('balance').innerHTML = trainer['poke'];
  document.getElementById('found_pokemon').innerHTML = Object.keys(pokedex).length;
  var totalPokemon = 151;
  if(trainer.jticket){
    totalPokemon = 251;
  }
  if(trainer.hticket){
    totalPokemon = 386;
  }
  document.getElementById('total_pokemon').innerHTML = totalPokemon;
}
