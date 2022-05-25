const MintTicketTokenJSON = require('./MintTicketToken.json');
const mintABI = MintTicketTokenJSON.abi;
const smartContractAddress = '0xcF9DC453417B9A1859B5adD8390a080b59926EDe';
const Web3 = require('web3');
const web3 = new Web3(window.ethereum);

export const mintContract = new web3.eth.Contract(mintABI, smartContractAddress);
