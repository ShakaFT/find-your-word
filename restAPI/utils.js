function bad_request(res, error) { res.status(400).send({ error: error }) }

function internal_server(res, error) { res.status(500).send({ error: error }) }

module.exports = { bad_request, internal_server }
