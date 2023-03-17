const {
  Wallet,
  Client,
  LocalProvider,
  Hbar,
  KeyList,
  AccountCreateTransaction,
  TransferTransaction,
  AccountId,
  AccountBalanceQuery,
} = require('@hashgraph/sdk');
require('dotenv').config();

const { accounts } = require('./utils/load-accounts');

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accounts.account1Id, accounts.account1PrivateKey);
async function main() {
  // Set up the client and accounts
  const wallet = new Wallet(
    accounts.account1Id,
    accounts.account1PrivateKey,
    new LocalProvider()
  );

  const keyList = new KeyList(
    [
      accounts.account1PrivateKey.publicKey,
      accounts.account2PrivateKey.publicKey,
      accounts.account3PrivateKey.publicKey,
    ],
    2 // Threshold of 2
  );
  let transaction = await new AccountCreateTransaction()
    .setInitialBalance(new Hbar(20))
    .setKey(keyList)
    .freezeWithSigner(wallet);
  transaction = await transaction.signWithSigner(wallet);
  const response = await transaction.executeWithSigner(wallet);

  let receipt = await response.getReceiptWithSigner(wallet);

  // Get the account ID
  const { accountId } = receipt;

  console.log(`Multi signature account ID:  ${accountId?.toString()}`);

  // Create tx with missing signatures

  let result;
  try {
    transaction = await new TransferTransaction()
      .setNodeAccountIds([new AccountId(3)])
      .addHbarTransfer(accountId, -10)
      .addHbarTransfer(accounts.account4Id, 10)
      .freezeWithSigner(wallet);
    transaction = await transaction.signWithSigner(wallet);

    accounts.account1PrivateKey.signTransaction(transaction);

    result = await transaction.executeWithSigner(wallet);
    receipt = await result.getReceiptWithSigner(wallet);

    console.log(receipt.status.toString());
  } catch (err) {
    console.error(`Transcation failed due to missing signature set`);
  }

  console.log('-----------------------------------');

  // Create tx with all signatures
  transaction = await new TransferTransaction()
    .setNodeAccountIds([new AccountId(3)])
    .addHbarTransfer(receipt.accountId, -10)
    .addHbarTransfer(accounts.account4Id, 10)
    .freezeWithSigner(wallet);
  transaction = await transaction.signWithSigner(wallet);

  accounts.account1PrivateKey.signTransaction(transaction);
  accounts.account2PrivateKey.signTransaction(transaction);

  result = await transaction.executeWithSigner(wallet);
  receipt = await result.getReceiptWithSigner(wallet);
  console.log(receipt.status.toString());

  const balance = await new AccountBalanceQuery()
    .setAccountId(accountId)
    .executeWithSigner(wallet);

  console.log(`Balance of the multi signature account: ${balance.toString()}`);
  console.log('-----------------------------------');

  process.exit(1);
}

main();
