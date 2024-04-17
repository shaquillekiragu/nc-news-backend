const endpointsList = require("../endpoints.json");

function getApi(request, response, next) {
  return response.status(200).send({ endpoints: endpointsList }).catch(next);
}

module.exports = getApi;
