var PixelStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_LOAD,                    this.onFileLoad,
      constants.FRAME_SELECT,                 this.onFrameSelect,
      constants.FRAME_FLIP_HORIZONTAL,        this.onFrameFlipHorizontal,
      constants.FRAME_FLIP_VERTICAL,          this.onFrameFlipVertical,
      constants.LAYER_DELETE,                 this.onLayerDelete,
      constants.LAYER_DROP,                   this.onLayerDrop,
      constants.SCOPE_SET,                    this.onScopeSet,
      constants.SCOPE_COPY,                   this.onScopeCopy,
      constants.SCOPE_CUT,                    this.onScopeCut,
      constants.SCOPE_DELETE,                 this.onScopeDelete,
      constants.SCOPE_PASTE,                  this.onScopePaste,
      constants.SCOPE_FLIP_HORIZONTAL,        this.onScopeFlipHorizontal,
      constants.SCOPE_FLIP_VERTICAL,          this.onScopeFlipVertical,
      constants.PIXEL_ADD,                    this.onPixelAdd,
      constants.PIXEL_DELETE,                 this.onPixelDelete,
      constants.PIXELS_MOVE,                  this.onPixelsMove
    );
  },

  getData: function() {
    return this.data;
  },

  resetData: function(key) {
    var data = {
      file: [],
      frame: [],
      scope: [],
      clipboard: [],
      preview: [],
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  //----------------------------------------------------------------------------
  // Action handlers
  //----------------------------------------------------------------------------

  onFileLoad: function() {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.file = FileStore.getData().pixels;
      this.emit('change');
    });
  },

  onFrameSelect: function(frame) {
    this.waitFor(['UiStore'], function(UiStore) {
      this.data.frame = _.where(this.data.file, {frame: frame});
      this.emit('change');
    });
  },

  onFrameFlipHorizontal: function() {
    this.data.scope.forEach(this.flipHorizontal, this);
    this.data.frame.forEach(this.flipHorizontal, this);
    this.emit('change');
  },

  onFrameFlipVertical: function() {
    this.data.scope.forEach(this.flipVertical, this);
    this.data.frame.forEach(this.flipVertical, this);
    this.emit('change');
  },

  onLayerDelete: function(id) {
    this.data.file = this.data.file.filter(function(pixel) {
      return pixel.layer !== id;
    });
    this.data.frame = _.where(this.data.file, {frame: flux.stores.UiStore.getData().frames.selected});
    this.emit('change');
  },

  onLayerDrop: function(id) {
    this.waitFor(['FileStore'], function(FileStore) {

      // refresh z values of all pixels
      var layerZ = {};
      FileStore.getData().layers.forEach(function(layer) {
        layerZ[layer.id] = layer.z;
      });

      this.data.file.forEach(function(pixel) {
        pixel.z = layerZ[pixel.layer];
      });

      this.data.frame = _.where(this.data.file, {frame: flux.stores.UiStore.getData().frames.selected});
      this.emit('change');
    });
  },

  onScopeSet: function(params) {
    // update pixels in scope
    if(params.oldScope !== null && this.data.scope.length > 0) {
      // merge scope pixels back to frame
      this.data.scope.forEach(function(px) {
        var oldPixel = _.findWhere(this.data.frame, {x: px.x, y: px.y});
        if(!_.isUndefined(oldPixel)) {
          this.data.frame = this.deletePixel(this.data.frame, px.layer, px.x, px.y);
        }
        this.data.frame.push(px);
      }, this);

      this.data.scope = [];
    }

    var layer = params.type === 'layer' ? params.data : params.oldScope;
    // use selected layer if no layer data was given
    if(layer === undefined) layer = storeUtils.layers.getSelected().id;

    switch(params.type) {
      case 'selection':
        // move pixels in selection to scope
        this.data.scope = _.remove(this.data.frame, function(px) {
          return px.layer === layer && storeUtils.selection.contains(px);
        });
        break;

      case 'layer':
        // move pixels of layer to scope
        this.data.scope = _.remove(this.data.frame, {layer: layer});
        break;
    }

    this.emit('change');
    this.log();
  },

  onScopeCopy: function() {
    this.data.clipboard = this.data.scope;
    this.emit('change');

    this.log();
  },

  onScopeCut: function() {
    this.data.clipboard = this.data.scope;
    this.data.scope.forEach(function(px) {
      this.data.file = this.deletePixel(this.data.file, px.layer, px.x, px.y);
      this.data.scope = this.deletePixel(this.data.scope, px.layer, px.x, px.y);
      this.data.frame = this.deletePixel(this.data.frame, px.layer, px.x, px.y);
    }, this);

    this.emit('change');

    this.log();
  },

  onScopeDelete: function() {
    this.data.scope.forEach(function(px) {
      this.data.file = this.deletePixel(this.data.file, px.layer, px.x, px.y);
      this.data.scope = this.deletePixel(this.data.scope, px.layer, px.x, px.y);
      this.data.frame = this.deletePixel(this.data.frame, px.layer, px.x, px.y);
    }, this);

    this.emit('change');

    this.log();
  },

  onScopePaste: function() {
    // get current frame & layer
    var frame = flux.stores.UiStore.getData().frames.selected,
        layer = flux.stores.UiStore.getData().layers.selected,
        z = storeUtils.layers.getSelected().z;

    function pastePixel(px) {
      this.addPixel(frame, layer, px.x, px.y, z, px.toHex());
    }

    this.data.clipboard.forEach(pastePixel, this);
    this.emit('change');

    this.log();
  },

  onScopeFlipHorizontal: function() {
    this.data.scope.forEach(this.flipHorizontal, this);
  },

  onScopeFlipVertical: function() {
    this.data.scope.forEach(this.flipVertical, this);
  },

  onPixelAdd: function(payload) {
    this.addPixel(payload.frame, payload.layer, payload.x, payload.y, payload.z, payload.color);
    this.emit('change');
    this.log();
  },

  onPixelDelete: function(payload) {
    this.data.file = this.deletePixel(this.data.file, payload.layer, payload.x, payload.y);
    this.data.scope = this.deletePixel(this.data.scope, payload.layer, payload.x, payload.y);
    this.data.frame = this.deletePixel(this.data.frame, payload.layer, payload.x, payload.y);

    this.emit('change');

    this.log();
  },

  onPixelsMove: function(distance) {
    var wrapPixel = function(px) { px.wrap(distance) };
    this.data.scope.forEach(wrapPixel);
    this.emit('change');
  },


  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------

  log: function() {
    console.log('clipboard: '+this.data.clipboard.length+' '+
                'scope: '+this.data.scope.length+' '+
                'frame: '+this.data.frame.length);
  },

  deletePixel: function(pixels, layer, x, y) {
    return pixels.filter(function(px) {
      return !(px.layer == layer && px.x == x && px.y == y);
    });
  },

  addPixel: function(frame, layer, x, y, z, color) {
    // add pixel to scope / replace pixel in scope
    var c = new Color(color),
        a = 1;

    var newPixel = new Pixel(frame, layer, x, y, c.red(), c.green(), c.blue(), a, z);
    var oldPixel = _.findWhere(this.data.scope, {x: x, y: y});
    if(_.isUndefined(oldPixel)) {
      console.log('filling pixel', layer, x, y, c.rgbString());
      this.data.scope.push(newPixel);
    }
    else {
      console.log('replacing pixel', layer, x, y, c.rgbString());
      // replace old pixel
      for(var i = 0; i < this.data.scope.length; i++) {
        var p = this.data.scope[i];
        if(p.x == x && p.y == y) {
          p.r = c.red();
          p.g = c.green();
          p.b = c.blue();
          p.a = a;
          break;
        }
      }
    }
  },

  flipHorizontal: function(pixel) {
    return pixel.flipHorizontal();
  },

  flipVertical: function(pixel) {
    return pixel.flipVertical();
  },

});