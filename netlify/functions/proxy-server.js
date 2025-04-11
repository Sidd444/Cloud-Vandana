const https = require('https');

exports.handler = async function (event) {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  const path = event.path.replace('/.netlify/functions/proxy-server', '');
  const url = `https://login.salesforce.com${path}`;

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        host: 'login.salesforce.com',
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: body,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': res.headers['content-type'] || 'application/json',
          },
        });
      });
    });

    req.on('error', (error) => {
      reject({
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    });

    if (event.body) {
      req.write(event.body);
    }

    req.end();
  });
};
