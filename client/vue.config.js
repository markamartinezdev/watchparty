module.exports = {
    devServer: {
      proxy: process.env.VUE_APP_BASEURL,
      port: 9003
    }
  }
  