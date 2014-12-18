Editor.prototype.zoom = {};
Editor.prototype.zoom.min = 1;
Editor.prototype.zoom.max = 50;
Editor.prototype.zoom.current = 10;

Editor.prototype.zoom.init = function() {
  var self = this;

  channel.subscribe('zoom.select', function(data, envelope) {
    self.current = parseInt(data.zoom) || self.current;
    self.current = self.current > self.max ? self.max : self.current;
    self.current = self.current < self.min ? self.min : self.current;
  });
};