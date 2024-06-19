function healthcheck(request, response) {
  return response.status(200).send({ msg: "connection is healthy" });
}
module.exports = healthcheck;
