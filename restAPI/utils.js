function bad_request(res, error) { res.status(400).send({ error: error.toString() }) }

function internal_server(res, error) { res.status(500).send({ error: error.toString() }) }

module.exports = { bad_request, internal_server }
