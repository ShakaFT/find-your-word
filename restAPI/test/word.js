const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { MAXIMUM_WORD_LENGTH, MINIMUM_WORD_LENGTH } = require("../constants")
const { test_bad_request, test_unauthorized } = require('./utils')

chai.use(chaiHttp)
const { assert, expect } = chai

const apiKey = process.env.API_KEY


describe('-----Test word with no API Key-----\n', () => {
    it('GET /word/daily => No API Key\n', (done) => {
        chai.request(app)
            .get('/word/daily')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('GET /word/exists => No API Key\n', (done) => {
        chai.request(app)
            .get('/word/exists')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('GET /word/random => No API Key\n', (done) => {
        chai.request(app)
            .get('/word/random')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })
})

describe('-----Test word with bad parameters-----\n', () => {
    it('GET /word/daily => Bad timestamp\n', (done) => {
        chai.request(app)
            .get('/word/daily?daily_timestamp=bad_timestamp')
            .set("api-key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('GET /word/exists => Bad lang\n', (done) => {
        chai.request(app)
            .get('/word/exists?lang=bad_lang&word=HELLO')
            .set("api-key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('GET /word/exists => Bad word\n', (done) => {
        chai.request(app)
            .get('/word/exists?lang=fr&word=0')
            .set("api-key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('GET /word/random => Bad lang\n', (done) => {
        chai.request(app)
            .get('/word/random?lang=bad_lang&length=5')
            .set("api-key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('GET /word/random => Bad length\n', (done) => {
        chai.request(app)
            .get('/word/random?lang=fr&length=bad_length')
            .set("api-key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it(`GET /word/random => length < ${MINIMUM_WORD_LENGTH}\n`, (done) => {
        chai.request(app)
            .get(`/word/random?lang=fr&length=${MINIMUM_WORD_LENGTH - 1}`)
            .set("api-key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it(`GET /word/random => length > ${MAXIMUM_WORD_LENGTH}\n`, (done) => {
        chai.request(app)
            .get(`/word/random?lang=fr&length=${MAXIMUM_WORD_LENGTH + 1}`)
            .set("api-key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })
})

describe('-----Test to handle word-----\n', () => {
    it('GET /word/daily => Fail with unexisting daily_timestamp\n', (done) => {
        chai.request(app)
            .get('/word/daily?daily_timestamp=1683756000')
            .set("api-key", apiKey)
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.deepStrictEqual(res.body.daily_word, {})
                done()
            })
    })

    it('GET /word/daily => Get daily word\n', (done) => {
        chai.request(app)
            .get('/word/daily?daily_timestamp=1683756000000')
            .set("api-key", apiKey)
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(typeof res.body.daily_word.en, "string")
                done()
            })
    })

    it('GET /word/exists => Fail with unexisting word\n', (done) => {
        chai.request(app)
            .get('/word/exists?lang=en&word=HELLP')
            .set("api-key", apiKey)
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.exists, false)
                done()
            })
    })

    it('GET /word/exists => Check existing word\n', (done) => {
        chai.request(app)
            .get('/word/exists?lang=en&word=HELLO')
            .set("api-key", apiKey)
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.exists, true)
                done()
            })
    })

    it('GET /word/random => Get random word\n', (done) => {
        chai.request(app)
            .get(`/word/random?lang=en&length=${MINIMUM_WORD_LENGTH}`)
            .set("api-key", apiKey)
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(typeof res.body.word, "string")
                done()
            })
    })
})
