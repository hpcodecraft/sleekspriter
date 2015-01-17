// compile JSX sources
module.exports = {
  browser: {
    files: [{
      expand: true,
      src: 'src/common/jsx/**/*.jsx',
      flatten: true,
      dest: 'build/browser/js/react_components',
      ext: '.js'
    },
    {
      expand: true,
      src: 'src/browser/**/*.jsx',
      flatten: true,
      dest: 'build/browser/js/react_components',
      ext: '.js'
    }]
  },

  desktopMac: {
    files: [{
      expand: true,
      src: 'src/common/jsx/**/*.jsx',
      flatten: true,
      dest: 'build/desktop/mac/js/react_components',
      ext: '.js'
    },
    {
      expand: true,
      src: 'src/desktop/mac/**/*.jsx',
      flatten: true,
      dest: 'build/desktop/mac/js/react_components',
      ext: '.js'
    }]
  },

  desktopWindows: {
    files: [{
      expand: true,
      src: 'src/common/jsx/**/*.jsx',
      flatten: true,
      dest: 'build/desktop/windows/js/react_components',
      ext: '.js'
    },
    {
      expand: true,
      src: 'src/desktop/windows/**/*.jsx',
      flatten: true,
      dest: 'build/desktop/windows/js/react_components',
      ext: '.js'
    }]
  },
};