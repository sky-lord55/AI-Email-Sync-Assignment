const { Client } = require('@elastic/elasticsearch');
const esClient = new Client({ node: 'http://localhost:9200' });

async function indexEmail(email, account, folder) {
  await esClient.index({
    index: 'emails',
    id: email.messageId,
    body: {
      subject: email.subject,
      from: email.from.text,
      to: email.to.text,
      date: email.date,
      text: email.text,
      folder,
      account,
      label: email.label || 'Uncategorized'
    }
  })
}

async function searchEmails(query, filters) {
  const body = {
    query: {
      bool: {
        must: [{ match: { text: query } }],
        filter: [
          { term: { folder: filters.folder || '' } },
          { term: { account: filters.account || '' } }
        ]
      }
    }
  }
  const result = await esClient.search({ index: 'emails', body })
  return result.hits.hits.map((hit) => hit._source)
}

module.exports = { indexEmail, searchEmails };
