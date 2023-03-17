const { AccountId, PrivateKey } = require('@hashgraph/sdk');

const requiredConfig = ['MY_ACCOUNT_ID', 'MY_ACCOUNT_PRIVATE_KEY'];

requiredConfig.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} must be present`);
  }
});

const accounts = {
  myAccountId: AccountId.fromString(process.env.MY_ACCOUNT_ID),
  myAccountPrivateKey: PrivateKey.fromString(
    process.env.MY_ACCOUNT_PRIVATE_KEY
  ),
};

Object.keys(accounts).forEach((key) => {
  if (!accounts[key]) {
    throw new Error(`account ${key} must be present`);
  }
});

exports.accounts = accounts;
