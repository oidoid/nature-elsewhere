import {EntityID} from './EntityID'
import {EntityIDConfig} from './EntityIDConfig'

export namespace EntityIDParser {
  export function parse(config: EntityIDConfig): EntityID {
    const id = config ?? EntityID.ANONYMOUS
    if (Object.values(EntityID).includes(<EntityID>id)) return <EntityID>id
    throw new Error(`Unknown EntityID "${id}".`)
  }
}
