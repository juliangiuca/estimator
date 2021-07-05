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
      let json = myLog.toJson();

      json.forEach((line) => {
        expect(line).to.have.property('index');
      })
    })
  })
})
