const {
  TransferTransaction,
  Client,
  ScheduleCreateTransaction,
  Hbar,
} = require('@hashgraph/sdk');
require('dotenv').config();

const { accounts } = require('./utils/load-accounts');

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accounts.account1Id, accounts.account1PrivateKey);

async function main() {
  // Create a transaction to schedule
  const transaction = new TransferTransaction()
    .addHbarTransfer(accounts.account1Id, new Hbar(-10))
    .addHbarTransfer(accounts.account2Id, new Hbar(10));

  // Schedule a transaction
  const scheduleTransaction = await new ScheduleCreateTransaction()
    .setScheduledTransaction(transaction)
    .setScheduleMemo('Scheduling TX from account 1 to account 2')
    .setAdminKey(accounts.account1PrivateKey)
    .freezeWith(client);

  console.log('Scheduling TX from account 1 to account 2');

  const serializedScheduleTransaction = Buffer.from(
    scheduleTransaction.toBytes()
  ).toString('base64');

  console.log(
    `Serialized scheduled transaction: ${serializedScheduleTransaction}`
  );
  console.log(
    'Copy this serialized schedule transaction response in and replace in env file'
  );

  process.exit(1);
}

main();
