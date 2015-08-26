Editor.prototype.selection = {};
Editor.prototype.selection.bounds = false;
Editor.prototype.selection.init = function() {

  // var self = this;

  // message handlers

  // selection has been started
  // channel.gui.subscribe('selection.start', function(data, envelope) {
  //   self.bounds = {
  //     start: data.point
  //   };
  // });

  // selection box is being drawn
  // channel.gui.subscribe('selection.resize', function(data, envelope) {
  //   self.bounds.cursor = data.point;
  // });

  // selection is complete
  // channel.gui.subscribe('selection.end', function(data, envelope) {
  //   self.bounds = { // reset self selection to remove cursor property as it's no longer needed
  //     start: self.bounds.start,
  //     end: data.point
  //   };

  //   // switch start & end if start is more "lower right" than end
  //   // makes calculations with the selection easier later
  //   if(self.bounds.start.x > self.bounds.end.x
  //   || self.bounds.start.y > self.bounds.end.y) {
  //     var temp = self.bounds.start;
  //     self.bounds.start = self.bounds.end;
  //     self.bounds.end = temp;
  //   }

  //   // restrict scope to selection
  //   var scopeData = {
  //     old: editor.layers.selected,
  //     scope: 'selection',
  //     data: self.bounds,
  //   };

  //   // set new scope
  //   channel.gui.publish('scope.set', scopeData);
  // });

  // selection has been cleared
  // channel.gui.subscribe('selection.clear', function(data, envelope) {
  //   self.bounds = false;

  //   // revert scope back to layer
  //   var scopeData = {
  //     old: editor.layers.selected,
  //     scope: 'layer',
  //     data: editor.layers.selected,
  //   };

  //   // set new scope
  //   channel.gui.publish('scope.set', scopeData);
  // });


  //
  // channel.gui.subscribe('selection.preview', function(data, envelope) {
  //   self.bounds.distance = data.distance;
  // });

  // selection is being moved
  // channel.gui.subscribe('selection.move', function(data, envelope) {
  //   self.bounds = {
  //     start: new Point(
  //       self.bounds.start.x + data.distance.x,
  //       self.bounds.start.y + data.distance.y
  //     ),
  //     end: new Point(
  //       self.bounds.end.x + data.distance.x,
  //       self.bounds.end.y + data.distance.y
  //     )
  //   };

  //   // update scope
  //   var scopeData = {
  //     old: editor.layers.selected,
  //     scope: 'selection',
  //     data: self.bounds,
  //   };

  //   channel.gui.publish('scope.set', scopeData);
  // });

};

// Editor.prototype.selection.contains = function(point) {
//   if(this.isActive)
//     return point.x >= this.bounds.start.x
//         && point.x <= this.bounds.end.x
//         && point.y >= this.bounds.start.y
//         && point.y <= this.bounds.end.y;
// };

// Object.defineProperty(Editor.prototype.selection, 'isActive', {
//   enumerable: true,
//   configurable: false,
//   get: function() {
//     return this.bounds.start instanceof Point
//         && this.bounds.end instanceof Point;
//   }
// });

// Object.defineProperty(Editor.prototype.selection, 'isResizing', {
//   enumerable: true,
//   configurable: false,
//   get: function() {
//     return this.bounds.start instanceof Point
//         && this.bounds.cursor instanceof Point;
//   }
// });

// Object.defineProperty(Editor.prototype.selection, 'isMoving', {
//   enumerable: true,
//   configurable: false,
//   get: function() {
//     return this.bounds.start instanceof Point
//         && this.bounds.end instanceof Point
//         && this.bounds.distance instanceof Point;
//   }
// });