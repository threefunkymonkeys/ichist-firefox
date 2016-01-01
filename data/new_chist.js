var chatFormat  = document.getElementById("chat-format");
var chistTitle  = document.getElementById("chist-title");
var chistRaw    = document.getElementById("chist-raw");
var saveChist   = document.getElementById("save-chist");
var cancelNew   = document.getElementById("cancel-chist");
var chistPublic = document.getElementById("chist-public");

self.port.on("new-chist", function(format) {
  chatFormat.value = format;
  chistRaw.focus();
});

chistRaw.addEventListener("paste", function(event) {
  if (chistTitle.value == "") {
    chistTitle.focus();
  } else {
    saveChist.disabled = false;
    saveChist.focus();
  }
});

chistTitle.addEventListener("keyup", function(event) {
  if (event.keyCode == 13) {
    if (chistTitle.value == "") {
      chistRaw.focus();
    } else {
      saveChist.disabled = false;
      saveChist.focus();
    }
  } else {
    saveChist.disabled = (chistTitle.value == "" || chistRaw.value == "");
  }
});

saveChist.addEventListener("click", function(event) {
  self.port.emit("create-chist",
                 chistTitle.value,
                 chistRaw.value,
                 chatFormat.value,
                 chistPublic.checked);

});

cancelNew.addEventListener("click", function(event) {
  self.port.emit("hide-panel");
});

self.port.on("chist-created", function(chist) {
  chistTitle.value = "";
  chistRaw.value = "";
  chistPublic.value = false;
  self.port.emit("hide-panel");
});
