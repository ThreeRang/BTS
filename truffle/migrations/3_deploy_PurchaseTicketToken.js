const PurchaseTicketToken = artifacts.require("PurchaseTicketToken");

module.exports = function (deployer) {
  deployer.deploy(PurchaseTicketToken);
};
