//
// add an index as newrelic.logs.batchIndex
// add a UUID key as messageId
// add a source as nr.logServiceSource
// does entity guid matching, if there's a service name
// if the message is a json object, break it out into attributes

interface LooseObject { [key: string]: any }

export default class NewRelicPipeline {
  static zeroRatedAttributes = [
    /^newrelic$/,
    /^nr$/
  ]

  static addMetadata(logLine: LooseObject = {}) {
    logLine.messageId = '77ff441c-62e9-4811-8eb3-018a774eb594'
    logLine.timestamp = logLine.timestamp ?? '1625286274565'

    logLine.nr = logLine.nr ?? {}
    logLine.nr.logServiceSource = 'LogsComingFromVortex'

    logLine.newrelic = logLine.newrelic ?? {}
    logLine.newrelic.logs = logLine.newrelic.logs ?? {}
    logLine.newrelic.logs.batchIndex = 9999

    return logLine
  }

  static entityLookup(logLine: LooseObject = {}) {
    if (logLine.service_name) {
      logLine.entity = logLine.entity ?? {};
      logLine.entity.guid = logLine.entity.guid ?? "NzU2MDUzfEVYVHxTRVJWSUNFfC0zNzc2MTgxMTYyNDI3MDg3NDAw"
      logLine.entity.guids = [logLine.entity.guids, "NzU2MDUzfEVYVHxTRVJWSUNFfC0zNzc2MTgxMTYyNDI3MDg3NDAw"].join('|')
      logLine.entity.name = "synthticMonitor-Production"
      logLine.entity['type'] =  "SERVICE"
    }

    return logLine
  }

  static filter(logLine: LooseObject) {
    return logLine
  }

  static jsonParse(logLine: LooseObject = {}) {
    let jsonFromMessage: LooseObject = {}

    if (logLine.message) {
      try {
        jsonFromMessage = JSON.parse(logLine.message);
        delete logLine.message
      } catch (e) {
      }
    }

    Object.keys(jsonFromMessage).forEach((key) => {
      logLine[key] = jsonFromMessage[key];
    })

    return logLine
  }

  static grokParse(logLine: LooseObject) {
    return logLine
  }

  static logPatternEnrichment(logLine: LooseObject) {

    logLine.newrelic = logLine.newrelic ?? {}
    logLine.newrelic.logPattern = logLine.newrelic.logPattern ?? "nr.DID_NOT_MATCH"

    return logLine
  }

  static doPipeline(logLine: LooseObject) {
    let parsedLogLine: LooseObject;
    parsedLogLine = NewRelicPipeline.addMetadata(logLine)
    parsedLogLine = NewRelicPipeline.filter(parsedLogLine)
    parsedLogLine = NewRelicPipeline.jsonParse(parsedLogLine)
    parsedLogLine = NewRelicPipeline.logPatternEnrichment(parsedLogLine)
    parsedLogLine = NewRelicPipeline.entityLookup(parsedLogLine)
    parsedLogLine = NewRelicPipeline.grokParse(parsedLogLine)
    return parsedLogLine
  }

  static doZeroRate(logLine: LooseObject) {
    let sanitized = logLine;

    NewRelicPipeline.zeroRatedAttributes.forEach((attr) => {
      Object.keys(logLine).forEach((key) => {
        if (key.match(attr)) delete sanitized[key]
      })

    })
    return sanitized
  }

  static doCalculate(logLine: LooseObject) {

    let sanitized = NewRelicPipeline.doZeroRate(logLine);
    return Buffer.byteLength(JSON.stringify(sanitized))
  }

}
