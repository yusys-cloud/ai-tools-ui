module.exports = {
  publicPath: '',
  // js文件最小化处理
  chainWebpack: config => {
    config.optimization.minimize(true);
  },
  devServer: {
    port: 4201,
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        ws: true
      }
    },
    disableHostCheck: true
  }
};
