const DonateSol = require('../build/contracts/Donate.sol');
const Web3 = require('web3');
const Promise = require('promise');

module.exports = WebDonate;

function WebDonate() {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  DonateSol.setProvider(web3.currentProvider);

  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      console.log(err);
      return;
    }

    if (accs.length == 0) {
      console.log("no available account");;
      return;
    }

    this.accounts = accs;
    this.account = this.accounts[0];

    var don = DonateSol.deployed();
    var ev = don.Donate();
    ev.watch(function (err, result) {
      if (!err) {
        console.log(result.args);
      }
    });
  });
}

WebDonate.prototype.donateById = function (id) {
  var don = DonateSol.deployed();

  return new Promise(function (resolve, reject) {
    don.donateById.call(id, {from: this.account}).then(function(value) {
      resolve(value);
    }).catch(function(e) {
      reject(e);
    });
  });

};

WebDonate.prototype.donate = function (projectId, userId, ammount, paytype) {
  var don = DonateSol.deployed();

  return new Promise(function (resolve, reject) {
    don.donate(projectId, userId, ammount, paytype, {from: this.account}).then(function(value) {
      resolve(value)
    }).catch(function(e) {
      reject(e);
    });
  });

WebDonate.prototype.donateById = function (id) {
  var don = DonateSol.deployed();
  return new Promise(function (resolve, reject) {
    don.donateById(id, {from:this.account}).then(function (value) {
      resolve(value);
    }).catch(function (e) {
      reject(e);
    });
  });
};

};
