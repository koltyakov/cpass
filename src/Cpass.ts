import { hash } from './utils/common';
import { machineIdSync } from './utils/machineId';
import { networkId } from './utils/networkId';
import { Encryptor } from './utils/encryptor';

export class Cpass {

  private encryptor: Encryptor;
  private machineId: string;

  constructor(masterKey?: string) {
    this.machineId = (typeof masterKey !== 'undefined' && masterKey !== null) ? hash(masterKey) : this.getMachineId();
    this.encryptor = new Encryptor(this.machineId);
  }

  public encode = (unsecured: string): string => this.encryptor.encrypt(unsecured);

  public decode = (secured: string): string => this.encryptor.decrypt(secured) || secured;

  private getMachineId = (): string => {
    let mId: string;
    try {
      mId = machineIdSync(false);
    } catch (ex) {
      mId = networkId(false);
    }
    return mId;
  }

}
