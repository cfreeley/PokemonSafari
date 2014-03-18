var setup = function(e) {
	document.getElementById('money').textContent = JSON.parse(localStorage['trainer']).poke;
	var Things = document.getElementsByName("item");
	for (var i = Things.length - 1; i >= 0; i--) {
		Things[i].onclick = click(Things[i]);
		console.log(Things[i].onclick);
	};
};

var click = function(e) {
	return function() {
		var t = JSON.parse(localStorage['trainer']);
		if (t.poke >= 300) {
			if(!t.greatballs)
				t.greatballs = 0;
			t.greatballs++;
			t.poke -= 300;
			localStorage['trainer'] = JSON.stringify(t);
			setup();
		}
	};
}

document.addEventListener('DOMContentLoaded', function () {
  setup();
});
