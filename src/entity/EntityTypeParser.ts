import {EntityType} from './EntityType'
import {EntityTypeConfig} from './EntityTypeConfig'

export namespace EntityTypeParser {
  export function parse(config: EntityTypeConfig): EntityType {
    if (Object.values(EntityType).includes(<EntityType>config))
      return <EntityType>config
    throw new Error(`Unknown EntityType "${config}".`)
  }
}
