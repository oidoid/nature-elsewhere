import {EntityState} from './EntityState'
import {EntityStateConfig} from './EntityStateConfig'

export namespace EntityStateParser {
  export function parse(config: EntityStateConfig): EntityState | string {
    return config || EntityState.HIDDEN
  }
}
