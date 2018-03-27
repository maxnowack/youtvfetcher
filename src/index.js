#!/usr/bin/env node
import stamp from 'console-stamp';
import fs from 'fs';
import './env';
import YouTv from './YouTv';
import getLoginData from './getLoginData';

stamp(console);

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
      console.log(`Already downloaded. Skipping ${title} (${id})`);
      return null;
    }
    console.log(`Downloading ${title} (${id}) …`);
    return recording.download().then((stream) => {
      const endPromise = new Promise(resolve => stream.on('end', () => {
        console.log(`Finished downloading ${title} (${id})`);
        resolve();
      }));
      const dest = fs.createWriteStream(path);
      stream.pipe(dest);
      return endPromise;
    });
  }));
  console.log('finished');
})();
