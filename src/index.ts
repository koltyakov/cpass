import { NetworkInterfaceInfo, networkInterfaces, hostname } from 'os';
import { createHash } from 'crypto';
import * as simple from 'simple-encryptor';

export interface INetworkInterfaces {
    [index: string]: NetworkInterfaceInfo[];
}

export class Cpass {
    private machineId: string;
    private networkInterfaces: INetworkInterfaces;
    private encryptor: any;

    constructor() {
        //
    }

    public encode(unsecured: string): string {
        let secured: string;
        this.machineId = this.machineId || this.getMachineId();
        this.encryptor = this.encryptor || simple(this.machineId);
        secured = this.encryptor.encrypt(unsecured);
        return secured;
    }

    public decode(secured: string): string {
        let unsecured: string;
        this.machineId = this.machineId || this.getMachineId();
        this.encryptor = this.encryptor || simple(this.machineId);
        unsecured = this.encryptor.decrypt(secured);
        return unsecured || secured;
    }

    private getMachineId(): string {
        this.networkInterfaces = this.networkInterfaces || networkInterfaces() || {};
        for (let iProp of Object.keys(this.networkInterfaces)) {
            for (let vProp of Object.keys(this.networkInterfaces[iProp])) {
                let iNet = this.networkInterfaces[iProp][vProp];
                if (iNet && iNet.address.length && !iNet.internal) {
                    this.machineId = `${iNet.address}::${iNet.mac}`;
                    break;
                }
            }
            if (this.machineId) {
                break;
            }
        }
        this.machineId = this.machineId || hostname();
        return createHash('md5').update(this.machineId, 'utf8').digest('hex');
    }

}

module.exports = Cpass;
