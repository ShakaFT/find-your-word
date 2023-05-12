const { expect } = require('chai')

// Functions used by tests
function test_bad_request(response) {
    expect(response).to.have.status(400)
    expect(response.body).to.have.property('error')
}
function test_unauthorized(response) {
    expect(response).to.have.status(401)
    expect(response.body).to.have.property('error')
}

module.exports = { test_bad_request, test_unauthorized, }
