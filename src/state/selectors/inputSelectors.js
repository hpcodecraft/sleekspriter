// state input selectors for the memoized reselect selectors
export const getFileFrames = state => state.file.present.frames;
export const getFileLayers = state => state.file.present.layers;
export const getFilePixels = state => state.file.present.pixels;
export const getFileSize = state => state.file.present.size;
export const getFold = state => state.ui.paint.fold;
export const getOnion = state => state.ui.paint.onion;
export const getPaintFrame = state => state.ui.paint.frame;
export const getPaintLayerId = state => state.ui.paint.layer;
