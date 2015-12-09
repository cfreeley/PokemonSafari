document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var link = links[i];
            var new__location = link.href;
            link.onclick = function () {
                chrome.tabs.create({active: true, url: new__location});
            };
        })();
    }
    return false;
});