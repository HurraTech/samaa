const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {

  app.use(
    '/jawhar',
    createProxyMiddleware({
      target: 'http://172.18.0.1:5050',
      changeOrigin: true,
      pathRewrite: {
        "^/jawhar": "",
      }
    })
  );
};
