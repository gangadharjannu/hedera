const {
  TopicMessageSubmitTransaction,
  Client,
  TopicId,
} = require('@hashgraph/sdk');
require('dotenv').config();
const { accounts } = require('./utils/load-accounts');

const topicId = TopicId.fromString(process.env.TOPIC_ID);

// Create our connection to the Hedera network
const client = Client.forTestnet();

client.setOperator(accounts.account1Id, accounts.account1PrivateKey);

async function main() {
  const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  // Send one message
  const sendResponse = await new TopicMessageSubmitTransaction({
    topicId,
    message,
  }).execute(client);

  // Get the receipt of the transaction
  const getReceipt = await sendResponse.getReceipt(client);

  // Get the status of the transaction
  const transactionStatus = getReceipt.status;

  console.log(`The message transaction status: ${transactionStatus}`);

  process.exit();
}

main();
