const MintTicketToken = artifacts.require("MintTicketToken");

module.exports = function (deployer) {
  deployer.deploy(MintTicketToken);
};
