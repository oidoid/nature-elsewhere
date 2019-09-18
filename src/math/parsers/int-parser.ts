export namespace IntParser {
  export function parse(config: number): number {
    if (Number.isInteger(config)) return config
    throw new Error(`Expected integer not "${config}".`)
  }
}
