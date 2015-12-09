var items = [
	{name:"Great Ball", cost:500, id:"greatballs", img:"/images/greatball.png", desc:"A stronger Pokeball"},
	{name:"Net", cost:1000, id:"nets", img:"/images/net.png", desc:"Stuns a Pokemon for 2-3 turns"},
	//{name:"Pal Ball", cost:5000, id:"palballs", rq:50, img:"palball.png", desc:"Befriends caught Pokemon"},
	{name:"Master Ball", cost:75000, id:"masterballs", rq:100, img:"/images/masterball.png", desc:"Automatically catches a Pokemon"},
	{name:"S.S. Anne Tickets", cost:5000, id:"jticket", rq:150, img:"/images/ssticket.png", desc:"Allows you to sail to another nearby region", onlyone:true},
	{name:"Slateport Tickets", cost:5000, id:"hticket", rq:249, img:"/images/hticket.png", desc:"Allows you to sail to a tropical region", onlyone:true},
	{name:"Zoom Lens", cost:2000, id:"zoomlens", rq:300, img:"/images/zoomlens.png", desc:"A peculiar binocular that is used to study Pokemon far up in the sky", onlyone:true}];
	
var setup = function(e) {
	var trainer = JSON.parse(localStorage.trainer);
	var dex = JSON.parse(localStorage.pokedex);
	document.getElementById('balance').textContent = trainer.poke;
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
			row1.innerHTML = "<strong>???</strong>: Requires <strong>" + item.rq + "</strong> Pokemon";
		} else {
				var symbol = document.createElement('img');
     		symbol.src = item.img;
     		symbol.setAttribute('class', 'shopItemCell');
      	row1.appendChild(symbol);

				var itemName = document.createElement('span');
				itemName.innerText = item.name;
     		itemName.setAttribute('class', 'shopItemCell shopItemTitle');
				row1.appendChild(itemName);

				var row2 = document.createElement('div');
				row2.setAttribute('class', 'shopItemRow');

				var itemDesc = document.createElement('span');
				itemDesc.innerText = item.desc;
				itemDesc.setAttribute('class', 'shopItemCell');
				row2.appendChild(itemDesc);

				var row3 = document.createElement('div');
				row3.setAttribute('class', 'shopItemRow');
				var cost;
				if (trainer[""+item.id] >= 1 && item.onlyone){
			    cost = document.createElement('span');
			    cost.innerHTML = ' <strong>Already purchased.</strong>';
			    cost.setAttribute('class', 'shopItemCell');
					row3.appendChild(cost);
				} else {
		    	var buttonBuy = document.createElement("input");
		    	buttonBuy.type = "button";
		    	buttonBuy.value = "Buy";
		    	buttonBuy.onclick = buy(item);
		    	buttonBuy.setAttribute('class', 'shopItemCell');
		    	row3.appendChild(buttonBuy);

			    cost = document.createElement('span');
   				var quantityInBag =  trainer[""+item.id]? '<strong>'+trainer[""+item.id] + "</strong> in bag." : "";
			    cost.innerHTML = ' <strong>'+item.cost + "</strong> poke. " + quantityInBag;
			    cost.setAttribute('class', 'shopItemCell');
					row3.appendChild(cost);
				}

		    container.appendChild(row2);
		    container.appendChild(row3);
		}
		stk.appendChild(container);
  }
};

var buy = function (e) {
	return function() {
		var t = JSON.parse(localStorage.trainer);
		console.log(t.poke + " " + e.cost);
		if (t.poke >= e.cost) {
			console.log(t[""+e.id]);
			if(!t[""+e.id])
				t[""+e.id] = 0;
			t[""+e.id]++;
			t.poke -= e.cost;
			localStorage.trainer = JSON.stringify(t);
			setup();
		}
	};
};

document.addEventListener('DOMContentLoaded', function () {
  setup();
});
