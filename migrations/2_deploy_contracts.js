const ChitFunds = artifacts.require("ChitFunds");

module.exports = function(deployer) {
  deployer.deploy(ChitFunds);
};
