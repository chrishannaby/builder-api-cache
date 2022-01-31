const { builder } = require("@netlify/functions");

const pathPrefix = /^\/\.netlify\/functions\/quote-api\//;

function arrayToURLSearchParams(paramsArray) {
  const paramsObj = paramsArray.reduce(
    (result, currentValue, index, initialArray) => {
      if (index % 2 === 0) {
        result[initialArray[index]] = initialArray[index + 1];
      }
      return result;
    },
    {}
  );
  return new URLSearchParams(paramsObj);
}

function transformPathToQuery(rawUrl) {
  const rawPath = new URL(rawUrl).pathname;
  const params = rawPath
    .replace(pathPrefix, "") // remove the function path prefix
    .replace(/\/$/, "") // remove trailing slash if present
    .split("/");
  if (params.length % 2 !== 0) {
    throw new Error(
      `Params passed must be in pairs. Recevied: ${params.join(",")}`
    );
  }
  return arrayToURLSearchParams(params);
}

async function handler(event) {
  try {
    const params = transformPathToQuery(event.rawUrl);
    return {
      body: params.toString(),
      statusCode: 200,
      ttl: 60,
    };
  } catch (error) {
    return {
      body: error.message,
      statusCode: 400,
    };
  }
}

exports.handler = builder(handler);
