import { expect } from 'chai';
import * as mocha from 'mocha';

import { Cpass } from '../src';
import { machineIdSync } from '../src/utils/machineId';
import { networkId } from '../src/utils/networkId';

let cpass: Cpass;
const modes: any = [null, 'master_key_mode'];

describe(`Cpass tests`, () => {

  for (const mode of modes) {

    describe(`Mode: ${mode === null ? 'Auto' : 'Master Key'}`, () => {

      before('Setup cpass', () => {
        cpass = new Cpass(mode);
      });

      it(`should encode a string`, () => {
        const original = 'original string';
        const encoded = cpass.encode(original);
        expect(encoded).not.equal(original);
      });

      it(`should decode to the original`, () => {
        const original = 'password';
        const encoded = cpass.encode(original);
        const decoded = cpass.decode(encoded);
        expect(decoded).is.equal(original);
      });

      it(`should decode plain to itself`, () => {
        const original = 'plain_password';
        const decoded = cpass.decode(original);
        expect(decoded).is.equal(original);
      });

      it(`should not decode modified hash`, () => {
        const original = 'plain_password';
        const encoded = cpass.encode(original);
        const modified = encoded + '_';
        const decoded = cpass.decode(modified);
        expect(decoded).is.not.equal(original);
        expect(decoded).is.equal(modified);
      });

    });

  }

  describe(`Special conditions`, () => {

    it(`should decode differently 1`, () => {
      const original = 'plain_password';
      const cpass1 = new Cpass('Key1');
      const cpass2 = new Cpass('Key2');
      const encoded1 = cpass1.encode(original);
      const encoded2 = cpass2.encode(original);
      expect(encoded1).is.not.equal(encoded2);
    });

    it(`should decode differently 2`, () => {
      const original = 'plain_password';
      const cpass1 = new Cpass();
      const cpass2 = new Cpass('Key');
      const encoded1 = cpass1.encode(original);
      const encoded2 = cpass2.encode(original);
      expect(encoded1).is.not.equal(encoded2);
    });

    it(`should receive machineId`, () => {
      const mId = machineIdSync(false) || '';
      expect(mId.length).is.greaterThan(0);
    });

    it(`should receive networkId`, () => {
      const nId = networkId(false) || '';
      expect(nId.length).is.greaterThan(0);
    });

    it(`should use machineId with priority`, () => {
      const original = 'plain_password';
      const mId = machineIdSync(true);
      const cpass1 = new Cpass(mId);
      const cpass2 = new Cpass();
      const encoded = cpass1.encode(original);
      const decoded = cpass2.decode(encoded);
      expect(decoded).is.equal(original);
    });

    it(`should decode by a specific key`, () => {
      const original = 'plain_password';
      const encoded = '6230a961ee20ecc45d40cbf55b777e086b47044850a8c30' +
        'f446b32fa2b0a97f3897e034bf3e04cd891e1f3c13730c6' +
        '55d1oCZxXLg9QZknoY8UVL8WKJKgyKVZ4DW99X+C/pfRc=';
      cpass = new Cpass('My_Secret_Key');
      const decoded = cpass.decode(encoded);
      expect(decoded).is.equal(original);
    });

  });

});
