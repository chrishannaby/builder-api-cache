const { builder } = require("@netlify/functions");
const fetch = require("node-fetch");

const pathPrefix = /^.+\/quote-api\/?/;
const { API_PATH } = process.env;

function transformPathToQuery(rawUrl) {
  const rawPath = new URL(rawUrl).pathname;
  const rawParams = rawPath
    .replace(pathPrefix, "") // remove the function path prefix
    .replace(/\/$/, ""); // remove trailing slash if present
  console.log(rawParams);
  return Buffer.from(rawParams, "base64").toString(); // decode the base64 encoded search params to ASCII
}

async function handler(event) {
  console.log(event.rawUrl);
  try {
    const params = transformPathToQuery(event.rawUrl);
    const apiUrl = API_PATH + params;
    console.log(apiUrl);
    const apiResponse = await fetch(apiUrl);
    const apiResponseBody = await apiResponse.text();
    return {
      body: apiResponseBody,
      statusCode: 200,
      ttl: 60,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      body: error.message,
      statusCode: 400,
    };
  }
}

exports.handler = builder(handler);
