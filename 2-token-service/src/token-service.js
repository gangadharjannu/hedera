const {
  Client,
  TokenCreateTransaction,
  TokenInfoQuery,
  TokenType,
  CustomRoyaltyFee,
  CustomFixedFee,
  Hbar,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  AccountBalanceQuery,
  AccountUpdateTransaction,
} = require('@hashgraph/sdk');

require('dotenv').config();

const { accounts } = require('./utils/load-accounts');

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accounts.account1Id, accounts.account1PrivateKey);

async function main() {
  // DEFINE CUSTOM FEE SCHEDULE
  const nftCustomFee = await new CustomRoyaltyFee()
    .setNumerator(1) // 1/10 = 10%
    .setDenominator(10)
    .setFeeCollectorAccountId(accounts.account2Id)
    .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(200)));

  // IPFS CONTENT IDENTIFIERS FOR WHICH WE WILL CREATE NFTs
  const CID = [
    'NFT 1',
    'NFT x',
    'NFT 3',
    'NFT 4',
    'NFT 5',
  ];

  // CREATE NFT WITH CUSTOM FEE
  const nftCreate = await new TokenCreateTransaction()
    .setTokenName('YVS')
    .setTokenSymbol('YVS')
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(accounts.account1Id)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(CID.length)
    .setCustomFees([nftCustomFee])
    .setAdminKey(accounts.account1PrivateKey)
    .setSupplyKey(accounts.account1PrivateKey)
    .freezeWith(client)
    .sign(accounts.account1PrivateKey);

  const nftCreateTxSign = await nftCreate.sign(accounts.account1PrivateKey);
  const nftCreateSubmit = await nftCreateTxSign.execute(client);
  const nftCreateRx = await nftCreateSubmit.getReceipt(client);
  const { tokenId } = nftCreateRx;
  console.log(`Created NFT with Token ID: ${tokenId} \n`);

  // TOKEN QUERY TO CHECK THAT THE CUSTOM FEE SCHEDULE IS ASSOCIATED WITH NFT
  const tokenInfo = await new TokenInfoQuery()
    .setTokenId(tokenId)
    .execute(client);
  console.table(tokenInfo.customFees[0]);

  // MINT NEW BATCH OF NFTs
  const nftLeaf = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < CID.length; i++) {
    // eslint-disable-next-line no-await-in-loop, no-use-before-define
    nftLeaf[i] = await tokenMinterFcn(CID[i]);
    console.log(
      `Created NFT ${tokenId} with serial: ${nftLeaf[i].serials[0].low}`
    );
  }

  // AUTO-ASSOCIATION FOR account1'S ACCOUNT
  const associateTx = await new AccountUpdateTransaction()
    .setAccountId(accounts.account3Id)
    .setMaxAutomaticTokenAssociations(5)
    .freezeWith(client)
    .sign(accounts.account3PrivateKey);
  const associateTxSubmit = await associateTx.execute(client);
  const associateRx = await associateTxSubmit.getReceipt(client);
  console.log(`account1 NFT Auto-Association: ${associateRx.status} \n`);

  // BALANCE CHECK 1
  // eslint-disable-next-line no-use-before-define
  let oB = await bCheckerFcn(accounts.account1Id);
  // eslint-disable-next-line no-use-before-define
  let aB = await bCheckerFcn(accounts.account3Id);

  console.log(
    `- Treasury balance: ${oB[0]} NFTs of ID:${tokenId} and ${oB[1]}`
  );
  console.log(`- account1 balance: ${aB[0]} NFTs of ID:${tokenId} and ${aB[1]}`);

  // TRANSFER second NFT to Account 3
  const tokenTransferTx = await new TransferTransaction()
    .addNftTransfer(tokenId, 2, accounts.account1Id, accounts.account3Id)
    .freezeWith(client)
    .sign(accounts.account1PrivateKey);
  const tokenTransferSubmit = await tokenTransferTx.execute(client);
  const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
  console.log(
    `\n NFT transfer Treasury->account1 status: ${tokenTransferRx.status} \n`
  );

  // BALANCE CHECK 2
  // eslint-disable-next-line no-use-before-define
  oB = await bCheckerFcn(accounts.account1Id);
  // eslint-disable-next-line no-use-before-define
  aB = await bCheckerFcn(accounts.account3Id);

  console.log(
    `- Treasury balance: ${oB[0]} NFTs of ID:${tokenId} and ${oB[1]}`
  );
  console.log(`- account1 balance: ${aB[0]} NFTs of ID:${tokenId} and ${aB[1]}`);

  // TOKEN MINTER FUNCTION ==========================================
  // eslint-disable-next-line no-shadow
  async function tokenMinterFcn(CID) {
    const mintTx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([Buffer.from(CID)])
      .freezeWith(client);
    const mintTxSign = await mintTx.sign(accounts.account1PrivateKey);
    const mintTxSubmit = await mintTxSign.execute(client);
    const mintRx = await mintTxSubmit.getReceipt(client);
    return mintRx;
  }

  // BALANCE CHECKER FUNCTION ==========================================
  async function bCheckerFcn(id) {
    const balanceCheckTx = await new AccountBalanceQuery()
      .setAccountId(id)
      .execute(client);
    return [
      // eslint-disable-next-line no-underscore-dangle
      balanceCheckTx.tokens._map.get(tokenId.toString()),
      balanceCheckTx.hbars,
    ];
  }
}

main();
