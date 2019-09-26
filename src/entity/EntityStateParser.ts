import {Entity} from './Entity'

export type EntityStateConfig = Maybe<Entity.State | string>

export namespace EntityStateParser {
  export function parse(config: EntityStateConfig): Entity.State | string {
    return config || Entity.State.HIDDEN
  }
}
