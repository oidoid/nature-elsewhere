import {EntityID} from './entity-id.js'
import {Layer} from '../drawables/layer.js'

/** @type {Readonly<Record<EntityID,Layer>>} */
export const EntityLayer = {
  [EntityID.BACKGROUND]: Layer.BACKGROUND,
  [EntityID.CLOUD]: Layer.CLOUDS,
  [EntityID.PLAYER]: Layer.PLAYER,
  [EntityID.POINTER]: Layer.FOREGROUND,
  [EntityID.RAIN_CLOUD]: Layer.CLOUDS,
  [EntityID.SUPER_BALL]: Layer.SUPER_BALL,
  [EntityID.TALL_GRASS_PATCH]: Layer.FOREGROUND_SCENERY,
  [EntityID.TEXT]: Layer.FOREGROUND
}
