const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { test_bad_request, test_unauthorized } = require('./utils')

chai.use(chaiHttp)
const { assert, expect } = chai

const apiKey = process.env.API_KEY

let userId = "";


describe('-----Test user with no API Key-----\n', () => {
    it('POST /user => No API Key\n', (done) => {
        chai.request(app)
            .post('/user')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('POST /user/login => No API Key\n', (done) => {
        chai.request(app)
            .post('/user/login')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('DELETE /user/:id => No API Key\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('PUT /user/:id/password => No API Key\n', (done) => {
        chai.request(app)
            .put('/user/1234/password')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('PUT /user/:id/profile => No API Key\n', (done) => {
        chai.request(app)
            .put('/user/1234/profile')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })
})


describe('-----Test user with bad parameters-----\n', () => {
    it('POST /user => Bad email', (done) => {
        chai.request(app)
            .post('/user')
            .set("api-key", apiKey)
            .send({ email: 0, password: "unittest", username: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('POST /user => Bad password\n', (done) => {
        chai.request(app)
            .post('/user')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: 0, username: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('POST /user => Bad username\n', (done) => {
        chai.request(app)
            .post('/user')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: "unittest", username: 0 })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('POST /user/login => Bad email\n', (done) => {
        chai.request(app)
            .post('/user/login')
            .set("api-key", apiKey)
            .send({ email: 0, password: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('POST /user/login => Bad password\n', (done) => {
        chai.request(app)
            .post('/user/login')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: 0 })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('DELETE /user/:id => Bad id\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ password: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('DELETE /user/:id => Bad password\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ password: 0 })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('PUT /user/:id/password => Bad id\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ old_password: "unittest", new_password: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('PUT /user/:id/password => Bad old_password\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ old_password: 0, new_password: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('PUT /user/:id/password => Bad new_password\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ old_password: "unittest", new_password: 0 })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('PUT /user/:id/profile => Bad id\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: "unittest", username: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('PUT /user/:id/profile => Bad email\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ email: 0, password: "unittest", username: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('PUT /user/:id/profile => Bad password\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: 0, username: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('PUT /user/:id/profile => Bad username\n', (done) => {
        chai.request(app)
            .delete('/user/1234')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: "unittest", username: 0 })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })
})

describe('-----Test to handle user-----\n', () => {
    it('POST /user => Create user', (done) => {
        chai.request(app)
            .post('/user')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: "unittest", username: "unittest" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.notEqual(res.body.user_id, undefined)
                assert.equal(res.body.email_exists, false)
                assert.equal(res.body.username_exists, false)
                userId = res.body.user_id
                done()
            })
    })

    it('POST /user => Existing email and username\n', (done) => {
        chai.request(app)
            .post('/user')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: "unittest", username: "unittest" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.email_exists, true)
                assert.equal(res.body.username_exists, true)
                done()
            })
    })

    it('POST /user/login => Login user\n', (done) => {
        chai.request(app)
            .post('/user/login')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: "unittest" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.login, true)
                assert.equal(res.body.user.id, userId)
                assert.equal(res.body.user.email, "unittest@gmail.com")
                assert.equal(res.body.user.username, "unittest")
                done()
            })
    })

    it('POST /user/login => Fail login with bad email\n', (done) => {
        chai.request(app)
            .post('/user/login')
            .set("api-key", apiKey)
            .send({ email: "bad_email@gmail.com", password: "unittest" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.login, false)
                done()
            })
    })

    it('POST /user/login => Fail login with bad password\n', (done) => {
        chai.request(app)
            .post('/user/login')
            .set("api-key", apiKey)
            .send({ email: "unittest@gmail.com", password: "bad_password" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.login, false)
                done()
            })
    })

    it('PUT /user/:id/profile => Update user profile\n', (done) => {
        chai.request(app)
            .put(`/user/${userId}/profile`)
            .set("api-key", apiKey)
            .send({ email: "unittest2@gmail.com", password: "unittest", username: "unittest2" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.success, true)
                done()
            })
    })

    it('PUT /user/:id/profile => Fail update user profile with bad password\n', (done) => {
        chai.request(app)
            .put(`/user/${userId}/profile`)
            .set("api-key", apiKey)
            .send({ email: "unittest2@gmail.com", password: "bad_password", username: "unittest2" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.success, false)
                done()
            })
    })

    it('PUT /user/:id/password => Update user password\n', (done) => {
        chai.request(app)
            .put(`/user/${userId}/password`)
            .set("api-key", apiKey)
            .send({ old_password: "unittest", new_password: "unittest2" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.success, true)
                done()
            })
    })

    it('PUT /user/:id/password => Fail update password with bad old_password\n', (done) => {
        chai.request(app)
            .put(`/user/${userId}/password`)
            .set("api-key", apiKey)
            .send({ old_password: "bad_password", new_password: "unittest2" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.success, false)
                done()
            })
    })

    it('POST /user/login => Login user\n', (done) => {
        chai.request(app)
            .post('/user/login')
            .set("api-key", apiKey)
            .send({ email: "unittest2@gmail.com", password: "unittest2" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.login, true)
                assert.equal(res.body.user.id, userId)
                assert.equal(res.body.user.email, "unittest2@gmail.com")
                assert.equal(res.body.user.username, "unittest2")
                done()
            })
    })

    it('DELETE /user/:id => Fail to delete user with bad password\n', (done) => {
        chai.request(app)
            .delete(`/user/${userId}`)
            .set("api-key", apiKey)
            .send({ password: "bad_password" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.success, false)
                done()
            })
    })

    it('DELETE /user/:id => Delete user\n', (done) => {
        chai.request(app)
            .delete(`/user/${userId}`)
            .set("api-key", apiKey)
            .send({ password: "unittest2" })
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.success, true)
                done()
            })
    })
})
