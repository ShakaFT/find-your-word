const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const database = require('mongoose')
const { test_unauthorized } = require('./utils')

chai.use(chaiHttp)
const { assert, expect } = chai

const apiKey = process.env.API_KEY


describe('------Test app-----\n', () => {
    it('GET /\n', (done) => {
        console.log("\nConnection to database...\n")
        database.connect(process.env.DB_CONNECTION)
            .then(() => {
                chai.request(app)
                    .get('/')
                    .end((err, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.empty
                        done()
                    })
            })
            .catch(err => {
                console.error(`Error during database connection process : ${err}`)
                process.exit()
            })
    })

    it('GET /start => No API Key\n', (done) => {
        chai.request(app)
            .get('/start')
            .end((err, res) => {
                test_unauthorized(res)
                done()
            })
    })

    it('GET /start => Get data when app is launched\n', (done) => {
        chai.request(app)
            .get('/start')
            .set("api-key", apiKey)
            .end((err, res) => {
                expect(res).to.have.status(200)
                assert.equal(res.body.allowed_langs instanceof Array, true)
                assert.equal(typeof res.body.maximum_word_length, "number")
                assert.equal(typeof res.body.minimum_word_length, "number")
                done()
            })
    })
})


