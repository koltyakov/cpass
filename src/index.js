var os = require('os');
var crypto = require('crypto');

var Cpass = function Cpass() {
    var _self = this;
    var machineId = null;
    var networkInterfaces = null;
    var encryptor = null;

    var getMachineId = function() {
        var machineId = null;
        networkInterfaces = networkInterfaces || os.networkInterfaces() || {};
        interfaces: for (i in networkInterfaces) {
            for (v in i) {
                if (networkInterfaces[i][v] && networkInterfaces[i][v].address.length && !networkInterfaces[i][v].internal) {
                    machineId = networkInterfaces[i][v].address;
                    break interfaces;
                }
            }
        }
        machineId = machineId || os.hostname();
        return crypto.createHash('md5')
                .update(machineId, 'utf8')
                .digest('hex');
    };

    _self.encode = function encode(unsecured) {
        var secured = null;
        machineId = machineId || getMachineId();
        encryptor = encryptor || require('simple-encryptor')(machineId);
        secured = encryptor.encrypt(unsecured);
        return secured;
    };

    _self.decode = function decode(secured) {
        var unsecured = null;
        machineId = machineId || getMachineId();
        encryptor = encryptor || require('simple-encryptor')(machineId);
        unsecured = encryptor.decrypt(secured);
        return unsecured || secured;
    };

    return _self;
};

module.exports = exports = Cpass;