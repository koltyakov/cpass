// Copied and converted to TypeScript initially to apply support for aes-256-cbc
// Source: https://github.com/sehrope/node-simple-encryptor

import * as crypto from 'crypto';
import * as scmp from 'scmp';

// Arbitrary min length, nothing should shorter than this:
const MIN_KEY_LENGTH = 16;

export interface IEncryptorOptions {
  key: string;
  hmac?: boolean;
  debug?: boolean;
}

export class Encryptor {

  private chipherAlgorithm = 'aes-256-cbc';
  private debug: boolean;
  private cryptoKey: Buffer;
  private verifyHmac: boolean;
  private reviver: (key: any, value: any) => any;

  constructor(opts: IEncryptorOptions | string) {
    if (typeof opts === 'string') {
      opts = { key: opts };
    }

    this.verifyHmac = typeof opts.hmac !== 'undefined' ? opts.hmac : true;
    this.debug = typeof opts.debug !== 'undefined' ? opts.debug : false;

    if (!opts.key || typeof opts.key !== 'string') {
      throw Error('a string key must be specified');
    }
    if (opts.key.length < MIN_KEY_LENGTH) {
      throw Error(`key must be at least ${MIN_KEY_LENGTH} characters long`);
    }

    // Use SHA-256 to derive a 32-byte key from the specified string.
    // NOTE: We could alternatively do some kind of key stretching here.
    this.cryptoKey = crypto.createHash('sha256').update(opts.key).digest();
  }

  // Returns the HMAC(text) using the derived cryptoKey
  // Defaults to returning the result as hex.
  public hmac(text: string, format: crypto.HexBase64Latin1Encoding = 'hex'): string {
    return crypto.createHmac('sha256', this.cryptoKey).update(text).digest(format);
  }

  // Encrypts an arbitrary object using the derived cryptoKey and retursn the result as text.
  // The object is first serialized to JSON (via JSON.stringify) and the result is encrypted.
  //
  // The format of the output is:
  // [<hmac>]<iv><encryptedJson>
  //
  // <hmac>             : Optional HMAC
  // <iv>               : Randomly generated initailization vector
  // <encryptedJson>    : The encrypted object
  public encrypt(obj: any): string {
    const json = JSON.stringify(obj);

    // First generate a random IV.
    // AES-256 IV size is sixteen bytes:
    const iv = crypto.randomBytes(16);

    // Make sure to use the 'iv' variant when creating the cipher object:
    const cipher = crypto.createCipheriv(this.chipherAlgorithm, this.cryptoKey, iv);

    // Generate the encrypted json:
    const encryptedJson = cipher.update(json, 'utf8', 'base64') + cipher.final('base64');

    // Include the hex-encoded IV + the encrypted base64 data
    // NOTE: We're using hex for encoding the IV to ensure that it's of constant length.
    let result = iv.toString('hex') + encryptedJson;

    if (this.verifyHmac) {
      // Prepend an HMAC to the result to verify it's integrity prior to decrypting.
      // NOTE: We're using hex for encoding the hmac to ensure that it's of constant length
      result = this.hmac(result, 'hex') + result;
    }

    return result;
  }

  // Decrypts the encrypted cipherText and returns back the original object.
  // If the cipherText cannot be decrypted (bad key, bad text, bad serialization) then it returns null.
  //
  // NOTE: This function never throws an error. It will instead return null if it cannot decrypt the cipherText.
  // NOTE: It's possible that the data decrypted is null (since it's valid input for encrypt(...)).
  //       It's up to the caller to decide if the result is valid.
  public decrypt(cipherText: string): string | null {
    if (!cipherText) {
      return null;
    }
    try {
      if (this.verifyHmac) {
        // Extract the HMAC from the start of the message:
        const expectedHmac = cipherText.substring(0, 64);
        // The remaining message is the IV + encrypted message:
        cipherText = cipherText.substring(64);
        // Calculate the actual HMAC of the message:
        const actualHmac = this.hmac(cipherText);
        if (!scmp(Buffer.from(actualHmac, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
          throw Error('HMAC does not match');
        }
      }

      // Extract the IV from the beginning of the message:
      const iv = Buffer.from(cipherText.substring(0, 32), 'hex');
      // The remaining text is the encrypted JSON:
      const encryptedJson = cipherText.substring(32);

      // Make sure to use the 'iv' variant when creating the decipher object:
      const decipher = crypto.createDecipheriv(this.chipherAlgorithm, this.cryptoKey, iv);
      // Decrypt the JSON:
      const json = decipher.update(encryptedJson, 'base64', 'utf8') + decipher.final('utf8');

      // Return the parsed object:
      return JSON.parse(json, this.reviver);
    } catch (error) {
      // If we get an error log it and ignore it. Decrypting should never fail.
      if (this.debug) {
        console.error(`Exception in decrypt (ignored): ${error}`);
      }
      return null;
    }
  }

}
