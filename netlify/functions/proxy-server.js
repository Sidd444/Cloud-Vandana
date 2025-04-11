const https = require('https');

exports.handler = async function (event) {
  const path = event.path.replace('/.netlify/functions/proxy-server', '');
  const url = `https://login.salesforce.com${path}`;

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: event.httpMethod,
      headers: event.headers,
    }, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: {
            ...res.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      });
    });

    req.on('error', reject);
    if (event.body) {
      req.write(event.body);
    }
    req.end();
  });
};
