#!/usr/bin/env node
import fs from 'fs';
import './env';
import YouTv from './YouTv';
import getLoginData from './getLoginData';
import notify from './notify';

const downloadPath = process.argv[2] || '.';

const downloadRecording = (recording, path) => recording.download().then((stream) => {
  const endPromise = new Promise((resolve) => stream.on('end', resolve));
  const dest = fs.createWriteStream(path);
  stream.pipe(dest);
  return endPromise;
});

(async () => {
  const youtv = new YouTv();
  const { username, password } = await getLoginData();
  await youtv.login(username, password);
  const recordings = await youtv.fetchRecordings();
  await Promise.all(recordings.filter((r) => r.isRecorded()).map(async (recording) => {
    const { id, title } = recording;

    const path = `${downloadPath}/${id}_${title}.mp4`;
    if (fs.existsSync(path)) {
      const size = await recording.getSize();
      if (size <= fs.statSync(path).size) {
        notify(`Already downloaded. Skipping ${title} (${id})`);
        return;
      }
      fs.unlinkSync(path);
    }
    notify(`Downloading ${title} (${id}) …`);
    await downloadRecording(recording, path);
    notify(`Finished downloading ${title} (${id})`);
  }));
  notify('finished');
})();
