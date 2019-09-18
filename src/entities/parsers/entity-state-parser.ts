import {EntityState} from '../../entities/entity-state'
import {EntityStateConfig} from './entity-state-config'

export namespace EntityStateParser {
  export function parse(config: EntityStateConfig): EntityState | string {
    return config || EntityState.HIDDEN
  }
}
