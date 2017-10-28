import { createHash } from 'crypto';
import * as simple from 'simple-encryptor';

import { hash } from './utils/common';
import { machineIdSync } from './utils/machineId';
import { networkId } from './utils/networkId';

export class Cpass {

  private machineId: string;
  private encryptor: any;

  constructor (masterKey?: string) {
    if (typeof masterKey !== 'undefined' && masterKey !== null) {
      this.machineId = hash(masterKey);
    } else {
      this.machineId = this.getMachineId();
    }
  }

  public encode (unsecured: string): string {
    let secured: string;
    this.machineId = this.machineId || this.getMachineId();
    this.encryptor = this.encryptor || simple(this.machineId);
    secured = this.encryptor.encrypt(unsecured);
    return secured;
  }

  public decode (secured: string): string {
    let unsecured: string;
    this.machineId = this.machineId || this.getMachineId();
    this.encryptor = this.encryptor || simple(this.machineId);
    unsecured = this.encryptor.decrypt(secured);
    return unsecured || secured;
  }

  private getMachineId (): string {
    let mId: string;
    try {
      mId = machineIdSync(false);
    } catch (ex) {
      mId = networkId(false);
    }
    return mId;
  }

}
