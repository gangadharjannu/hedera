const {
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config();

const { accounts } = require('./utils/load-accounts');

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accounts.account1Id, accounts.account1PrivateKey);

async function main() {
  // eslint-disable-next-line global-require
  const contractCompiled = require('../artifacts/contracts/certification.json');
  const { bytecode } = contractCompiled;
  // Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction()
    // Set the bytecode of the contract
    .setContents(bytecode);

  // Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
  const submitTx = await fileCreateTx.execute(client);

  // Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client);

  // Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId;

  // Log the file ID
  console.log(`The smart contract byte code file ID is ${bytecodeFileId}`);

  // Instantiate the contract instance
  const contractTx = await new ContractCreateTransaction()
    // Set the file ID of the Hedera file storing the bytecode
    .setBytecodeFileId(bytecodeFileId)
    // Set the gas to instantiate the contract
    .setGas(100000);

  // Submit the transaction to the Hedera test network
  const contractResponse = await contractTx.execute(client);

  // Get the receipt of the file create transaction
  const contractReceipt = await contractResponse.getReceipt(client);

  // Get the smart contract ID
  const newContractId = contractReceipt.contractId;

  // Log the smart contract ID
  console.log(`The smart contract ID is ${newContractId}`);

  process.exit();
}

main();
