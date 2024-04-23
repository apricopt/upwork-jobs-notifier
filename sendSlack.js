const axios = require('axios');
require('dotenv').config();

const SLACK_WEBHOOK_URL = process.env.SLACKHOOK;

async function sendMessageToSlack(message) {
    try {
        const response = await axios.post(SLACK_WEBHOOK_URL, {
            text: message
        });
        console.log('Message sent to Slack');
        console.log(response.data);
    } catch (error) {
        console.error('Error sending message to Slack:', error);
    }
}

module.exports = {sendMessageToSlack}

