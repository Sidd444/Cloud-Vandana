const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-target-url",
      },
      body: "",
    };
  }

  const targetUrl = event.headers["x-target-url"];
  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing x-target-url header" }),
    };
  }

  const path = event.path.replace("/.netlify/functions/proxy-server", "");
  const url = `${targetUrl}${path}`;

  const headers = { ...event.headers };
  delete headers.host;
  delete headers["x-target-url"];

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
              "Access-Control-Allow-Headers": "Content-Type, Authorization, x-target-url",
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
