// import * as fs from 'fs/promises';
// import * as fsSync from 'fs';
// import * as path from 'path';
//import { zip } from 'zip-a-folder';
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const {zip} = require('zip-a-folder');

const packageDistFolder = async () => {
  const outputDirectory = `${process.cwd()}/sast`;
  if (!fsSync.existsSync(outputDirectory)) {
    await fs.mkdir(outputDirectory);
  }
  await zip(
    path.normalize('./dist'),
    `${outputDirectory}/${new Date().toISOString().replace(/:/g, '-').split('.')[0]}_my-file-api-dist.zip`,
  );
};

packageDistFolder();
