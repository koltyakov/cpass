import { Cpass } from '../src';

const original = 'secret';
const cpass = new Cpass('CUSTOM_KEY');
const encoded = cpass.encode(original);

console.log(encoded);

console.log(cpass.decode(encoded));