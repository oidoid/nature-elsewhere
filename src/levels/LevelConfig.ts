import {CameraConfig} from './CameraConfig'
import {EntityConfig} from '../entity/EntityConfig'
import {LevelTypeConfig} from './LevelTypeConfig'

export interface LevelConfig {
  readonly version: string
  readonly type: LevelTypeConfig
  readonly size: {w: number; h: number}
  readonly minViewport: {w: number; h: number}
  readonly cam?: CameraConfig
  readonly planes: Maybe<readonly EntityConfig[]>
  readonly cursor: EntityConfig
  readonly destination?: EntityConfig
  readonly hud?: Maybe<readonly EntityConfig[]>
  readonly player?: EntityConfig
  readonly sandbox?: EntityConfig
  /** Entities to populate the level. Any children of these entities will be
      considered "active" as a first pass if it's parent root entity is. For
      this reason, favoring shallowing entities is best. Entity composition is
      wanted but it is an antipattern to specify a single root parent entity and
      then lump all other entities underneath it as children. The entity update
      system was designed to allow group update relationships, such as
      translations and collisions, to occur from parent to child by only
      surfacing the root parent.

      It's possible to write level sections as single entities. This is probably
      ok if they do not occupy large areas that span multiple viewports since
      that breaks "active" entity viewport filtering. */
  readonly parentEntities: readonly EntityConfig[]
}
