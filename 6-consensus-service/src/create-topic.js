const { TopicCreateTransaction, Client } = require('@hashgraph/sdk');
require('dotenv').config();

const { accounts } = require('./utils/load-accounts');

// Create our connection to the Hedera network
const client = Client.forTestnet();

client.setOperator(accounts.account1Id, accounts.account1PrivateKey);

async function main() {
  // Create a new topic
  const txResponse = await new TopicCreateTransaction().execute(client);

  // Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  // Grab the new topic ID from the receipt
  const { topicId } = receipt;

  // Log the topic ID
  console.log(`Your topic ID is: ${topicId}`);

  // Wait 5 seconds between consensus topic creation and subscription
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 5000));

  process.exit();
}

main();
