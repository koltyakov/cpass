// node ./test/basic.js

const Cpass = require('../dist');
const cpass = new Cpass();

let unsecure = 'password';

console.log('MID', cpass.getMachineId());

console.log('Unsecure:', unsecure);

let secure = cpass.encode(unsecure);

console.log('Encripted:', secure);

let decrypted = cpass.decode(secure);

console.log('Decrypted:', decrypted);