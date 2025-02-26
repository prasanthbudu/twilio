const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const webhookRouter = require('./routes/webhook');
const primaryCallRouter = require('./routes/primary_call');
const secondaryCallRouter = require('./routes/secondary_call');
const handleResponseRouter = require('./routes/handle_response');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/webhook', webhookRouter);
app.use('/primary_call', primaryCallRouter);
app.use('/secondary_call', secondaryCallRouter);
app.use('/handle_response', handleResponseRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
