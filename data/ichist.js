var content = document.getElementById("content");
var linkTpl = "<a id='{{ chist-id }}' href='http://localhost:9393{{ chist-url }}' target='_blank'>{{ chist-title }}</a>";

function addLink(chist) {
    content.innerHTML += linkTpl.replace(/{{\s*chist-url\s*}}/, chist["url"]).replace(/{{\s*chist-title\s*}}/, chist["title"]).replace(/{{\s*chist-id\s*}}/, chist["id"]);
}

function openChist(event) {
  event.stopPropagation();
  event.preventDefault();
  self.port.emit("open-chist", event.target.href);
}

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

var newChistButton = document.getElementById("create-chist-button");

newChistButton.addEventListener("click", function(event) {
  var format = document.getElementById("chat-format").value;
  event.stopPropagation();
  event.preventDefault();
  self.port.emit("new-chist", format);
});

self.port.on("chist-created", function(chist) {
  addLink(chist);
  var link = document.getElementById(chist["id"]);
  link.addEventListener("click", openChist);
});
