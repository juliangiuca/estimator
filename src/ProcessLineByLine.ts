const fs = require('fs');
const readline = require('readline');
import * as Table from 'cli-table3';
import Log from './Log'

interface CliArgs {
  file: string
  shipper: string
}
function formatBytes(a:number ,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}

export default class ProcessLineByLine {
  file: string;
  shipper: string;
  buffer: string[];
  originalTally = 0;
  newRelicTally = 0;
  counter = 0;

  constructor ({file, shipper}: CliArgs) {
    this.buffer = [];
    this.file = file;
    this.shipper = shipper

    let input = fs.createReadStream(this.file);

    const rl = readline.createInterface({
      input: input,
      crlfDelay: Infinity
    });

    rl.on('line', (line: string) => {
      this.counter = this.counter + 1;
      this.originalTally = this.originalTally + Buffer.byteLength(line);
      this.buffer.push(line)
      if (this.buffer.length < 1000) this.doProcessBatch()
    });

    input.on('end', () => {
      var table = new Table({
        head: ['Source', 'Size']
    });
      formatBytes
      table.push(
          ['Original',       formatBytes(this.originalTally)],
          ['On disk size',   formatBytes(fs.statSync(this.file).size)],
          ['in New Relic', formatBytes(this.newRelicTally)],
          [{
            colSpan: 2,
            content: `file: ${this.file}, shipper: ${this.shipper}`
          }]
      );

      console.log(table.toString());
    });
  }

  doProcessBatch() {
    let log = new Log(this.buffer)
    log.addMeta(this.shipper)
    this.newRelicTally = this.newRelicTally + log.tally();

    this.buffer = [];
  }

}

