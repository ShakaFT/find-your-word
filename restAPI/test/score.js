const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { test_bad_request, test_unauthorized } = require('./utils')

chai.use(chaiHttp)
const { assert, expect } = chai

const apiKey = process.env.API_KEY
const timestamp = 1234


describe('-----Test score with no API Key-----\n', () => {
    it('GET /score => No API Key\n', (done) => {
        chai.request(app)
            .get('/score')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('POST /score => No API Key\n', (done) => {
        chai.request(app)
            .post('/score')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })
})

describe('-----Test score with bad parameters-----\n', () => {
    it('GET /score => Bad timestamp\n', (done) => {
        chai.request(app)
            .get('/score?timestamp=bad_timestamp&username=unittest')
            .set("api-key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('POST /score => Bad timestamp\n', (done) => {
        chai.request(app)
            .post('/score')
            .set("api-key", apiKey)
            .send({ timestamp: "bad_timestamp", tries: 1, username: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('POST /score => Bad tries\n', (done) => {
        chai.request(app)
            .post('/score')
            .set("api-key", apiKey)
            .send({ timestamp: timestamp, tries: "bad_tries", username: "unittest" })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('POST /score => Bad username\n', (done) => {
        chai.request(app)
            .post('/score')
            .set("api-key", apiKey)
            .send({ timestamp: timestamp, tries: 1, username: 0 })
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })
})

describe('-----Test to handle score-----\n', () => {
    it('GET /score => Get score\n', (done) => {
        chai.request(app)
            .get(`/score?timestamp=${timestamp}&username=unittest`)
            .set("api-key", apiKey)
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.deepEqual(res.body.best_scores, [])
                assert.equal(res.body.personal_score, null)
                done()
            })
    })
})
