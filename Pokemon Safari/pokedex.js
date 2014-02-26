document.write("<h3>Pokedex: (" + (localStorage.length-1) + "/151)</h3><table style=\"width:200px\">");
for (var i = 1; i < 152; i++) {
	document.write("<tr>");
	if (!localStorage[i])
		document.write("<td>" + i + ": ???</td><td><img src=\"http://images.sodahead.com/slideshows/000017353/2813640578_question_mark-72343836337_large.png\"></td>");
	else
		document.write("<td>" + i + ": <strong>" + JSON.parse(localStorage[i]).name + "</strong></td><td><img src=\"" + JSON.parse(localStorage[i]).img + "\"></td>");
	document.write("</tr>");
};
document.write("</table>");