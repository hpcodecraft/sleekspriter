var FileStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_CREATE,              this.onFileCreate,
      constants.FILE_LOAD,                this.onFileLoad,
      constants.FILE_SAVE,                this.onFileSave,

      constants.LAYER_VISIBILITY,         this.onLayerVisibility,
      constants.LAYER_OPACITY,            this.onLayerOpacity,
      constants.LAYER_NAME,               this.onLayerName,
      constants.LAYER_ADD,                this.onLayerAdd,
      constants.LAYER_DELETE,             this.onLayerDelete,
      constants.LAYER_DROP,               this.onLayerDrop,

      constants.ANIMATION_NAME,           this.onAnimationName,
      constants.ANIMATION_FPS,            this.onAnimationFps,
      constants.ANIMATION_ADD,            this.onAnimationAdd,
      constants.ANIMATION_DELETE,         this.onAnimationDelete,
      constants.ANIMATION_FRAME_ADD,      this.onAnimationFrameAdd,
      constants.ANIMATION_FRAME_EMPTY,    this.onAnimationFrameEmpty,
      constants.ANIMATION_FRAME_DELETE,   this.onAnimationFrameDelete
    );
  },

  getData: function(key) {
    if(key && this.data[key]) return this.data[key];
    else return this.data;
  },

  resetData: function(key) {
    var data = {
      path: '',
      name: '',
      folder: '',

      size: {width: 0, height: 0},
      frames: {x: 0, y: 0},
      layers: [],
      animations: [],
      pixels: [],
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  onFileCreate: function(payload) {
    var json = {},
        totalFrames = payload.framesX * payload.framesY;

    json.frames = [+payload.framesX, +payload.framesY];
    json.size = [+payload.pixelsX, +payload.pixelsY];
    json.layers = [];
    json.animations = [];
    json.pixels = [];

    for(var i = 0; i < totalFrames; i++) {
      json.layers.push([i+1, i+1, 'Layer '+(i+1), 0, 100, 1]);
    }

    this.resetData();
    this._fromJSON(json);

    this.emit('change');
  },

  onFileLoad: function(payload) {
    this.resetData();
    this._fromJSON(payload.json);

    this.data.path    = payload.path;
    this.data.name    = payload.name;
    this.data.folder  = payload.folder;

    this.emit('change');
  },

  onFileSave: function(payload) {
    console.log('FileStore.onFileSave');
    this.emit('change');
  },

  onLayerVisibility: function(payload) {
    var layer = storeUtils.layers.getById(parseInt(payload.layer));
    layer.visible = !!payload.visible;
    this.data.layers.forEach(function(l) {
      if(l.id === layer.id) l = layer;
    });
    this.emit('change');
  },

  onLayerOpacity: function(payload) {
    var layer = storeUtils.layers.getById(parseInt(payload.layer));
    layer.opacity = parseInt(payload.opacity);
    this.data.layers.forEach(function(l) {
      if(l.id === layer.id) l = layer;
    });
    this.emit('change');
  },

  onLayerName: function(payload) {
    var layer = storeUtils.layers.getById(parseInt(payload.layer));
    layer.name = payload.name;
    this.data.layers.forEach(function(l) {
      if(l.id === layer.id) l = layer;
    });
    this.emit('change');
  },

  onLayerAdd: function(selectedLayer) {

    var selectedFrame = flux.stores.UiStore.getData().frames.selected,
        index = 0;

    for(var i=0; i < this.data.layers.length; i++) {
      if(this.data.layers[i].id === selectedLayer) {
        index = i;
        break;
      }
    }

    var frameLayers = _.where(this.data.layers, {frame: selectedFrame});
    var newZIndex = (_.max(frameLayers, function(layer) { return layer.z; })).z + 1;

    var newId = (_.max(this.data.layers, function(layer) { return layer.id; })).id + 1;
    var newLayer = this._layerFromFile([newId, selectedFrame, 'Layer ' + newId, newZIndex, 100, true]);

    this.data.layers.splice(index, 0, newLayer);
    this._fixLayerZ(selectedFrame);

    this.emit('change');
  },

  onLayerDelete: function(id) {
    this.waitFor(['PixelStore'], function() {
      var selectedFrame = flux.stores.UiStore.getData().frames.selected,
          index = 0;

      for(var i=0; i < this.data.layers.length; i++) {
        if(this.data.layers[i].id === id) {
          index = i;
          break;
        }
      }

      this.data.layers.splice(index, 1);
      this._fixLayerZ(selectedFrame);

      this.emit('change');
    });
  },

  onLayerDrop: function(payload) {

    var dropLayer = storeUtils.layers.getById(payload.layer),
        dropFrame = dropLayer.frame;

    var tempLayers = _.partition(this.data.layers, function(layer) {
      return layer.frame == dropFrame;
    });

    var frameLayers = tempLayers[0],
        otherLayers = tempLayers[1];

    // remove dragged layer from frame layers
    frameLayers = frameLayers.filter(function(item) {
      return item.id !== payload.layer;
    });

    // re-insert layer at new position
    frameLayers.splice(payload.position, 0, dropLayer).join();

    // merge layers back together
    this.data.layers = frameLayers.concat(otherLayers);

    // fix layer z-indices
    this._fixLayerZ(dropFrame);

    this.emit('change');
  },

  onAnimationName: function(payload) {
    var animation = storeUtils.animations.getById(payload.animation);
    animation.name = payload.name;
    this.data.animations.forEach(function(a) {
      if(a.id === payload.animation) a = animation;
    });
    this.emit('change');
  },

  onAnimationFps: function(payload) {
    var animation = storeUtils.animations.getById(payload.animation);
    animation.fps = parseInt(payload.fps);
    this.data.animations.forEach(function(a) {
      if(a.id === payload.animation) a = animation;
    });
    this.emit('change');
  },

  onAnimationAdd: function() {
    var newId = (_.max(this.data.animations, function(animation) { return animation.id; })).id + 1,
        animation = {
          id: newId,
          name: 'Animation '+ newId,
          fps: 10,
          frames: [],
        };

    this.data.animations.push(animation);
    this.emit('change');
  },

  onAnimationDelete: function(id) {
    this.data.animations = _.filter(this.data.animations, function(a) {
      return a.id !== id;
    });
    this.emit('change');
  },

  onAnimationFrameAdd: function(payload) {
    var animation = storeUtils.animations.getById(payload.animation);
    animation.frames.splice(payload.position, 0, payload.frame);
    this.data.animations.forEach(function(a) {
      if(a.id === payload.animation) a = animation;
    });
    this.emit('change');
  },

  onAnimationFrameEmpty: function(id) {
    var animation = storeUtils.animations.getById(id);
    animation.frames = [];
    this.data.animations.forEach(function(a) {
      if(a.id === id) a = animation;
    });
    this.emit('change');
  },

  onAnimationFrameDelete: function(payload) {
    var animation = storeUtils.animations.getById(payload.animation);
    if(animation.frames[payload.position] === payload.frame) {
      animation.frames.splice(payload.position, 1);
    }
    this.data.animations.forEach(function(a) {
      if(a.id === payload.animation) a = animation;
    });
    this.emit('change');
  },


  _fromJSON: function(json) {
    this.data.size = this._sizeFromFile(json.size);
    this.data.frames = this._framesFromFile(json.frames);
    this.data.layers = json.layers.map(this._layerFromFile);
    this.data.animations = _.sortBy(json.animations.map(this._animationFromFile), 'name');

    // add z and frame values to saved pixels
    var layerDict = {};
    this.data.layers.forEach(function(layer) {
      layerDict[layer.id] = {
        frame: layer.frame,
        z: layer.z
      };
    });

    json.pixels.forEach(function(pixel) {
      var layer = pixel[0],
          z = layerDict[layer].z,
          frame = layerDict[layer].frame;
      pixel.unshift(frame);
      pixel.push(z);
    });

    this.data.pixels = json.pixels.map(Pixel.fromArray);

    // sort layers by z (top to bottom)
    this.data.layers = _.sortBy(this.data.layers, 'z').reverse();
  },

  _sizeFromFile: function(size) {
    return {
      width: size[0],
      height: size[1]
    };
  },

  _framesFromFile: function(frames) {
    return {
      x: frames[0],
      y: frames[1]
    };
  },

  _layerFromFile: function(layer) {
    return {
      id: layer[0],
      frame: layer[1],
      name: layer[2],
      z: layer[3],
      opacity: layer[4],
      visible: !!layer[5]
    };
  },

  _animationFromFile: function(animation) {
    return {
      id: animation[0],
      name: animation[1],
      fps: animation[2],
      frames: animation[3],
    }
  },

  _fixLayerZ: function(frame) {
    this.data.layers.reverse();
    var z = 0;
    for(var i = 0; i < this.data.layers.length; i++) {
      if( this.data.layers[i].frame == frame) {
        this.data.layers[i].z = z;
        z++;
      }
    }
    this.data.layers.reverse();
  },
});