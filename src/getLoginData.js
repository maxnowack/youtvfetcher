import normalFs from 'fs';
import os from 'os';
import pify from 'pify';

const fs = pify(normalFs);
const { YOUTV_USERNAME, YOUTV_PASSWORD } = process.env;
const configFile = `${os.homedir()}/.youtvfetcher.json`;

export default async () => {
  if (YOUTV_USERNAME && YOUTV_PASSWORD) {
    return { username: YOUTV_USERNAME, password: YOUTV_PASSWORD };
  }
  await fs.access(configFile, fs.constants.R_OK);
  const content = await fs.readFile(configFile, 'utf8');
  return JSON.parse(content);
};
