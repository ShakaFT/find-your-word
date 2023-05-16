const Discord = require('discord.js');

// Functions used by REST API
function bad_request(res, error) { res.status(400).send({ error: error.toString() }) }
function unauthorized(res) { res.status(401).send({ error: "You are not authorized to use this endpoint" }) }
function internal_server(res, error) { res.status(500).send({ error: error.toString() }) }

// Utils functions
function discordMessage(method, endpoint, statusCode) {
    const webhook = new Discord.WebhookClient({ url: process.env.MONITORING_DISCORD_WEBHOOK });
    const embed = new Discord.EmbedBuilder()
        .setTitle('Find Your Word - REST API Deployment')
        .setDescription(`Unexpected error : **${method} ${statusCode} ${endpoint}**... [Click here](https://console.cloud.google.com/logs/query?project=${process.env.PROJECT_ID}) to see error details.`)
        .setColor('#FF0000')
        .setTimestamp()
    webhook.send({ embeds: [embed] })
}

function todayTimestamp() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today.getTime()
}

module.exports = { bad_request, discordMessage, internal_server, todayTimestamp, unauthorized }
