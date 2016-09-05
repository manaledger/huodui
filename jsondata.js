const JsondataSol = require('./build/contracts/Jsondata.sol');
const Web3 = require('web3');
const Promise = require('bluebird');


module.exports = WebJsondata;

function WebJsondata(useEvent) {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    JsondataSol.setProvider(web3.currentProvider);
    this.useEvent = useEvent;
}

WebJsondata.prototype.setup = function() {
    return new Promise(function(resolve, reject) {
        if (this.initialized) {
            resolve();
        } else {
            web3.eth.getAccounts(function(err, accs) {
                if (err != null) {
                    reject(err);
                }

                if (accs.length == 0) {
                    reject("no available account");
                }

                this.accounts = accs;
                this.account = this.accounts[0];
                this.initialized = true;

                if (this.useEvent) {
                    var don = JsondataSol.deployed();
                    var ev = don.Jsondata();
                    ev.watch(function(err, result) {
                        if (!err) {
                            // console.log(result.args);
                        }
                    });
                }

                resolve();
            });
        }
    });
}


WebJsondata.prototype.getJson = function(key) {
    var don = JsondataSol.deployed();
    var that = this;

    return new Promise(function(resolve, reject) {
        that.setup(this.useEvent).then(function() {
            return don.getJson.call(key, {
                from: this.account
            });
        }).then(function(value) {
            resolve(value);
        }).catch(function(e) {
            reject(e);
        })
    });
};

WebJsondata.prototype.saveJson = function(key, json) {
    var don = JsondataSol.deployed();
    var that = this;

    return new Promise(function(resolve, reject) {
        that.setup(this.useEvent).then(function() {
            return don.saveJson(key, json, {
                from: this.account
            });
        }).then(function(value) {
            resolve(value)
        }).catch(function(e) {
            reject(e);
        });
    });
};
