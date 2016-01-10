var content = document.getElementById("content");
var linkTpl = "<a id='{{ chist-id }}' href='http://localhost:9393{{ chist-url }}' target='_blank'>{{ chist-title }}</a>";
var newChistButton = document.getElementById("create-chist-button");
var settingsLink = document.getElementById("settings-link");

function addLink(chist) {
    content.innerHTML += linkTpl.replace(/{{\s*chist-url\s*}}/, chist["url"]).replace(/{{\s*chist-title\s*}}/, chist["title"]).replace(/{{\s*chist-id\s*}}/, chist["id"]);
}

function openChist(event) {
  event.stopPropagation();
  event.preventDefault();
  self.port.emit("open-chist", event.target.href);
}

newChistButton.addEventListener("click", function(event) {
  var format = document.getElementById("chat-format").value;
  event.stopPropagation();
  event.preventDefault();
  self.port.emit("new-chist", format);
});

settingsLink.addEventListener("click", function(event) {
  event.stopPropagation();
  event.preventDefault();
  self.port.emit("open-settings");
});

self.port.on("chists-loaded", function onLoaded(collection) {
  var chists = collection["chists"];

  content.innerHTML = '';

  for (var i = 0; i < chists.length; i++) {
    addLink(chists[i]);
  }

  var links = document.getElementsByTagName("a");

  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click",openChist);
  }
});

self.port.on("success", function() {
  newChistButton.disabled = false;
});

self.port.on("chist-created", function(chist) {
  addLink(chist);
  var link = document.getElementById(chist["id"]);
  link.addEventListener("click", openChist);
});

self.port.on("error", function(status, error) {
  newChistButton.disabled = true;
  if(status == 401) {
    content.innerText = "Your API key is invalid.\nPlease, go to sSettings and add a valid one.";
  } else {
    content.innerText = error.message;
  }
});
