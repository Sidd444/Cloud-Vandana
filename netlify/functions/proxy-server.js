const { createProxyMiddleware } = require('http-proxy-middleware');

exports.handler = async (event, context) => {
  const proxy = createProxyMiddleware({
    target: 'https://login.salesforce.com', // Salesforce API endpoint
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api': '', // Remove the `/api` prefix before forwarding to Salesforce
    },
    onProxyRes: (proxyRes) => {
      // Add CORS headers to the response
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    },
    onError: (err, req, res) => {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Proxy error: Unable to process the request.');
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
