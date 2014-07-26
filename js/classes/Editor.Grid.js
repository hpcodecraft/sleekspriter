Editor.prototype.grid = {};
Editor.prototype.grid.enabled = true;

Editor.prototype.grid.init = function() {
  var self = this;

  channel.subscribe('stage.grid.toggle', function(data, envelope) {
    self.enabled = data.grid;
  });
};