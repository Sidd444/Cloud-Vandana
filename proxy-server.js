const { createProxyMiddleware } = require('http-proxy-middleware');

exports.handler = async (event, context) => {
  const proxy = createProxyMiddleware({
    target: 'https://login.salesforce.com', 
    changeOrigin: true,
    secure: false,
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
