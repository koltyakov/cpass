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
    this.encryptor = this.encryptor || (simple as any)(this.machineId);
  }

  public encode (unsecured: string): string {
    let secured: string;
    secured = this.encryptor.encrypt(unsecured);
    return secured;
  }

  public decode (secured: string): string {
    let unsecured: string;
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
