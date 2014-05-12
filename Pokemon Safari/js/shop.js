var items = [
	{name:"Great Ball", cost:500, id:"greatballs", img:"/images/greatball.png", desc:"A stronger Pokeball"},
	{name:"Net", cost:1000, id:"nets", img:"/images/net.png", desc:"Stuns a Pokemon for 2-3 turns"},
	//{name:"Pal Ball", cost:5000, id:"palballs", rq:50, img:"palball.png", desc:"Befriends caught Pokemon"},
	{name:"Master Ball", cost:75000, id:"masterballs", rq:100, img:"/images/masterball.png", desc:"Automatically catches a Pokemon"},
	{name:"S.S. Anne Tickets", cost:5000, id:"jticket", rq:150, img:"/images/ssticket.png", desc:"Allows you to sail to another nearby region", onlyone:true},
	{name:"Slateport Tickets", cost:5000, id:"hticket", rq:249, img:"/images/ssticket.png", desc:"Allows you to sail to a tropical region", onlyone:true}];

var setup = function(e) {
	var trainer = JSON.parse(localStorage['trainer']);
	var dex = JSON.parse(localStorage['pokedex']);
	document.getElementById('money').textContent = trainer.poke;
	var stk = document.getElementById('stock');

	//reset page
	while (stk.firstChild)
  		stk.removeChild(stk.firstChild);

  for(var i=0; i<items.length; i++){
		var item = items[i];

		var container = document.createElement('div');
		container.setAttribute('class', 'shopItem');

		var row1 = document.createElement('div');
		row1.setAttribute('class', 'shopItemRow');
		container.appendChild(row1);
		if (item.rq && item.rq > Object.keys(dex).length) {
			row1.innerText = "???: Requires " + item.rq + " Pokemon";
		} else {
				if (trainer[""+item.id] >= 1 && item.onlyone)
					continue;
				var quantityInBag =  trainer[""+item.id]? trainer[""+item.id] + " in bag." : "";

				var symbol = document.createElement('img');
     		symbol.src = item.img;
     		symbol.setAttribute('class', 'shopItemCell');
      	row1.appendChild(symbol);

				var itemName = document.createElement('span');
				itemName.innerText = item.name;
     		itemName.setAttribute('class', 'shopItemCell');
				row1.appendChild(itemName);

				var row2 = document.createElement('div');
				row2.setAttribute('class', 'shopItemRow');

				var itemDesc = document.createElement('span');
				itemDesc.innerText = item.desc;
				itemDesc.setAttribute('class', 'shopItemCell');
				row2.appendChild(itemDesc);

				var row3 = document.createElement('div');
				row3.setAttribute('class', 'shopItemRow');

		    var buttonBuy = document.createElement("input");
		    buttonBuy.type = "button";
		    buttonBuy.value = "Buy";
		    buttonBuy.onclick = buy(item);
		    buttonBuy.setAttribute('class', 'shopItemCell');
		    row3.appendChild(buttonBuy);

		    var cost = document.createElement('span')
		    cost.innerHTML = item.cost + " poke. " + quantityInBag;
		    cost.setAttribute('class', 'shopItemCell');
				row3.appendChild(cost);

				/*container.appendChild(row1);*/
		    container.appendChild(row2);
		    container.appendChild(row3);
		}
		stk.appendChild(container);
  }
/*
	for (var i = 0; i < items.length; i++) {
		var x = items[i];
		if (x.rq && x.rq > Object.keys(dex).length) {
			var desc = document.createElement('div');
			desc.i("???: Requires " + x.rq + " Pokemon");
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
*/
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
			setup();
		}
	};
};

document.addEventListener('DOMContentLoaded', function () {
  setup();
});
