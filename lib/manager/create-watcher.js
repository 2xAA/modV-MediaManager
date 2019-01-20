import chokidar from 'chokidar';
import os from 'os';
import store from '../store';
import log from './log';

export default function createWatcher() {
  return new Promise((resolve, reject) => {
    if (this.watcher) this.watcher.close();

    this.watcher = chokidar.watch(this.mediaDirectoryPath, {
      ignored: [
        os.platform() === 'darwin' ? /(^|[/\\])\../ : undefined,
        /node_modules/,
        '**/package.json',
        '**/package-lock.json',
      ].concat(store.getters['readHandlers/ignored']),
    });

    this.watcher
      .on('add', (filePath) => {
        this.readFile(filePath);
      })
      .on('change', (filePath) => {
        log(`🔄  File ${filePath} has been changed`);
        this.readFile(filePath);
      })
      .on('unlink', (filePath) => {
        log(`➖  File ${filePath} has been removed`);
        this.removeFile(filePath);
      })
      // .on('addDir', (changedPath) => {
      //   log(`➕  Directory ${changedPath} has been added`);
      //   const seperated = changedPath.split(path.sep);

      //   if (seperated[seperated.length - 2] === this.mediaFolderName) {
      //     this.addProfile(seperated[seperated.length - 1]);
      //   }
      // })
      // .on('unlinkDir', (changedPath) => {
      //   log(`➖  Directory ${changedPath} has been removed`);

      //   const seperated = changedPath.split(path.sep);

      //   if (seperated[seperated.length - 2] === this.mediaFolderName) {
      //     this.removeProfile(seperated[seperated.length - 1]);
      //   }
      // })
      .on('ready', () => {
        resolve();
      });
  });
}
