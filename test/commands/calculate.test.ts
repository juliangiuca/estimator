import {expect, test} from '@oclif/test'

describe('calculate', () => {
  test
  .stdout()
  .command(['calculate'])
  .it('runs calculate --help', ctx => {
    expect(ctx.stdout).to.contain('--help')
  })

  test
  .stdout()
  .command(['calculate', '--aws'])
  .it('runs calculate --aws', ctx => {
    expect(ctx.stdout).to.contain('aws is set')
  })
})
