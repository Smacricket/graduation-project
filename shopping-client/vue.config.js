module.exports = {
  devServer: {
    open: true,
    host: "localhost",
    port: 8082,
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        target: "http://localhost:8888/",
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
    // 云服务器接口
    // proxy: {
    //   "/api": {
    //     target: "http://114.116.245.197:8082/",
    //     ws: true,
    //     changOrigin: true,
    //     pathRewrite: {
    //       "^/api": ""
    //     }
    //   }
    // }
  }
};
