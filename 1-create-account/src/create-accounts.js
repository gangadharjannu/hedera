const {
  Client,
  AccountCreateTransaction,
  PrivateKey,
  Hbar,
} = require('@hashgraph/sdk');
require('dotenv').config();

const { accounts } = require('./utils/load-accounts');

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accounts.myAccountId, accounts.myAccountPrivateKey);

async function createAccount(accountName, accountInitialBalance) {
  // Create key
  const privateKeyForNewAccount = await PrivateKey.generateED25519Async();
  const { publicKey: publicKeyForNewAccount } = privateKeyForNewAccount;

  // Create an account with `accountInitialBalance` hbar
  const transaction = new AccountCreateTransaction()
    .setKey(publicKeyForNewAccount)
    .setInitialBalance(new Hbar(accountInitialBalance))
    .setAccountMemo(`Testnet account:  ${accountName}`);
  // Sign the transaction with the client operator private key and submit to a Hedera network
  const txResponse = await transaction.execute(client);

  // Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  // Get the account ID
  const newAccountId = receipt.accountId;

  console.log(
    `The new account ID is ${newAccountId} private key ${privateKeyForNewAccount} public key ${publicKeyForNewAccount}`
  );
}

createAccount('Account1', 500);
createAccount('Account2', 1000);
createAccount('Account3', 2000);
createAccount('Account4', 3000);
createAccount('Account5', 2000);
