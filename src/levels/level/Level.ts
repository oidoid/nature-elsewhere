import {WH} from '../../math/wh/WH'
import {Entity} from '../../entities/entity/Entity'
import {LevelType} from '../levelType/LevelType'
import {Backpacker} from '../../entities/types/backpacker/Backpacker'
import {Cursor} from '../../entities/types/cursor/Cursor'
import {Atlas} from '../../atlas/atlas/Atlas'
import {Camera} from '../camera/Camera'
import {LevelAdvance} from './LevelAdvance'

export interface Level {
  readonly type: LevelType
  /** Usually LevelType.PAUSE_LEVEL. */
  prevLevel?: LevelType
  nextLevel?: LevelType
  advance: LevelAdvance
  readonly size: WH
  readonly minViewport: WH
  readonly cam: Camera
  readonly cursor: Cursor
  readonly player: Maybe<Backpacker>
  readonly destination: Maybe<Entity>
  /** Cursor and player are not included in parentEntities. */
  readonly parentEntities: Entity[]
  readonly atlas: Atlas
}
