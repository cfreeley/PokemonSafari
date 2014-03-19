function genericOnClick(info, tab) {
  chrome.tabs.query({active:true, currentWindow: true}, 
  function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {}, 
    function(response){
        txt = response.data.replace(/\n/g, "|").replace(/\//g,"&");
        //chrome.tabs.create({url : "http://cfreeley.pythonanywhere.com/" + txt}); 
        chrome.downloads.download({url : "http://cfreeley.pythonanywhere.com/" + txt, filename: "data.csv"});
    });
  });
}

var option = chrome.contextMenus.create(
  {"title": "Scrape", "contexts":["selection"], "onclick": genericOnClick});