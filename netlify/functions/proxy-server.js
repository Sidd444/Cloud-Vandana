const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: "",
    };
  }

  const targetBase = "https://login.salesforce.com";
  const path = event.rawUrl.split("/.netlify/functions/proxy-server")[1];
  const url = targetBase + path;

  const headers = { ...event.headers };
  delete headers.host;

  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: event.httpMethod,
        headers,
      },
      (res) => {
        let body = "";

        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          const sanitizedHeaders = {};
          for (const key in res.headers) {
            if (Array.isArray(res.headers[key])) {
              sanitizedHeaders[key] = res.headers[key].join(",");
            } else {
              sanitizedHeaders[key] = res.headers[key];
            }
          }

          resolve({
            statusCode: res.statusCode || 200,
            headers: {
              ...sanitizedHeaders,
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            body,
          });
        });
      }
    );

    req.on("error", (err) => {
      reject({
        statusCode: 500,
        body: JSON.stringify({ message: err.message }),
      });
    });

    if (event.body) {
      req.write(event.body);
    }

    req.end();
  });
};
