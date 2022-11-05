import { mintContractAddress, purchaseContractAddress } from './smartContractConfig';

const MintTicketTokenJSON = require('./contracts/MintTicketToken.json');
const mintABI = MintTicketTokenJSON.abi;
const PurchaseTicketTokenJSON = require('./contracts/PurchaseTicketToken.json');
const purchaseABI = PurchaseTicketTokenJSON.abi;

const Web3 = require('web3');
export const web3 = new Web3(window.ethereum);

export const mintContract = new web3.eth.Contract(mintABI, mintContractAddress);
export const purchaseContract = new web3.eth.Contract(purchaseABI, purchaseContractAddress);
