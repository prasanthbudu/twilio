const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

router.post('/', (req, res) => {
    const userResponse = req.body.Digits;
    if (userResponse == '1') {
        const response = new VoiceResponse();
        response.say('Ticket acknowledged. Goodbye!');
        res.type('text/xml');
        res.send(response.toString());
    } else if (userResponse == '2' || !userResponse) {
        if (callAttempts < maxAttempts) {
            callAttempts += 1;
            setTimeout(callPrimaryNumber, 60000); // Retry after 1 minute
            const response = new VoiceResponse();
            response.say('Retrying primary number. Please wait.');
            res.type('text/xml');
            res.send(response.toString());
        } else {
            callSecondaryNumber();
            const response = new VoiceResponse();
            response.say('Forwarding to the secondary on-call person.');
            res.type('text/xml');
            res.send(response.toString());
        }
    } else {
        const response = new VoiceResponse();
        response.say('Invalid response. Goodbye!');
        res.type('text/xml');
        res.send(response.toString());
    }
});

function callPrimaryNumber() {
    client.calls.create({
        url: `${process.env.APP_URL}/primary_call`,
        to: process.env.PRIMARY_NUMBER,
        from: process.env.TWILIO_NUMBER
    }).then((call) => {
        console.log('Primary call initiated:', call.sid);
    }).catch((err) => {
        console.error('Error initiating call:', err);
    });
}

function callSecondaryNumber() {
    client.calls.create({
        url: `${process.env.APP_URL}/secondary_call`,
        to: process.env.SECONDARY_NUMBER,
