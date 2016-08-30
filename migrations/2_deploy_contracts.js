module.exports = function(deployer) {
  deployer.deploy(Owned);
  deployer.autolink();
  deployer.deploy(Donate);

};
