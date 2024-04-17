const endpointsList = require("../endpoints.json");

function getApi(request, response) {
  return response.status(200).send({ endpoints: endpointsList });
}

module.exports = getApi;
