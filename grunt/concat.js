function sources(target) {
  return [
    'build/' + target + '/js/bower_components/index.js',
    'build/' + target + '/js/bower_components/lodash.js',
    'build/' + target + '/js/bower_components/mousetrap.js',
    'build/' + target + '/js/bower_components/react-with-addons.js',
    'build/' + target + '/js/bower_components/react-dom.js',
    'build/' + target + '/js/bower_components/fluxxor.js',

    'build/' + target + '/js/lib/**/*.js',

    'build/' + target + '/js/strict.js',
    'build/' + target + '/js/react_mixins/**/*.js',
    'build/' + target + '/js/react_components/**/*.js',

    'build/' + target + '/js/classes/StateHistory.js',
    'build/' + target + '/js/classes/Point.js',
    'build/' + target + '/js/classes/Pixel.js',

    'build/' + target + '/js/classes/Hotkeys.js',

    'build/' + target + '/js/classes/StoreUtils.js',
    'build/' + target + '/js/classes/PlatformUtils.js',

    'build/' + target + '/js/flux/**/*.js',

    'build/' + target + '/js/index.js',

    'build/' + target + '/js/menu.js',
  ];
}

module.exports = {
  options: {
    separator: "\n", //add a new line after each file
    banner: "", //added before everything
    footer: "" //added after everything
  },
  browser: {
    src: sources('browser'),
    // the location of the resulting JS file
    dest: 'build/browser/<%= package.name %>.js'
  },
  desktopMac: {
    src: sources('desktop/mac'),
    // the location of the resulting JS file
    dest: 'build/desktop/mac/<%= package.name %>.js'
  },
  desktopWindows: {
    src: sources('desktop/windows'),
    // the location of the resulting JS file
    dest: 'build/desktop/windows/<%= package.name %>.js'
  },
  tablet: {
    src: sources('tablet'),
    // the location of the resulting JS file
    dest: 'build/tablet/<%= package.name %>.js'
  }
};
