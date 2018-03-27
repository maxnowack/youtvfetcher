#!/usr/bin/env node
import fs from 'fs';
import './env';
import YouTv from './YouTv';
import getLoginData from './getLoginData';
import notify from './notify';

const downloadPath = process.argv[2] || '.';

(async () => {
  const youtv = new YouTv();
  const { username, password } = await getLoginData();
  await youtv.login(username, password);
  const recordings = await youtv.fetchRecordings();
  await Promise.all(recordings.filter(r => r.isRecorded()).map((recording) => {
    const { id, title } = recording;
    const path = `${downloadPath}/${id}_${title}.mp4`;
    if (fs.existsSync(path)) {
      notify(`Already downloaded. Skipping ${title} (${id})`);
      return null;
    }
    notify(`Downloading ${title} (${id}) …`);
    return recording.download().then((stream) => {
      const endPromise = new Promise(resolve => stream.on('end', () => {
        notify(`Finished downloading ${title} (${id})`);
        resolve();
      }));
      const dest = fs.createWriteStream(path);
      stream.pipe(dest);
      return endPromise;
    });
  }));
  notify('finished');
})();
