const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy configuration
app.use(
  '/services',
  createProxyMiddleware({
    target: 'https://login.salesforce.com', // Default to production
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      // Add custom headers if needed
      proxyReq.setHeader('Access-Control-Allow-Origin', '*');
    },
  })
);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
