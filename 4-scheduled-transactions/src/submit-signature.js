const { Transaction, Client } = require('@hashgraph/sdk');
require('dotenv').config();

const { accounts } = require('./utils/load-accounts');

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accounts.account1Id, accounts.account1PrivateKey);

async function main() {
  try {
    const serializedScheduleTransaction =
      process.env.SERIALIZED_SCHEDULE_TRANSACTION;

    // Deserialize the transaction
    const transaction = Transaction.fromBytes(
      Buffer.from(serializedScheduleTransaction, 'base64')
    );
    await transaction.sign(accounts.account1PrivateKey);

    // Sign with the client operator key to pay for the transaction and submit to a Hedera network
    const txResponse = await transaction.execute(client);
    // Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);
    // Get the transaction status
    const transactionStatus = receipt.status;

    console.log(`The transaction consensus status is ${transactionStatus}`);
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

main();
