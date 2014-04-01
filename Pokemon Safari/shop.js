var items = [
	{name:"Great Ball", cost:500, id:"greatballs", img:"greatball.png", desc:"A stronger Pokeball"},
	{name:"Net", cost:1000, id:"nets", img:"net.png", desc:"Stuns a Pokemon for 2-3 turns"},
	//{name:"Pal Ball", cost:5000, id:"palballs", rq:50, img:"palball.png", desc:"Befriends caught Pokemon"},
	{name:"Master Ball", cost:75000, id:"masterballs", rq:100, img:"masterball.png", desc:"Automatically catches a Pokemon"},
	{name:"S.S. Anne Tickets", cost:5000, id:"jticket", rq:150, img:"ssticket.png", desc:"Allows you to sail to a new region", onlyone:true}];

var setup = function(e) {
	var trainer = JSON.parse(localStorage['trainer']);
	var dex = JSON.parse(localStorage['pokedex']);
	document.getElementById('money').textContent = trainer.poke;
	var stk = document.getElementById('stock');
	while (stk.firstChild)
  		stk.removeChild(stk.firstChild);

	for (var i = 0; i < items.length; i++) {
		var x = items[i];
		//console.log(Object.keys(pkdex).length + " " + x.rq);
		//x.onclick = click(x);
		if (x.rq && x.rq > Object.keys(dex).length) {
			var desc = document.createTextNode("???: Requires " + x.rq + " Pokemon");
			stk.appendChild(desc);	
		}
		else {
			if (trainer[""+x.id] >= 1 && x.onlyone)
				continue;
			var s = "";
			if (trainer[""+x.id])
				s = ". " + trainer[""+x.id] + " in bag.";
			var symbol = document.createElement('img');
     		symbol.src = x.img;
      		stk.appendChild(symbol);
			var desc = document.createTextNode(x.name);
			stk.appendChild(desc);
			stk.appendChild(document.createElement('br'));
			desc = document.createTextNode("\"" + x.desc + "\"");
			stk.appendChild(desc);
			stk.appendChild(document.createElement('br'));
			desc = document.createTextNode(x.cost + " poke" + s);
			stk.appendChild(desc);	
		    var butt = document.createElement("input");
		    butt.type = "button";
		    butt.value = "Buy";
		    butt.onclick = buy(x);
		    stk.appendChild(document.createElement('br'));
		    stk.appendChild(butt);

		}
		stk.appendChild(document.createElement('br'));
		stk.appendChild(document.createElement('br'));
	};
};

var buy = function (e) {
	return function() {
		var t = JSON.parse(localStorage['trainer']);
		console.log(t.poke + " " + e.cost);
		if (t.poke >= e.cost) {
			console.log(t[""+e.id]);
			if(!t[""+e.id])
				t[""+e.id] = 0;
			t[""+e.id]++;
			t.poke -= e.cost;
			localStorage['trainer'] = JSON.stringify(t);
			//document.getElementById('money').textContent = t.poke;
			setup();
		}
	};
};

document.addEventListener('DOMContentLoaded', function () {
  setup();
});
