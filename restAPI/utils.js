const Discord = require('discord.js');
const { expect } = require('chai')

// Functions used by REST API
function bad_request(res, error) { res.status(400).send({ error: error.toString() }) }
function unauthorized(res) { res.status(401).send({ error: "You are not authorized to use this endpoint" }) }
function internal_server(res, error) { res.status(500).send({ error: error.toString() }) }

// Functions used by tests
function test_bad_request(response) {
    expect(response).to.have.status(400)
    expect(response.body).to.have.property('error')
}
function test_unauthorized(response) {
    expect(response).to.have.status(401)
    expect(response.body).to.have.property('error')
}

// Utils functions
function discordMessage(method, endpoint, statusCode) {
    const webhook = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/1106192666603036782/wsp-XN_EQStiWuHXLBngjnJiYhQMDaaf3lAVFWX1xPir8fvJw4wybLqIbsLrA4Me_FzU' });
    const embed = new Discord.EmbedBuilder()
        .setTitle('Find Your Word - REST API Deployment')
        .setDescription(`Unexpected error : **${method} ${statusCode} ${endpoint}**... [Click here](https://dashboard.render.com/web/srv-ch95d16kobicv5rntc80/logs) to see error details.`)
        .setColor('#FF0000')
        .setTimestamp()
    webhook.send({ embeds: [embed] })
}

function todayTimestamp() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today.getTime()
}

module.exports = { bad_request, discordMessage, internal_server, test_bad_request, test_unauthorized, todayTimestamp, unauthorized }
