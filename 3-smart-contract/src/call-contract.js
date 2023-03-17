const {
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
} = require('@hashgraph/sdk');

require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const Web3 = require('web3');
const web3 = new Web3();

const { accounts } = require('./utils/load-accounts');

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accounts.account1Id, accounts.account1PrivateKey);

const contractId = process.env.CONTRACT_ID;

async function main() {
  // Create the transaction to update the contract message
  const contractExecTx = new ContractExecuteTransaction()
    // Set the ID of the contract
    .setContractId(contractId)
    // Set the gas for the contract call
    .setGas(100000)
    // Set the contract function to call
    .setFunction(
      'function1',
      new ContractFunctionParameters().addUint16(4).addUint16(3)
    );

  // Submit the transaction to a Hedera network and store the response
  const submitExecTx = await contractExecTx.execute(client);

  // Get the receipt of the transaction
  const receipt = await submitExecTx.getReceipt(client);

  // Confirm the transaction was executed successfully
  console.log(`The transaction status is ${receipt.status.toString()}`);
  // a record contains the output of the function
  let record = await submitExecTx.getRecord(client);

  console.log(
    `The function output is ${record.contractFunctionResult?.getUint160()}`
  );
  const function1output = record.contractFunctionResult?.getUint160();
  const contractExecTx2 = new ContractExecuteTransaction()
    // Set the ID of the contract
    .setContractId(contractId)
    // Set the gas for the contract call
    .setGas(100000)
    // Set the contract function to call
    .setFunction(
      'function2',
      new ContractFunctionParameters().addUint16(function1output)
    );

  const submitExecTx2 = await contractExecTx2.execute(client);

  const receipt2 = await submitExecTx2.getReceipt(client);

  console.log(
    'Successfully executed second contract call with status',
    receipt2.status
  );

  // a record contains the output of the function
  record = await submitExecTx2.getRecord(client);

  console.log(
    `The function output is ${record.contractFunctionResult?.getUint160()}`
  );

  process.exit();
}

main();
