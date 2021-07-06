import {expect} from 'chai'
import Log from '../../src/Log'

describe('Sending logs adds metadata', () => {
  describe('when sent via http', () => {
    it('adds index to every line', () => {
      let fixture = [
        {message: "hello world"}
      ];

      let myLog = new Log(fixture);
      myLog.addMeta('http');
      myLog.doNewRelicPipeline();
      let json = myLog.toJson();

      json.forEach((line) => {
        expect(line).to.have.nested.property('newrelic.logs.batchIndex');
      })
    })
  })

  describe('basic messages', () => {
    it('should have message added', () => {
      let fixture = [
        "hello world"
      ];

      let myLog = new Log(fixture);
      myLog.addMeta('http');
      let json = myLog.toJson();

      json.forEach((line) => {
        expect(line).to.have.property('message', 'hello world');
      })

    })

    it('should not include new relic attributes in the tally', () => {
      let fixture = [
        "hello world"
      ];

      let expected = {
          message: "hello world",
          messageId: '77ff441c-62e9-4811-8eb3-018a774eb594',
          timestamp: '1625286274565',
          nr: {
            logServiceSource: 'LogsComingFromVortex'
          }
      };

      let myLog = new Log(fixture);
      myLog.addMeta('http');
      myLog.doNewRelicPipeline();
      let tally = myLog.tally();

      expect(tally).to.equal(Buffer.byteLength(JSON.stringify(expected)))
    })
  })
})
