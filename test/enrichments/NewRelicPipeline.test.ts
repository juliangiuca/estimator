 
import * as chai from 'chai';
chai.use(require('chai-match'));

const expect = chai.expect;
import NewRelicPipeline from '../../src/enrichments/NewRelicPipeline'

describe('Metadata added when received by New Relic', () => {
  it('adds metadata', () => {
    let fixture = {message: "hello world"};

    let output = NewRelicPipeline.addMetadata(fixture);

    expect(output).to.have.property('timestamp')
    expect(output).to.have.property('messageId')
    expect(output).to.have.nested.property('nr.logServiceSource')
    expect(output).to.have.nested.property('newrelic.logs.batchIndex')

  })

  describe('entity enrichment', () => {
    it("should not add anything if there's no service name", () => {
      let fixture = {message: "hello world"};

      let output = NewRelicPipeline.entityLookup(fixture);

      expect(output).to.not.have.property('entity')
    })

    it("should add entity metadata if there's a service name", () => {
      let fixture = {service_name: "hello world"};

      let output = NewRelicPipeline.entityLookup(fixture);

      expect(output).to.have.property('entity')
      expect(output).to.have.nested.property('entity.type')
      expect(output).to.have.nested.property('entity.name')
      expect(output).to.have.nested.property('entity.guid')
      expect(output).to.have.nested.property('entity.guids')
    })

    it('should append entity.guids if one already exists', () => {
      let fixture = {service_name: "hello world", entity: {guids: '123'}};

      let output = NewRelicPipeline.entityLookup(fixture);

      expect(output.entity.guids).to.match(/^123\|\w+/)

    })
  }) //entity enrichment

  describe('json parsing', () => {
    describe("when there's a json string in message", () => {
      it('should add the json object as new keys', () => {

        let json = {foo: true, bar: {zoo: 123, dr: "who"}}
        let stringifiedJson = JSON.stringify(json)
        let fixture = {message: `${stringifiedJson}`}

        let output = NewRelicPipeline.jsonParse(fixture)

        expect(output).to.have.property('foo')
        expect(output).to.have.nested.property('bar.zoo')
      })

      it('should remove the message attribute', () => {
        let json = {foo: true, bar: {zoo: 123, dr: "who"}}
        let stringifiedJson = JSON.stringify(json)
        let fixture = {message: `${stringifiedJson}`}

        let output = NewRelicPipeline.jsonParse(fixture)

        expect(output).to.not.have.property('message')
      })
    }) //when there's a json object in message

    it('will not parse invalid json', () => {
      let json = {foo: true, bar: {zoo: 123, dr: "who"}}
      let stringifiedJson = JSON.stringify(json)
      let fixture = {message: `{${stringifiedJson}`}

      let output = NewRelicPipeline.jsonParse(fixture)

      expect(output).to.have.property('message')
      expect(output).to.not.have.property('foo')
    })
  }) //json parsing

  describe("doZeroRate", () => {
    let fixture: {};

    beforeEach(() => {
      fixture = {
        message: "hello world",
        newrelic: {
          foo: "hello world"
        },
        nr: {
          logServiceSource: 'LogsComingFromVortex'
        }
      }
    })

    it("should remove `newrelic` attributes", () => {
      expect(NewRelicPipeline.doZeroRate(fixture)).to.not.have.property('newrelic')
    })

    it("should remove `nr` attributes", () => {
      expect(NewRelicPipeline.doZeroRate(fixture)).to.not.have.property('nr')
    })

    it("should count message", () => {

      expect(NewRelicPipeline.doZeroRate(fixture)).to.have.property('message')
    })
  })
})
