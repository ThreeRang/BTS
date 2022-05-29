const MintTicketToken = artifacts.require("MintTicketToken");
const PurchaseTicketToken = artifacts.require("PurchaseTicketToken");

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(MintTicketToken);
    await deployer.deploy(PurchaseTicketToken, MintTicketToken.address);
  });
};
