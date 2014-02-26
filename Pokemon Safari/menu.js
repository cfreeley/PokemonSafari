var setup = function(e) {

	if(!localStorage['location'])
		localStorage['location'] = 'forest';

	if (localStorage.length < 75) 
		document.getElementById('cc').style.visibility = "hidden";

	document.getElementById(localStorage['location']).checked = true;

	var Things = document.getElementsByName("location");
	for (var i = Things.length - 1; i >= 0; i--) {
		Things[i].onclick = click(Things[i]);
		console.log(Things[i].onclick);
	};
};

var click = function(e) {
	return function() {
		localStorage['location'] = e.value;
		chrome.browserAction.setIcon({"path":localStorage['location'] + ".png"});
	};
}

document.addEventListener('DOMContentLoaded', function () {
  setup();
});
