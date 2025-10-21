const axios = require('axios')
const slackWebhookUrl = 'url'
async function notifyOnlyIntrested(email){
    if (email.label==='Intrested'){
        const slackMsg={
            text:`New Intrested Email from ${email.from} and subject:${email.subject}`
        }
        await axios.post(slackWebhookUrl,slackMsg)
    }
}