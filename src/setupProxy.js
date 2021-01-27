const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {

  app.use(
    '/jawhar',
    createProxyMiddleware({
      target: 'http://host.docker.internal:5050',
      changeOrigin: true,
      pathRewrite: {
        "^/jawhar": "",
      }
    })
  );
};
