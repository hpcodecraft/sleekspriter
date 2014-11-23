var Editor = function() {

  var self = this;

  this.offset = {
    top: 40,
    right: 205,
    bottom: 27,
    left: 45,
  };

  this.settingsVisible = false;

  channel.subscribe('settings.toggle', function(data, envelope) {
    self.settingsVisible = data.visible;
  });

  // init subclasses
  this.file.init();
  this.frame.init();
  this.layers.init();
  this.pixels.init();
  this.selection.init();
  this.brightnessTool.init();
  this.paintBucket.init();
  this.palettes.init();
  this.zoom.init();
  this.grid.init();
  this.cursor.init();
  this.color.init();
  this.background.init();
  this.tool.init();
  this.animations.init();
};

Editor.prototype = {};
Editor.prototype.constructor = Editor;