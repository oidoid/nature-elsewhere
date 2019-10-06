import {Assert} from '../utils/Assert'

export namespace IntParser {
  export function parse(config: number): number {
    Assert.assert(Number.isInteger(config), `Expected integer not "${config}".`)
    return config
  }
}
