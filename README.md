estimator
=========
When we ship log data, we add metadata. Each shipper has slightly different metadata - FluentD vs Infrastructure. Ingestion pipelines also add various metadata - for parsing, for keeping logs in order, and keeping them unique.

This script attempts to show the impact on adding metadata to your logs - and how it impacts the size of logs at rest



# Installation
NodeJS is required to run this package. In order to install dependencies, run:
```
npm install
```

# Usage
<!-- usage -->
```
node ./bin/run calculate --file ./samples/access.log --shipper infra
```

# Commands
<!-- commands -->

argument | options
---------|-------------
--file, -f | Path to a log file. e.g. samples/access.log
--shipper -s | Which shipper are you using to send your logs (options: Logstash, Fluentd, Fluentbit, Infra)

# TODO
* Add support for different cloud based metadata. e.g. shipping via Infra on AWS vs on metal
* Adding support for k8s
* Adding support for basic parsing, like apache logs
