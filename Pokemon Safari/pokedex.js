var urlifyNumber = function(e) {
	var s = '' + e;
	while (s.length < 3)
		s = '0' + s;
	if (localStorage['style'] == '2d')
		return 'http://www.serebii.net/blackwhite/pokemon/' + s + '.png';
	else
		return 'http://www.serebii.net/xy/pokemon/' + s + '.png';
};

var pkdex = JSON.parse(localStorage['pokedex']);
document.write("<h3>Pokedex: (" + (Object.keys(pkdex).length) + "/151)</h3><table style=\"width:200px\">");
for (var i = 1; i < 152; i++) {
	document.write("<tr>");
	if (!pkdex[i])
		document.write("<td>" + i + ": ???</td><td><img src=\"http://images.sodahead.com/slideshows/000017353/2813640578_question_mark-72343836337_large.png\"></td>");
	else
		document.write("<td>" + i + ": <strong>" + pkdex[i].name + "</strong></td><td><img src=\"" + urlifyNumber(i) + "\"></td>");
	document.write("</tr>");
};
document.write("</table>");