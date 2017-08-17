import initialState from "../initialState";
import _ from "lodash";
import { Point } from "../../classes";
import {
  createBounds,
  deletePixels,
  duplicateLayers,
  flattenPixels,
  insideBounds,
  mergeLayerPixels,
  selectionIsActive,
} from "../../utils";

function filePixelsReducer(state = initialState.file.pixels, action) {
  switch (action.type) {

  case "FILE_CREATE":
    return {};

  case "FILE_LOAD":
    return Object.assign({}, action.json.pixels);

  case "FILE_SIZE": {
    // TODO implement this
    return state;
  }

  case "FRAME_DUPLICATE": {
    const { layers, source, target, nextLayerId } = action;

    let stateCopy = _.cloneDeep(state);
    let pixelsToDuplicate = {};
    if(stateCopy[source]) {
      pixelsToDuplicate = stateCopy[source];
    }

    const newLayers = duplicateLayers(layers, target, nextLayerId);

    let layerMap = {};
    layers.map((layer, index) => {
      layerMap[layer.id] = newLayers[index].id;
    });

    const newPixels = manipulateFramePixels(pixelsToDuplicate, copyPixelToFrame.bind(this, target, layerMap));

    delete stateCopy[target];
    return _.merge(stateCopy, {
      [target]: newPixels
    });
  }

  case "FRAME_FLIP_HORIZONTAL": {
    let stateCopy = _.cloneDeep(state);
    const { frame, pixels, pivot, size } = action;
    const bounds = createBounds(size);
    const newPixels = manipulateFramePixels(pixels, flipPixelHorizontal.bind(this, pivot, bounds));

    delete stateCopy[frame];
    return _.merge(stateCopy, {
      [frame]: newPixels
    });
  }

  case "FRAME_FLIP_VERTICAL": {
    let stateCopy = _.cloneDeep(state);
    const { frame, pixels, pivot, size } = action;
    const bounds = createBounds(size);
    const newPixels = manipulateFramePixels(pixels, flipPixelVertical.bind(this, pivot, bounds));

    delete stateCopy[frame];
    return _.merge(stateCopy, {
      [frame]: newPixels
    });
  }

  case "FRAME_ROTATE": {
    let stateCopy = _.cloneDeep(state);
    const { frame, pixels, angle, pivot, size } = action;
    const bounds = createBounds(size);
    const newPixels = manipulateFramePixels(pixels, rotatePixel.bind(this, angle, pivot, bounds));

    delete stateCopy[frame];
    return _.merge(stateCopy, {
      [frame]: newPixels
    });
  }

  case "LAYER_DELETE": {
    let stateCopy = _.cloneDeep(state);
    delete stateCopy[action.frame][action.layer];
    if(Object.keys(stateCopy[action.frame]).length === 0) delete stateCopy[action.frame];
    if(Object.keys(stateCopy).length === 0) stateCopy = {};
    return stateCopy;
  }

  case "LAYER_MERGE": {
    const { frame, first, second } = action;
    let stateCopy = _.cloneDeep(state);
    stateCopy = mergeLayerPixels(frame, first, second, stateCopy);
    return stateCopy;
  }

  case "PIXELS_ADD":
  case "PIXELS_PASTE": {
    if(state[action.frame] == undefined) state[action.frame] = {};
    if(state[action.frame][action.layer] == undefined) state[action.frame][action.layer] = {};

    const
      px = state[action.frame][action.layer],
      newPx = _.merge(px, action.pixels);

    return Object.assign({}, _.merge(state, {
      [action.frame]: {
        [action.layer]: newPx
      }
    }));
  }

  case "PIXELS_CUT":
  case "PIXELS_DELETE": {
    const { frame, layer, pixels } = action;
    let stateCopy = _.cloneDeep(state);
    stateCopy = deletePixels(stateCopy, frame, layer, pixels);
    return stateCopy;
  }

  case "PIXELS_FLIP_HORIZONTAL": {
    let stateCopy = _.cloneDeep(state);
    const { frame, layer, pixels, pivot, size } = action;
    const bounds = createBounds(size);
    const newPixels = manipulatePixels(pixels, flipPixelHorizontal.bind(this, pivot, bounds));

    deletePixels(stateCopy, frame, layer, pixels);
    return _.merge(stateCopy, {
      [frame]: {
        [layer]: newPixels
      }
    });
  }

  case "PIXELS_FLIP_VERTICAL": {
    let stateCopy = _.cloneDeep(state);
    const { frame, layer, pixels, pivot, size } = action;
    const bounds = createBounds(size);
    const newPixels = manipulatePixels(pixels, flipPixelVertical.bind(this, pivot, bounds));

    deletePixels(stateCopy, frame, layer, pixels);
    return _.merge(stateCopy, {
      [frame]: {
        [layer]: newPixels
      }
    });
  }

  case "PIXELS_MOVE": {
    let stateCopy = Object.assign({}, state);
    const sizeBounds = {
      start: { x: 1, y: 1 },
      end: { x: action.size.width, y: action.size.height }
    };

    let newPixels = {};

    if(selectionIsActive(action.selection)) {
      // iterate over x-axis
      Object.keys(action.pixels).map(x => {
        // iterate over y-axis
        Object.keys(action.pixels[x]).map(y => {
          // grab a copy of the old pixel
          const oldPixel = action.pixels[x][y];
          // translate pixel coordinates to new position
          const p = new Point(x, y).translate(action.distance);
          // check if pixel was in selection and is still inside the file
          if(insideBounds(action.selection, oldPixel) && insideBounds(sizeBounds, p)) {
            // create new translated pixel
            if(!newPixels[p.x]) newPixels[p.x] = {};
            newPixels[p.x][p.y] = {
              frame: action.frame,
              layer: action.layer,
              x: p.x,
              y: p.y,
              r: oldPixel.r,
              g: oldPixel.g,
              b: oldPixel.b,
              z: oldPixel.z,
            };

            // delete old pixel
            delete stateCopy[action.frame][action.layer][x][y];
          }
        });
      });

      // merge new pixels with old ones
      const newLayerPixels = _.merge(stateCopy[action.frame][action.layer], newPixels);
      stateCopy[action.frame][action.layer] = newLayerPixels;
    }
    else {
      // delete all pixels of the layer
      delete stateCopy[action.frame][action.layer];

      // iterate over x-axis
      Object.keys(action.pixels).map(x => {
        // iterate over y-axis
        Object.keys(action.pixels[x]).map(y => {
          // translate pixel coordinates to new position
          const p = new Point(x, y).translate(action.distance);
          // check if pixel is still inside the file
          if(insideBounds(sizeBounds, p)) {
            // create new translated pixel
            if(!newPixels[p.x]) newPixels[p.x] = {};
            newPixels[p.x][p.y] = {
              frame: action.frame,
              layer: action.layer,
              x: p.x,
              y: p.y,
              r: action.pixels[x][y].r,
              g: action.pixels[x][y].g,
              b: action.pixels[x][y].b,
              z: action.pixels[x][y].z,
            };
          }
        });
      });

      // merge new pixels back to state copy
      stateCopy[action.frame][action.layer] = newPixels;
    }

    return stateCopy;
  }

  case "PIXELS_ROTATE": {
    let stateCopy = _.cloneDeep(state);
    const { frame, layer, pixels, angle, pivot, size } = action;
    const bounds = createBounds(size);
    const newPixels = manipulatePixels(pixels, rotatePixel.bind(this, angle, pivot, bounds));

    deletePixels(stateCopy, frame, layer, pixels);
    return _.merge(stateCopy, {
      [frame]: {
        [layer]: newPixels
      }
    });
  }

  default:
    return state;
  }
}

export default filePixelsReducer;



// helper functions

function rotatePixel(angle, pivot, bounds, pixel) {
  pixel.rotate(angle, pivot);
  if(insideBounds(bounds, pixel)) return pixel;
  else return false;
}

function flipPixelVertical(pivot, bounds, pixel) {
  pixel.flipVertical(pivot);
  if(insideBounds(bounds, pixel)) return pixel;
  else return false;
}

function flipPixelHorizontal(pivot, bounds, pixel) {
  pixel.flipHorizontal(pivot);
  if(insideBounds(bounds, pixel)) return pixel;
  else return false;
}

function copyPixelToFrame(frame, layerMap, pixel) {
  pixel.frame = frame;
  pixel.layer = layerMap[pixel.layer];
  return pixel;
}

function inflatePixels(pixels) {
  let pixelMap = {};
  pixels.forEach(pixel => {
    if(!pixelMap[pixel.x]) pixelMap[pixel.x] = {};
    pixelMap[pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

function inflateFramePixels(pixels) {
  let pixelMap = {};
  pixels.forEach(pixel => {
    if(!pixelMap[pixel.layer]) pixelMap[pixel.layer] = {};
    if(!pixelMap[pixel.layer][pixel.x]) pixelMap[pixel.layer][pixel.x] = {};
    pixelMap[pixel.layer][pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

function manipulatePixels(pixels, callback) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback, this);
  pixels = inflatePixels(pixels);
  return pixels;
}

function manipulateFramePixels(pixels, callback) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback, this);
  pixels = inflateFramePixels(pixels);
  return pixels;
}
