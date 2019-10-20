export namespace IntParser {
  export function parse(config: number): number {
    if (!Number.isInteger(config))
      throw new Error(`Expected integer not "${config}".`)
    return config
  }
}
