Estimator
=========
Log data is noisy. We need to add metadata in order to improve the value of logs. By adding metadata we also increase the size of logs. Each shipper has it's own metadata that's added - and each bit of metadata has different tradeoffs of value.

This script attempts to show the impact on adding metadata to your logs - and how it impacts the size of logs at rest.



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
--help, -h | A place to start
--file, -f | Path to a log file. e.g. samples/access.log
--shipper -s | Which shipper are you using to send your logs (options: Logstash, Fluentd, Fluentbit, Infra)

# TODO
* Add support for different cloud based metadata. e.g. shipping via Infra on AWS vs on metal
* Add support for k8s
* Add support for basic parsing, like apache logs
* Add support for Logs in Context (e.g. Java)
