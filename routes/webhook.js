const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

let callAttempts = 0;
const maxAttempts = 3;
let ticketData = {};

router.post('/', (req, res) => {
    callAttempts = 0;
    ticketData = {
        id: req.body.ticketId,
        subject: req.body.ticketSubject,
        priority: req.body.ticketPriority
    };
    callPrimaryNumber();
    res.sendStatus(200);
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
        from: process.env.TWILIO_NUMBER
    }).then((call) => {
        console.log('Secondary call initiated:', call.sid);
    }).catch((err) => {
        console.error('Error initiating secondary call:', err);
    });
}

module.exports = router;
