var Hotkeys = function(editor) {

  function moveTool(distance) {
    channel.gui.publish('pixels.move', {distance: distance});
    if(editor.selection.isActive) {
      channel.gui.publish('selection.move', {distance: distance});
    }
  }

  function rectangularSelectionTool(distance) {
    if(editor.selection.isActive) channel.gui.publish('selection.move', {distance: distance});
  }

  this.actions = {
    selectBrushTool: {
      key: 'b',
      action: function() { flux.actions.toolSelect('BrushTool'); }
    },
    selectEraserTool: {
      key: 'e',
      action: function() { flux.actions.toolSelect('EraserTool'); }
    },
    selectEyedropperTool: {
      key: 'i',
      action: function() { flux.actions.toolSelect('EyedropperTool'); }
    },
    selectRectangularSelectionTool: {
      key: 'm',
      action: function() { flux.actions.toolSelect('RectangularSelectionTool'); }
    },
    selectPaintBucketTool: {
      key: 'p',
      action: function() { flux.actions.toolSelect('PaintBucketTool'); }
    },
    selectBrightnessTool: {
      key: 'o',
      action: function() { flux.actions.toolSelect('BrightnessTool'); }
    },
    selectMoveTool: {
      key: 'v',
      action: function() { flux.actions.toolSelect('MoveTool'); }
    },
    selectZoomTool: {
      key: 'z',
      action: function() { flux.actions.toolSelect('ZoomTool'); }
    },
    toggleGrid: {
      key: 'g',
      action: function() { flux.actions.settingsGrid(!flux.stores.UiStore.getData().settings.grid); }
    },








    arrowUp: {
      key: ['up'],
      action: function() {
        var distance = new Point(0, -1);
        switch(flux.stores.UiStore.getData().tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color.brush, 1);
            channel.gui.publish('color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            rectangularSelectionTool(distance);
            break;
          case 'BrightnessTool':
            var intensity = editor.brightnessTool.intensity+1;
            if(intensity <= 100) channel.gui.publish('brightnesstool.intensity.select', {intensity: intensity});
            break;
          case 'MoveTool':
            moveTool(distance);
            break;
          case 'ZoomTool':
            var zoom = editor.zoom.current+1;
            if(zoom <= 50) channel.gui.publish('zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowRight: {
      key: ['right'],
      action: function() {
        var distance = new Point(1, 0);
        switch(flux.stores.UiStore.getData().tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.brush.rotate(1);
            channel.gui.publish('color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            rectangularSelectionTool(distance);
            break;
          case 'BrightnessTool':
            channel.gui.publish('brightnesstool.mode.select', {mode: 'darken'});
            break;
          case 'MoveTool':
            moveTool(distance);
            break;
          case 'ZoomTool':
            var zoom = editor.zoom.current+1;
            if(zoom <= 50) channel.gui.publish('zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowDown: {
      key: ['down'],
      action: function() {
        var distance = new Point(0, 1);
        switch(flux.stores.UiStore.getData().tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color.brush, -1);
            channel.gui.publish('color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            rectangularSelectionTool(distance);
            break;
          case 'BrightnessTool':
            var intensity = editor.brightnessTool.intensity-1;
            if(intensity >= 1) channel.gui.publish('brightnesstool.intensity.select', {intensity: intensity});
            break;
          case 'MoveTool':
            moveTool(distance);
            break;
          case 'ZoomTool':
            var zoom = editor.zoom.current-1;
            if(zoom >= 1) channel.gui.publish('zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowLeft: {
      key: ['left'],
      action: function() {
        var distance = new Point(-1, 0);
        switch(flux.stores.UiStore.getData().tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.brush.rotate(-1);
            channel.gui.publish('color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            rectangularSelectionTool(distance);
            break;
          case 'BrightnessTool':
            channel.gui.publish('brightnesstool.mode.select', {mode: 'lighten'});
            break;
          case 'MoveTool':
            moveTool(distance);
            break;
          case 'ZoomTool':
            var zoom = editor.zoom.current-1;
            if(zoom >= 1) channel.gui.publish('zoom.select', {zoom: zoom});
            break;
        }
      }
    },









    shiftArrowUp: {
      key: ['shift+up'],
      action: function() {
        var distance = new Point(0, -10);
        switch(flux.stores.UiStore.getData().tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color.brush, 10);
            channel.gui.publish('color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            rectangularSelectionTool(distance);
            break;
          case 'MoveTool':
            moveTool(distance);
            break;
        }
      }
    },
    shiftArrowRight: {
      key: ['shift+right'],
      action: function() {
        var distance = new Point(10, 0);
        switch(flux.stores.UiStore.getData().tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.brush.rotate(10);
            channel.gui.publish('color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            rectangularSelectionTool(distance);
            break;
          case 'MoveTool':
            moveTool(distance);
            break;
        }
      }
    },
    shiftArrowDown: {
      key: ['shift+down'],
      action: function() {
        var distance = new Point(0, 10);
        switch(flux.stores.UiStore.getData().tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color.brush, -10);
            channel.gui.publish('color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            rectangularSelectionTool(distance);
            break;
          case 'MoveTool':
            moveTool(distance);
            break;
        }
      }
    },
    shiftArrowLeft: {
      key: ['shift+left'],
      action: function() {
        var distance = new Point(-10, 0);
        switch(flux.stores.UiStore.getData().tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.brush.rotate(-10);
            channel.gui.publish('color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            rectangularSelectionTool(distance);
            break;
          case 'MoveTool':
            moveTool(distance);
            break;
        }
      }
    },
  };

  var self = this;

  Object.keys(this.actions).map(function(action) {
    var a = self.actions[action];
    Mousetrap.bind(a.key, a.action);
  });
};