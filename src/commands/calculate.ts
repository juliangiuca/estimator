import {Command, flags} from '@oclif/command'
import ProcessLineByLine from '../ProcessLineByLine'


export default class Calculate extends Command {
  static description = 'What metadata needs to be added to this estimation?'

  static examples = [
    `$ estimator calculate --aws --file ./access.log`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    file: flags.string({
      required: true
    }),
    shipper: flags.string({
      required: true,
      options: ['fluentd', 'fluentbit', 'logstash', 'infra']
    }),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Calculate)

    if (Object.keys(flags).length == 0) console.log('Please run calculate --help to see options available')

    if (flags.file) console.log(`--file is: ${flags.file}`)
    if (flags.shipper) console.log(`--shipper is set to ${flags.shipper}`)

    // let log = new Log(
    new ProcessLineByLine(flags)

  }
}
