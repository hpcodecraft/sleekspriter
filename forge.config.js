module.exports = {
  // packagerConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      // config: {
      //   name: "my_new_app",
      // },
    },
    {
      name: "@electron-forge/maker-zip",
    },

    {
      name: "@electron-forge/maker-dmg",
      // config: {
      //   background: "./assets/dmg-background.png",
      //   format: "ULFO",
      // },
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack/webpack.config.electron-main.js",
        renderer: {
          config: "./webpack/webpack.config.electron-renderer.js",
          entryPoints: [
            {
              html: "./src/assets/index.html",
              js: "./src/renderer.js",
              name: "main_window",
            },
          ],
        },
      },
    ],
  ],
};