const { Client } = require('@elastic/elasticsearch')

const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE,
    requestTimeout: 10000,
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
    },
})

module.exports = esClient
