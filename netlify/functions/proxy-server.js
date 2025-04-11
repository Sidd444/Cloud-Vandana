const { createProxyMiddleware } = require('http-proxy-middleware');

exports.handler = async (event, context) => {
  const proxy = createProxyMiddleware({
    target: 'https://login.salesforce.com', 
    changeOrigin: true,
    secure: false,
    onProxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    },
  });

  return new Promise((resolve, reject) => {
    proxy(event, context, (err) => {
      if (err) reject(err);
      resolve({
        statusCode: 200,
        body: 'Proxy request successful',
      });
    });
  });
};