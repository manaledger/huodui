const JsondataSol = require('./build/contracts/Jsondata.sol');
const Web3 = require('web3');
const Promise = require('promise');

module.exports = WebJsondata;

function WebJsondata() {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  JsondataSol.setProvider(web3.currentProvider);

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

    var don = JsondataSol.deployed();
    var ev = don.Jsondata();
    ev.watch(function (err, result) {
      if (!err) {
        console.log(result.args);
      }
    });
  });
}

WebJsondata.prototype.getJson = function (key) {
  var don = JsondataSol.deployed();

  return new Promise(function (resolve, reject) {
    don.getJson.call(key, {from: this.account}).then(function(value) {
      resolve(value);
    }).catch(function(e) {
      reject(e);
    });
  });

};

WebJsondata.prototype.saveJson = function (key, json) {
  var don = JsondataSol.deployed();

  return new Promise(function (resolve, reject) {
    don.saveJson(key, json, {from: this.account}).then(function(value) {
      resolve(value)
    }).catch(function(e) {
      reject(e);
    });
  });

};
