var { ToggleButton } = require('sdk/ui/button/toggle');
var panels           = require("sdk/panel");
var tabs             = require("sdk/tabs");
var Request          = require("sdk/request").Request;
var self             = require("sdk/self");
var ss               = require("sdk/simple-storage");
var chist_client     = null;

IChistClient = function(api_key) {
  this.key = api_key;
  this.URL = "http://localhost:9393";
}

IChistClient.prototype.getChists = function(callback) {
  var chists = Request({
    url: this.URL + "/chists",
    contentType: "application/json",
    headers: { Accept: "application/json",
               Authorization: this.key },
    onComplete: function(response) {
      callback(response.status, response.json)
    }
    
  });

  chists.get();
}

IChistClient.prototype.createChist = function(data, callback) {
  var chist = Request({
    url: this.URL + "/chists",
    contentType: "application/json",
    headers: { Accept: "application/json",
               Authorization: this.key },
    content: JSON.stringify(data),
    onComplete: function(response) {
      callback(response.status, response.json);
    }
  });

  chist.post();
}

var button = ToggleButton({
  id: "chist-button",
  label: "IChist",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  contentScriptFile: self.data.url("ichist.js"),
  onHide: handleHide
});

var newChistPanel = panels.Panel({
  contentURL: self.data.url("new_chist.html"),
  contentScriptFile: self.data.url("new_chist.js")
});

var settingsPanel = panels.Panel({
  contentURL: self.data.url("settings.html"),
  contentScriptFile: self.data.url("settings.js"),
  onHide: handleHide
});

function showMainPanel() {
    panel.show({
      position: button,
      width: 350,
      height: 250
    });
}

function showSettingsPanel() {
  settingsPanel.show({
    position: button,
    width: 200,
    height: 250
  });
}

//"dc37c1f0cbd35ade26339999833d669156b4b25c8c88b193"
function handleChange(state) {
  if (state.checked) {
    if (ss.storage.chist_api_key) {
      chist_client = new IChistClient(ss.storage.chist_api_key);

      showMainPanel();
    } else {
      showSettingsPanel();
    }
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

panel.on("show", function() {
  chist_client.getChists(function(status, chists){
    if (status == 200) {
      panel.port.emit("chists-loaded", chists); 
    } else {
      panel.port.emit("error", status, chists);
    }
  });
});

panel.port.on("open-chist", function(url) {
  tabs.open(url);
});

panel.port.on("new-chist", function(format) {
  newChistPanel.show({
    width: 500,
    height: 300
  });

  newChistPanel.port.emit("new-chist", format);
});


newChistPanel.port.on("create-chist", function(title, chist, format, isPublic){
  chist_client.createChist({
                       title: title,
                       chist: chist,
                       format: format,
                       public: isPublic
                     },
                     function(status, body) {
                       if (status == 201) {
                         newChistPanel.port.emit("chist-created", body["chist"]);
                         panel.port.emit("chist-created", body["chist"]);
                       } else {
                         newChistPanel.port.emit("error", body)
                       }
                     });
});

newChistPanel.port.on("hide-panel", function() {
  newChistPanel.hide();
});

settingsPanel.port.on("save-key", function(key) {
  ss.storage.chist_api_key = key;
  chist_client = new IChistClient(ss.storage.chist_api_key);
  settingsPanel.hide();
  showMainPanel();
});

settingsPanel.port.on("hide-settings", function() {
  settingsPanel.hide();
});

settingsPanel.port.on("open-link", function(href) {
  tabs.open(href);
});
