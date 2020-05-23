// Imports the dialogflow wrapper.
const dialogflow = require('dialogflow');

// Creates uuid, this makes sessionIds.
const uuid = require('uuid');

// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');

// Define the Google Project ID
const projectId = '[PROJECT_ID]'
// Define the Google Project keyfile, follow instructions in wiki on how to get one.
const keyFilename = './keyfile.json'

// Instantiates a client.
// If you don't specify credentials when constructing the client, the client library will look for credentials in the environment.
const storage = new Storage({projectId, keyFilename});

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param msg - Message class of Discord.js
 * @param {string} projectId - The project to be used.
 * @param {string} argument - The argument the user uses.
*/

exports.askDialog = async function runSample(msg,projectId,argument) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: argument,
        // The language used by the client (en)
        languageCode: 'en',
      },
    },
  };

  // Send request and log result for debug.
  const responses = await sessionClient.detectIntent(request);

  // Debugging
  //console.log('Detected intent');

  const result = responses[0].queryResult;
  // Debugging
  //console.log(`  Query: ${result.queryText}`);
  //console.log(`  Response: ${result.fulfillmentText}`);

  const response = result.fulfillmentText
  msg.reply(response)

  // More debugging
  //if (result.intent) {
    //console.log(`  Intent: ${result.intent.displayName}`);
  //} else {
    // You should have a fallback intent set up.
    //console.log(`  No intent matched.`);
  //}
}
