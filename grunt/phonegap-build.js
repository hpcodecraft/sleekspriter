module.exports = {
  build: {
    options: {
      archive: 'dist/tablet/<%= package.name %>-<%= package.version %>.zip',
      appId: '1479575',
      user: {
        email: 'thesquidpeople@gmail.com',
        password: 'WWW3Badobe'
      },
      /*
      keys: {
        ios: {
          password: 'secret'
        }
      },
      */
      download: {
        //ios: 'release/<%= package.version %>/-<%= package.version %>.ipa',
        android: 'release/<%= package.version %>/<%= package.name %>-<%= package.version %>.apk'
      }
    }
  }
};