var Hotkeys = function() {

  function moveTool(distance) {
    flux.actions.pixelsMove(distance);
    if(storeUtils.selection.isActive) {
      flux.actions.selectionMove(distance);
      flux.actions.scopeSet(flux.UiStore.getData().layers.selected, 'selection', flux.UiStore.getData().selection);
    }
  }

  function rectangularSelectionTool(distance) {
    if(storeUtils.selection.isActive) {
      flux.actions.selectionMove(distance);
      flux.actions.scopeSet(flux.UiStore.getData().layers.selected, 'selection', flux.UiStore.getData().selection);
    }
  }

  this.actions = {
    paint: {
      // ------- letters -------
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
        key: 'l',
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
      toggleOnion: {
        key: 'o',
        action: function() { flux.actions.onionToggle(); }
      },
      // ------- arrows -------
      arrowUp: {
        key: ['up'],
        action: function() {
          var distance = new Point(0, -1);
          switch(flux.stores.UiStore.getData().tool) {
            case 'BrushTool':
            case 'PaintBucketTool':
              var color = changeColorLightness(flux.stores.UiStore.getData().color.brush, 1);
              flux.actions.colorBrush(color.hexString());
              break;
            case 'RectangularSelectionTool':
              rectangularSelectionTool(distance);
              break;
            case 'BrightnessTool':
              var intensity = flux.stores.UiStore.getData().brightnessTool.intensity+1;
              if(intensity <= 100) flux.actions.brightnessToolIntensity(intensity);
              break;
            case 'MoveTool':
              moveTool(distance);
              break;
            case 'ZoomTool':
              var zoom = flux.stores.UiStore.getData().zoom.selected+1;
              flux.actions.zoomSelect(zoom);
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
              var color = flux.stores.UiStore.getData().color.brush.rotate(1);
              flux.actions.colorBrush(color.hexString());
              break;
            case 'RectangularSelectionTool':
              rectangularSelectionTool(distance);
              break;
            case 'BrightnessTool':
              flux.actions.brightnessToolMode('darken');
              break;
            case 'MoveTool':
              moveTool(distance);
              break;
            case 'ZoomTool':
              var zoom = flux.stores.UiStore.getData().zoom.selected+1;
              flux.actions.zoomSelect(zoom);
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
              var color = changeColorLightness(flux.stores.UiStore.getData().color.brush, -1);
              flux.actions.colorBrush(color.hexString());
              break;
            case 'RectangularSelectionTool':
              rectangularSelectionTool(distance);
              break;
            case 'BrightnessTool':
              var intensity = flux.stores.UiStore.getData().brightnessTool.intensity-1;
              if(intensity >= 1) flux.actions.brightnessToolIntensity(intensity);
              break;
            case 'MoveTool':
              moveTool(distance);
              break;
            case 'ZoomTool':
              var zoom = flux.stores.UiStore.getData().zoom.selected-1;
              flux.actions.zoomSelect(zoom);
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
              var color = flux.stores.UiStore.getData().color.brush.rotate(-1);
              flux.actions.colorBrush(color.hexString());
              break;
            case 'RectangularSelectionTool':
              rectangularSelectionTool(distance);
              break;
            case 'BrightnessTool':
              flux.actions.brightnessToolMode('lighten');
              break;
            case 'MoveTool':
              moveTool(distance);
              break;
            case 'ZoomTool':
              var zoom = flux.stores.UiStore.getData().zoom.selected-1;
              flux.actions.zoomSelect(zoom);
              break;
          }
        }
      },
      // ------- shift-arrows -------
      shiftArrowUp: {
        key: ['shift+up'],
        action: function() {
          var distance = new Point(0, -10);
          switch(flux.stores.UiStore.getData().tool) {
            case 'BrushTool':
            case 'PaintBucketTool':
              var color = changeColorLightness(flux.stores.UiStore.getData().color.brush, 10);
              flux.actions.colorBrush(color.hexString());
              break;
            case 'RectangularSelectionTool':
              rectangularSelectionTool(distance);
              break;
            case 'MoveTool':
              moveTool(distance);
              break;
            case 'ZoomTool':
              var zoom = flux.stores.UiStore.getData().zoom.selected+10;
              flux.actions.zoomSelect(zoom);
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
              var color = flux.stores.UiStore.getData().color.brush.rotate(10);
              flux.actions.colorBrush(color.hexString());
              break;
            case 'RectangularSelectionTool':
              rectangularSelectionTool(distance);
              break;
            case 'MoveTool':
              moveTool(distance);
              break;
            case 'ZoomTool':
              var zoom = flux.stores.UiStore.getData().zoom.selected+10;
              flux.actions.zoomSelect(zoom);
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
              var color = changeColorLightness(flux.stores.UiStore.getData().color.brush, -10);
              flux.actions.colorBrush(color.hexString());
              break;
            case 'RectangularSelectionTool':
              rectangularSelectionTool(distance);
              break;
            case 'MoveTool':
              moveTool(distance);
              break;
            case 'ZoomTool':
              var zoom = flux.stores.UiStore.getData().zoom.selected-10;
              flux.actions.zoomSelect(zoom);
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
              var color = flux.stores.UiStore.getData().color.brush.rotate(-10);
              flux.actions.colorBrush(color.hexString());
              break;
            case 'RectangularSelectionTool':
              rectangularSelectionTool(distance);
              break;
            case 'MoveTool':
              moveTool(distance);
              break;
            case 'ZoomTool':
              var zoom = flux.stores.UiStore.getData().zoom.selected-10;
              flux.actions.zoomSelect(zoom);
              break;
          }
        }
      },
      historyUndo: {
        key: ['meta+z'],
        action: function() { stateHistory.undo(); },
      },
      historyRedo: {
        key: ['meta+y'],
        action: function() { stateHistory.redo(); },
      },
    }, // paint hotkeys
    animate: {},
    export: {},
  }; // actions
};

Hotkeys.prototype.bind = function(tab) {
  if(this.actions[tab]) {
    Object.keys(this.actions[tab]).map(function(action) {
      var a = this.actions[tab][action];
      Mousetrap.bind(a.key, a.action);
    }, this);
  }
};

Hotkeys.prototype.unbind = function(tab) {
  if(this.actions[tab]) {
    Object.keys(this.actions[tab]).map(function(action) {
      var a = this.actions[tab][action];
      Mousetrap.unbind(a.key);
    }, this);
  }
};

module.exports = new Hotkeys();