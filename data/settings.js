var saveButton   = document.getElementById("save-settings");
var cancelButton = document.getElementById("cancel-settings");
var apiKeyField  = document.getElementById("api-key");
var ichistLink   = document.getElementById("ichist-link");

function handleLinks(event) {
  self.port.emit("open-link", event.target.href);
  event.preventDefault();
  event.stopPropagation();
}

cancelButton.addEventListener("click", function(event) {
  self.port.emit("hide-settings");
});

saveButton.addEventListener("click", function(event) {
  self.port.emit("save-key", apiKeyField.value);
});

apiKeyField.addEventListener("keyup", function(event) {
  if (event.keyCode == 13 && event.target.value != "") {
    saveButton.focus();
  } else {
    saveButton.disabled = (apiKeyField.value == "");
  }
});

ichistLink.addEventListener("click", handleLinks);
