import { networkInterfaces, hostname } from 'os';
import { hash } from './common';

export const networkIds = (original: boolean = true): string[] => {
    const networkIntfs = networkInterfaces() || {};
    let netIds: string[] = [];
    Object.keys(networkIntfs).forEach(intfsProp => {
        Object.keys(networkIntfs[intfsProp]).forEach(adapterProp => {
            let iNet = networkIntfs[intfsProp][adapterProp];
            if (iNet && iNet.address.length && !iNet.internal && iNet.mac !== '00:00:00:00:00:00') {
                if (netIds.indexOf(iNet.mac) === -1) {
                    netIds.push(iNet.mac);
                }
            }
        });
    });
    if (netIds.length === 0) {
        netIds.push(hostname());
    }
    return original ? netIds : netIds.map(netId => hash(netId));
};

export const networkId = (original: boolean = true): string => {
    let netId: string = networkIds(original)[0];
    return original ? netId : hash(netId);
};
