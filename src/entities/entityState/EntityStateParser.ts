import {EntityState} from './EntityState'

export type EntityStateConfig = Maybe<EntityState | string>

export namespace EntityStateParser {
  export function parse(config: EntityStateConfig): EntityState | string {
    return config || EntityState.HIDDEN
  }
}
