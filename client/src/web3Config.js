import { smartContractAddress } from './smartContractConfig';

const MintTicketTokenJSON = require('./MintTicketToken.json');
const mintABI = MintTicketTokenJSON.abi;
const Web3 = require('web3');
export const web3 = new Web3(window.ethereum);

export const mintContract = new web3.eth.Contract(mintABI, smartContractAddress);
