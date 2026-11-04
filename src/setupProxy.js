// Solo en desarrollo (npm run dev): manda los pedidos /api al servidor Node del puerto 3001.
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function proxy(app) {
  app.use('/api', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
};
