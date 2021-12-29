const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// Imports the Google Cloud Some API library
const {SessionsClient} = require('@google-cloud/dialogflow-cx');

const projectId = process.env.PROJECT_ID;
const location = process.env.LOCATION;
const agentId = process.env.AGENT_ID;
const languageCode = 'en';

const client = new SessionsClient({
    apiEndpoint: 'us-west1-dialogflow.googleapis.com',
    keyFilename: './mmbhof-b5ff5df0dd49.json'
});


const detectIntent = async (queryText) => {
    const sessionId = Math.random().toString(36).substring(7);
    const sessionPath = client.projectLocationAgentSessionPath(
        projectId,
        location,
        agentId,
        sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
        text: {
            text: queryText,
        },
        languageCode,
        },
    };
    const [response] = await client.detectIntent(request);
    const result = response.queryResult.responseMessages[0].text;
    return {
        response: result.text
    };
}

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/dialogflow', async (req, res) => {
    let queryText = req.body.queryText;
    let responseData = await detectIntent(queryText);
    res.send(responseData.response);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
