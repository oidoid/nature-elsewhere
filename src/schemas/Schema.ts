import * as AtlasID from './atlas/AtlasID.schema.json'
import * as CollisionPredicate from './collision/CollisionPredicate.schema.json'
import * as Cloud from './entities/kinds/Cloud.schema.json'
import * as Cursor from './entities/kinds/Cursor.schema.json'
import * as AnyEntity from './entities/AnyEntity.schema.json'
import * as Entity from './entities/Entity.schema.json'
import * as EntityID from './entities/EntityID.schema.json'
import * as EntityKind from './entities/EntityKind.schema.json'
import * as EntityState from './entities/EntityState.schema.json'
import * as Animator from './images/Animator.schema.json'
import * as Image from './images/Image.schema.json'
import * as ImageRect from './images/ImageRect.schema.json'
import * as ImageScale from './images/ImageScale.schema.json'
import * as ImageStateMachine from './images/ImageStateMachine.schema.json'
import * as ImageStateMap from './images/ImageStateMap.schema.json'
import * as Layer from './images/Layer.schema.json'
import * as Camera from './levels/Camera.schema.json'
import * as Level from './levels/Level.schema.json'
import * as LevelKind from './levels/LevelKind.schema.json'
import * as I16XY from './math/I16XY.schema.json'
import * as Rect from './math/Rect.schema.json'
import * as WH from './math/WH.schema.json'
import * as XY from './math/XY.schema.json'
import * as I16 from './types/I16.schema.json'
import * as UpdaterKind from './updaters/UpdaterKind.schema.json'
import * as UpdatePredicate from './updaters/UpdatePredicate.schema.json'

export const Definition = Object.freeze({
  AtlasID,
  CollisionPredicate,
  Cloud,
  Cursor,
  AnyEntity,
  Entity,
  EntityID,
  EntityKind,
  EntityState,
  Animator,
  Image,
  ImageRect,
  ImageScale,
  ImageStateMachine,
  ImageStateMap,
  Layer,
  Camera,
  Level,
  LevelKind,
  I16XY,
  Rect,
  WH,
  XY,
  I16,
  UpdaterKind,
  UpdatePredicate
})
export type Definition = ValueOf<typeof Definition>

export const Schema = Object.freeze(
  Object.values(Definition).reduce(
    (schema, definition) => ({...schema, [definition.$id]: definition}),
    {}
  )
)
