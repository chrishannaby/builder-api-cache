const { builder } = require("@netlify/functions");

function transformPathToQuery(path) {}

async function handler(event) {
  console.log(event);
  return {
    body: event.path,
    statusCode: 200,
    ttl: 60,
  };
}

exports.handler = builder(handler);
