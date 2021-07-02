export {run} from '@oclif/command'

import * as fs from 'fs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: fs.createReadStream('sample.txt'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});


