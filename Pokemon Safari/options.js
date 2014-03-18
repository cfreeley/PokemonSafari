function save_options() {
  var select = document.getElementById("frequency");
  var freq = select.children[select.selectedIndex].value;
  localStorage["frequency"] = freq;

  select = document.getElementById("notifications");
  var notif = select.children[select.selectedIndex].value;
  localStorage["notifications"] = notif;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);

  chrome.alarms.clearAll();
  setAlarm(0);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["frequency"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("frequency");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
  favorite = localStorage["notifications"];
  select = document.getElementById("notifications");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);

var setAlarm = function(e) {
  if(localStorage['frequency'] == "veryrare")
    chrome.alarms.create("", {"delayInMinutes":240});
  else if(localStorage['frequency'] == "rare")
    chrome.alarms.create("", {"delayInMinutes":45});
  else if(localStorage['frequency'] == "uncommon")
    chrome.alarms.create("", {"delayInMinutes":10});
  else
    chrome.alarms.create("", {"delayInMinutes":1});
};