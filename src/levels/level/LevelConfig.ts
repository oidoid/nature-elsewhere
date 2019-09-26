import {WH} from '../../math/wh/WH'
import {EntityConfig} from '../../entities/entity/EntityParser'
import {CameraConfig} from '../camera/CameraParser'
import {LevelTypeConfig} from '../levelType/LevelTypeParser'

export interface LevelConfig {
  readonly type: LevelTypeConfig
  /** The level shown when escape or back is pressed. Usually
      LevelType.PAUSE_LEVEL. For the initial level, this is undefined. */
  readonly prevLevel?: LevelTypeConfig
  /** The level shown when the current level is completed. For the last level,
      this is undefined. */
  readonly nextLevel?: LevelTypeConfig
  readonly size: WH
  readonly minViewport: WH
  readonly cam?: CameraConfig
  readonly cursor: EntityConfig
  readonly destination?: EntityConfig
  readonly player?: EntityConfig
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
