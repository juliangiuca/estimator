import {Command, flags} from '@oclif/command'

export default class Hello extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ estimator hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    aws: flags.boolean(),
    file: flags.string(),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Hello)

    if (flags.file) console.log(`--file is: ${flags.file}`)
    if (flags.aws) console.log(`--aws is set`)

  }
}
