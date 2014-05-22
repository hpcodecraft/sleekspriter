Editor.prototype.palettes = {};
Editor.prototype.palettes.selected = 'sprite';

Editor.prototype.palettes.init = function() {
  console.log('palette init');

  var self = this;

  channel.subscribe('app.palette.select', function(data, envelope) {
    self.selected = data.palette;
  });
};

Editor.prototype.palettes.buildAuto = function() {
  var palette = [];
  file.pixels.forEach(function(pixel) {
    var color = Color().rgb(pixel.r, pixel.g, pixel.b).hexString();
    palette.push(color);
  });
  this.available.sprite.colors = _.uniq(palette, false);
};

Editor.prototype.palettes.available = {
  sprite: {
    title: 'Sprite colours',
    short: 'Sprite',
    colors: [],
  },
  gameboy: {
    title: 'Nintendo Gameboy',
    short: 'GB',
    colors: ['#9bbc0f', '#8bac0f', '#306230', '#0f380f'],
  },
  teletext: {
    title: 'Teletext',
    short: 'TTX',
    colors: ['#000000', '#0000ff', '#ff0000', '#ff00ff', '#00ff00', '#00ffff', '#ffff00', '#ffffff'],
  },
  apple2: {
    title: 'Apple II',
    short: '][',
    colors: ['#000000', '#6c2940', '#403578', '#d93cf0', '#135740', '#808080', '#2697f0', '#bfb4f8',
             '#404b07', '#d9680f', '#eca8bf', '#26c30f', '#bfca87', '#93d6bf', '#ffffff'],
  },
  spectrum: {
    title: 'Sinclair ZX Spectrum',
    short: 'Spectrum',
    colors: ['#000000', '#0000c0', '#0000ff', '#c00000', '#ff0000', '#c000c0', '#ff00ff', '#00c000',
             '#00ff00', '#00c0c0', '#00ffff', '#c0c000', '#ffff00', '#c0c0c0', '#ffffff'],
  },
  cga: {
    title: 'Color Graphics Adapter',
    short: 'CGA',
    colors: ['#000000', '#555555', '#aaaaaa', '#ffffff', '#0000aa', '#5555ff', '#00aa00', '#55ff55',
             '#00aaaa', '#55ffff', '#aa0000', '#ff5555', '#aa00aa', '#ff55ff', '#aa5500', '#ffff55'],
  },
  vic20: {
    title: 'Commodore VIC-20',
    short: 'VIC-20',
    colors: ['#000000', '#ffffff', '#aa7449', '#eab489', '#782922', '#b86962', '#87d6dd', '#c7ffff',
             '#aa5fb6', '#ea9ff6', '#55a049', '#94e089', '#40318d', '#8071cc', '#bfce72', '#ffffb2'],
  },
  c64: {
    title: 'Commodore C=64',
    short: 'C=64',
    colors: ['#000000', '#505050', '#787878', '#9f9f9f', '#ffffff', '#8b5429', '#574200', '#883932',
             '#b86962', '#67b6bd', '#8b3f96', '#40318d', '#7869c4', '#55a049', '#94e089', '#bfce72'],
  },
  amstrad: {
    title: 'Amstrad CPC',
    short: 'CPC',
    colors: ['#000000', '#008000', '#00ff00', '#000080', '#008080', '#00ff80', '#0000ff', '#0080ff',
             '#00ffff', '#800000', '#808000', '#80ff00', '#800080', '#808080', '#80ff80', '#8000ff',
             '#8080ff', '#80ffff', '#ff0000', '#ff8000', '#ffff00', '#ff0080', '#ff8080', '#ffff80',
             '#ff00ff', '#ff80ff', '#ffffff'],
  },
  nes: {
    title: 'Nintendo Entertainment System',
    short: 'NES',
    colors: ['#000000', '#080808', '#7c7c7c', '#bcbcbc', '#d8d8d8', '#fcfcfc', '#0000fc', '#0078f8',
             '#3cbcfc', '#a4e4fc', '#0000bc', '#0058f8', '#6888fc', '#b8b8f8', '#4428bc', '#6844fc',
             '#9878f8', '#d8b8f8', '#940084', '#d800cc', '#f878f8', '#f8b8f8', '#a80020', '#e40058',
             '#f85898', '#f8a4c0', '#a81000', '#f83800', '#f87858', '#f0d0b0', '#881400', '#e45c10',
             '#fca044', '#fce0a8', '#503000', '#ac7c00', '#f8b800', '#f8d878', '#007800', '#00b800',
             '#b8f818', '#d8f878', '#006800', '#00a800', '#58d854', '#b8f8b8', '#005800', '#00a844',
             '#58f898', '#b8f8d8', '#004058', '#008888', '#00e8d8', '#00fcfc'],
  },
  mastersystem: {
    title: 'Sega Master System',
    short: 'Sega MS',
    colors: ['#000000', '#000055', '#0000aa', '#0000ff', '#0055ff', '#00aaff', '#00ffff', '#00ffaa',
             '#00aaaa', '#0055aa', '#005555', '#005500', '#00aa00', '#00aa55', '#00ff55', '#00ff00',
             '#55ff00', '#55ff55', '#55aa55', '#55aa00', '#555500', '#555555', '#5555aa', '#55aaaa',
             '#55ffaa', '#55ffff', '#55aaff', '#5555ff', '#5500ff', '#5500aa', '#550055', '#550000',
             '#aa0000', '#aa0055', '#aa00aa', '#aa00ff', '#aa55ff', '#aaaaff', '#aaffff', '#aaffaa',
             '#aaaaaa', '#aa55aa', '#aa5555', '#aa5500', '#aaaa00', '#aaaa55', '#aaff55', '#aaff00',
             '#ffff00', '#ffff55', '#ffaa55', '#ffaa00', '#ff5500', '#ff5555', '#ff55aa', '#ffaaaa',
             '#ffffaa', '#ffffff', '#ffaaff', '#ff55ff', '#ff00ff', '#ff00aa', '#ff0055', '#ff0000'],
  },
  atari2600: {
    title: 'Atari 2600',
    short: '2600',
    colors: ['#000000', '#404040', '#6c6c6c', '#909090', '#b0b0b0', '#c8c8c8', '#dcdcdc', '#ececec',
             '#444400', '#646410', '#848424', '#a0a034', '#b8b840', '#d0d050', '#e8e85c', '#fcfc68',
             '#702800', '#844414', '#985c28', '#ac783c', '#bc8c4c', '#cca05c', '#dcb468', '#e8cc7b',
             '#841800', '#983418', '#ac5030', '#c06848', '#d0805c', '#e09470', '#eca880', '#fcbc94',
             '#880000', '#9c2020', '#b03c3c', '#c05858', '#d07070', '#e08888', '#eca0a0', '#fcb4b4',
             '#78005c', '#8c2074', '#a03c88', '#b0589c', '#c070b0', '#d084c0', '#dc9cd0', '#ecb0e0',
             '#480078', '#602090', '#783ca4', '#8c58b8', '#a070cc', '#b484dc', '#c49cec', '#d4b0fc',
             '#140084', '#302098', '#4c3cac', '#6858c0', '#7c70d0', '#9488e0', '#a8a0ec', '#bcb4fc',
             '#000088', '#1c209c', '#3840b0', '#505cc0', '#6874d0', '#7c8ce0', '#90a4ec', '#a4b8fc',
             '#00187c', '#1c3890', '#3854a8', '#5070bc', '#6888cc', '#7c9cdc', '#90b4ec', '#a4c8fc',
             '#002c5c', '#1c4c78', '#386890', '#5084ac', '#689cc0', '#7cb4d4', '#90cce8', '#a4e0fc',
             '#00402c', '#1c5c48', '#387c64', '#509c80', '#68b494', '#7cd0ac', '#90e4c0', '#a4fcd4',
             '#003c00', '#205c20', '#407c40', '#5c9c5c', '#74b474', '#8cd08c', '#a4e4a4', '#b8fcb8',
             '#143800', '#345c1c', '#507c38', '#6c9850', '#84b468', '#9ccc7c', '#b4e490', '#c8fca4',
             '#2c3000', '#4c501c', '#687034', '#848c4c', '#9ca864', '#b4c078', '#ccd488', '#e0ec9c',
             '#442800', '#644818', '#846830', '#a08444', '#b89c58', '#d0b46c', '#e8cc7c', '#fce08c'],
  },
};