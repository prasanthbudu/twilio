const express = require('express');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const router = express.Router();

router.post('/', (req, res) => {
    const response = new VoiceResponse();
    response.say(`You have a new ticket. Subject: ${ticketData.subject}, Priority: ${ticketData.priority}.`);
    const gather = response.gather({
        action: `${process.env.APP_URL}/handle_response`,
        numDigits: 1,
        timeout: 10
    });
    gather.say('Press 1 to acknowledge or 2 to decline.');
    response.append(gather);
    response.say('No response received. Goodbye!');
    res.type('text/xml');
    res.send(response.toString());
});

module.exports = router;
