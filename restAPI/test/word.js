const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { test_bad_request, test_unauthorized } = require('../utils')
const { response } = require('../index')

chai.use(chaiHttp)
const { assert, expect } = chai

const apiKey = process.env.API_KEY


describe('Test word with no API Key', () => {
    it('GET /word/exists => No API Key', (done) => {
        chai.request(app)
            .get('/word/exists')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('GET /word/random => No API Key', (done) => {
        chai.request(app)
            .get('/word/random')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })
})

describe('Test word with bad parameters', () => {
    it('GET /word/exists => Bad lang', (done) => {
        chai.request(app)
            .get('/word/exists?lang=bad_lang&word=HELLO')
            .set("api_key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('GET /word/exists => Bad word', (done) => {
        chai.request(app)
            .get('/word/exists?lang=fr&word=0')
            .set("api_key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('GET /word/random => Bad lang', (done) => {
        chai.request(app)
            .get('/word/random?lang=bad_lang&length=5')
            .set("api_key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('GET /word/random => Bad length', (done) => {
        chai.request(app)
            .get('/word/random?lang=fr&length=bad_length')
            .set("api_key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })

    it('GET /word/random => length < 4', (done) => {
        chai.request(app)
            .get('/word/random?lang=fr&length=3')
            .set("api_key", apiKey)
            .end((err, res) => {
                test_bad_request(res)
                done()
            })
    })
})
