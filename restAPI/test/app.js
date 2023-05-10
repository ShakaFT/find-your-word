const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const database = require('mongoose')

chai.use(chaiHttp)
const { expect } = chai

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
})

