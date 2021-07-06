import NewRelicPipeline from './enrichments/NewRelicPipeline'

interface LooseObject { [key: string]: any }

type StubObjectFunction = (a: LooseObject) => LooseObject;
type StubNumberFunction = (a: LooseObject) => number;


class LogLine {
  log: LooseObject = {};

  constructor(log: LooseObject | String) {
    if (typeof log == "string") log = {message: log}
    this.log = log
  }

  merge(metaData: LooseObject = {}) {
    Object.keys(metaData).forEach((key) => {
      this.log[key] = metaData[key]
    })
  }

  toJson() {
    return this.log
  }

  //Ok, so you're probably asking - why have this very vague function to take a function?
  //My thinking is our pipeline receives logs as an array, 
  //and each log line has something acted onto it. Well, the Log object is that array
  //so the things acting on it are passed as a function
  doFunc(fn: StubObjectFunction) {
    this.log = fn(this.log)
  }

  tally(fn: StubNumberFunction) {
    return fn(this.log)
  }

}

export default class Log {
  logLines: LogLine[];

  constructor(logLines = [{}]) {

    this.logLines = [];

    logLines.forEach((logLine) => {
      this.logLines.push(new LogLine(logLine))
    })
  }

  addMeta(method: string) {

    let meta = require(`./enrichments/${method}`);

    this.logLines.forEach((logLine, i) => {
      logLine.merge(meta);
    })
  }

  doNewRelicPipeline() {
    this.logLines.forEach((logLine, i) => {
      logLine.doFunc(NewRelicPipeline.do)
    })
  }

  toJson() {
    return this.logLines.map((logLine) => {
      return logLine.toJson()
    })
  }

  tally() {
    return this.logLines.reduce((accumulator, line) => {
      return accumulator + line.tally(NewRelicPipeline.doCalculate);
    }, 0)
  }

};



