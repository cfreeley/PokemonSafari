var urlifyNumber = function(e) {
  var s = '' + e;
  while (s.length < 3)
    s = '0' + s;
  if (shiny) {
      if (localStorage['style'] == '2d')
        return 'http://www.serebii.net/Shiny/BW/' + s + '.png';
      else
        return 'http://www.serebii.net/Shiny/XY/' + s + '.png';
  }
  if (localStorage['style'] == '2d')
    return 'http://www.serebii.net/blackwhite/pokemon/' + s + '.png';
  else
    return 'http://www.serebii.net/xy/pokemon/' + s + '.png';
};

var pkdex = JSON.parse(localStorage['pokedex']);
var totalmon = 151;
var trainer = JSON.parse(localStorage['trainer']);
var shiny = false;
if (trainer.jticket > 0)
	totalmon = 251;
document.write("<h3>Pokedex: (" + (Object.keys(pkdex).length) + "/" + totalmon + ")</h3><table style=\"width:200px\">");
for (var i = 1; i <= totalmon; i++) {
	document.write("<tr>");
	if (!pkdex[i])
		document.write("<td>" + i + ": ???</td><td><img src=\"http://images.sodahead.com/slideshows/000017353/2813640578_question_mark-72343836337_large.png\"></td>");
	else {
		shiny = pkdex[i].shiny;
		document.write("<td>" + i + ": <strong>" + pkdex[i].name + "</strong></td><td><img src=\"" + urlifyNumber(i) + "\"></td>");
	}
	document.write("</tr>");
};
document.write("</table>");