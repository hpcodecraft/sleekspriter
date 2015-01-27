function NodeList2Array(NodeList) {
  //return [ ... NodeList ]; // ES6 version, doesn't work with JSX compiler
  return [].slice.call(NodeList);
};

function inArray(array, value) {
  return array.indexOf(value) > -1;
};

function fitCanvasIntoSquareContainer(canvasWidth, canvasHeight, containerSize) {
  var w = canvasWidth,
      h = canvasHeight,
      style = {},
      scale;

  if(w > h) scale = Math.floor(containerSize/w);
  else scale = Math.floor(containerSize/h);

  style.marginTop = Math.floor((containerSize - Math.round(h*scale))/2);
  style.marginLeft = Math.floor((containerSize - Math.round(w*scale))/2);

  w = Math.round(w*scale);
  h = Math.round(h*scale);

  return {
    width: w,
    height: h,
    style: style
  }
};

function isLayerVisible() {
  var layer = file.getLayerById(editor.layers.selected);
  return layer.visible && layer.opacity > 0;
};

// fix for color.js darken/lighten functions
// uses absolute instead of relative strengths and works on black/white
function changeColorLightness(color, delta) {
  var newColor = new Color(color.rgb()),
      l = newColor.hsl().l;

  l+= delta;
  newColor.values.hsl[2] = l;
  newColor.setValues("hsl", newColor.values.hsl);
  return newColor;
};

window.onresize = function(e) { channel.publish('window.resize'); };
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var channel = postal.channel('@@app');
var file = new File();
var editor = new Editor();
var hotkeys = new Hotkeys(editor);
var workspace = new Workspace();

function fileLoaded(json) {
  // init file
  file.fromJSON(json);
  // select last selected frame
  channel.publish('frame.select', {frame: editor.frames.selected});
  channel.publish('screen.select', {target: 'paint'});
}

// render UI
var container = document.getElementById('app-container');
React.render(React.createElement(App, {editor: editor, workspace: workspace}), container);



// helper to click hidden file inputs for load and save dialogs
function clickInput(id) {
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click');
  document.getElementById(id).dispatchEvent(event);
}

// bind file input change handlers
document.getElementById('fileOpen').addEventListener('change', function (e) {
  file.load(this.value, fileLoaded);
});

document.getElementById('fileSave').addEventListener('change', function (e) {
  file.save(this.value);
});