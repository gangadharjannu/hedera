const { AccountId, PrivateKey } = require('@hashgraph/sdk');

const requiredConfig = [
  'MY_ACCOUNT_ID',
  'MY_ACCOUNT_PRIVATE_KEY',
  'ACCOUNT1_ID',
  'ACCOUNT1_PRIVATE_KEY',
  'ACCOUNT2_ID',
  'ACCOUNT2_PRIVATE_KEY',
  'ACCOUNT3_ID',
  'ACCOUNT3_PRIVATE_KEY',
  'ACCOUNT4_ID',
  'ACCOUNT4_PRIVATE_KEY',
];

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
  account1Id: AccountId.fromString(process.env.ACCOUNT1_ID),
  account1PrivateKey: PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY),
  account2Id: AccountId.fromString(process.env.ACCOUNT2_ID),
  account2PrivateKey: PrivateKey.fromString(process.env.ACCOUNT2_PRIVATE_KEY),
  account3Id: AccountId.fromString(process.env.ACCOUNT3_ID),
  account3PrivateKey: PrivateKey.fromString(process.env.ACCOUNT3_PRIVATE_KEY),
  account4Id: AccountId.fromString(process.env.ACCOUNT4_ID),
  account4PrivateKey: PrivateKey.fromString(process.env.ACCOUNT4_PRIVATE_KEY),
};

Object.entries(accounts).forEach(([key, val]) => {
  if (!val) {
    throw new Error(`account ${key} must be present`);
  }
});

exports.accounts = accounts;
