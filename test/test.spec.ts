import { expect } from 'chai';
import * as mocha from 'mocha';

import { Cpass } from '../src';
import { machineIdSync } from '../src/utils/machineId';
import { networkId } from '../src/utils/networkId';

let cpass: Cpass;
const modes: any = [ null, 'master_key_mode' ];

describe(`Cpass tests`, () => {

    for (let mode of modes) {

        describe(`Mode: ${mode === null ? 'Auto' : 'Master Key'}`, () => {

            before('Setup cpass', function(): void {
                cpass = new Cpass(mode);
            });

            it(`should encode a string`, function(): void {
                let original = 'original string';
                let encoded = cpass.encode(original);
                expect(encoded).not.equal(original);
            });

            it(`should decode to original`, function(): void {
                let original = 'password';
                let encoded = cpass.encode(original);
                let decoded = cpass.decode(encoded);
                expect(decoded).is.equal(original);
            });

            it(`should decode plain to itself`, function(): void {
                let original = 'plain_password';
                let decoded = cpass.decode(original);
                expect(decoded).is.equal(original);
            });

            it(`should not decode modified hash`, function(): void {
                let original = 'plain_password';
                let encoded = cpass.encode(original);
                let modified = encoded + '_';
                let decoded = cpass.decode(modified);
                expect(decoded).is.not.equal(original);
                expect(decoded).is.equal(modified);
            });

        });

    }

    describe(`Special conditions`, () => {

        it(`should decode differently 1`, function(): void {
            let original = 'plain_password';
            const cpass1 = new Cpass('Key1');
            const cpass2 = new Cpass('Key2');
            let encoded1 = cpass1.encode(original);
            let encoded2 = cpass2.encode(original);
            expect(encoded1).is.not.equal(encoded2);
        });

        it(`should decode differently 2`, function(): void {
            let original = 'plain_password';
            const cpass1 = new Cpass();
            const cpass2 = new Cpass('Key');
            let encoded1 = cpass1.encode(original);
            let encoded2 = cpass2.encode(original);
            expect(encoded1).is.not.equal(encoded2);
        });

        it(`should receive machineId`, function(): void {
            let mId = machineIdSync(false) || '';
            expect(mId.length).is.greaterThan(0);
        });

        it(`should receive networkId`, function(): void {
            let nId = networkId(false) || '';
            expect(nId.length).is.greaterThan(0);
        });

        it(`should use machineId with priority`, function(): void {
            let original = 'plain_password';
            let mId = machineIdSync(false);
            const cpass1 = new Cpass(mId);
            const cpass2 = new Cpass('Key');
            let encoded = cpass1.encode(original);
            let decoded = cpass2.decode(encoded);
            expect(decoded).is.equal(encoded);
        });

        it(`should decode by a precific key`, function(): void {
            let original = 'plain_password';
            let encoded = '6230a961ee20ecc45d40cbf55b777e086b47044850a8c30' +
                          'f446b32fa2b0a97f3897e034bf3e04cd891e1f3c13730c6' +
                          '55d1oCZxXLg9QZknoY8UVL8WKJKgyKVZ4DW99X+C/pfRc=';
            cpass = new Cpass('My_Secret_Key');
            let decoded = cpass.decode(encoded);
            expect(decoded).is.equal(original);
        });

    });

});
