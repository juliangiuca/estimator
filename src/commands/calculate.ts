import {Command, flags} from '@oclif/command'

export default class Calculate extends Command {
  static description = 'What metadata needs to be added to this estimation?'

  static examples = [
    `$ estimator calculate --aws --file ./access.log`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    aws: flags.boolean(),
    file: flags.string(),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Calculate)

    if (Object.keys(flags).length == 0) console.log('Please run calculate --help to see options available')

    if (flags.file) console.log(`--file is: ${flags.file}`)
    if (flags.aws) console.log(`--aws is set`)

  }
}
