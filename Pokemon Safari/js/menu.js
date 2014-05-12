var setup = function(e) {
	if(!localStorage['location']){
		localStorage['location'] = 'forest';
		chrome.browserAction.setIcon({"path":"/images/"+localStorage['location'] + ".png"});
	}

  displayZone(localStorage.location);
  displayTrainerInfo();
};

document.addEventListener('DOMContentLoaded', function () {
  setup();
});

var displayZone = function (zoneName){
  //move these locations into a separate file
  var locations = {
  "forest"  : "Feldgrau Forest",
  "tunnel"  : "Taupe Tunnel",
  "beach"   : "Burnt-Sienna Beach",
  "city"    : "Chrome Citz",
  "park"    : "Peony Park",
  "glacier" : "Galanthus Glacier",
  "tower"   : "Thistle Tower"
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
}
