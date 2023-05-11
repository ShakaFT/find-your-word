const { expect } = require('chai')

// Functions used by REST API
function bad_request(res, error) { res.status(400).send({ error: error.tostring() }) }
function internal_server(res, error) { res.status(500).send({ error: error.tostring() }) }

// Functions used by tests
function test_bad_request(response) {
    expect(response).to.have.status(400)
    expect(response.body).to.have.property('error')
}
function test_unauthorized(response) {
    expect(response).to.have.status(401)
    expect(response.body).to.have.property('error')
}

function todayTimestamp() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today.getTime()
}

module.exports = { bad_request, internal_server, test_bad_request, test_unauthorized, todayTimestamp }
