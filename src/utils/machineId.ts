import { exec, execSync } from 'child_process';
import { hash } from './common';

const platforms = {
  darwin: 'ioreg -rd1 -c IOPlatformExpertDevice',
  ia32: '%windir%\\sysnative\\cmd.exe \/c %windir%\\System32\\REG ' +
  'QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography ' +
  '/v MachineGuid', // %windir%\\System32 doesn't work in Win32 environments failing with:
  // `ERROR: The system was unable to find the specified registry key or value.` message
  x64: '%windir%\\System32\\REG ' +
  'QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography ' +
  '/v MachineGuid',
  linux: 'cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || :'
};

const expose = (machineRawInfo: string): string => {
  switch (process.platform) {
    case 'darwin':
      return machineRawInfo
        .split('IOPlatformUUID')[1]
        .split('\n')[0].replace(/\=|\s+|\"/ig, '')
        .toLowerCase();
    case 'win32':
      return machineRawInfo
        .toString()
        .split('REG_SZ')[1]
        .replace(/\r+|\n+|\s+/ig, '')
        .toLowerCase();
    case 'linux':
      return machineRawInfo
        .toString()
        .replace(/\r+|\n+|\s+/ig, '')
        .toLowerCase();
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
};

const getExecCommand = (): string => {
  let command: string;
  if (process.platform === 'win32') {
    let is32 = false;
    try {
      is32 = !!require('fs').statSync('C:\\windows\\sysnative');
      // tslint:disable-next-line:no-empty
    } catch (e) { }
    command = platforms[is32 ? 'ia32' : 'x64'];
  } else {
    command = platforms[process.platform];
  }
  return command;
};

export const machineIdSync = (original: boolean = true): string => {
  let id: string = expose(execSync(getExecCommand()).toString());
  return original ? id : hash(id);
};

export const machineId = (original: boolean = true): Promise<string> => {
  return new Promise((resolve: Function, reject: Function): Object => {
    return exec(getExecCommand(), {}, (err: any, stdout: any, stderr: any) => {
      if (err) {
        return reject(
          new Error(`Error while obtaining machine id: ${err.stack}`)
        );
      }
      let id: string = expose(stdout.toString());
      return resolve(original ? id : hash(id));
    });
  });
};
