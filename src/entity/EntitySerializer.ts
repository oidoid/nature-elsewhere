import {Entity} from './Entity'
import {EntityConfig} from './EntityConfig'
import {JSONObject} from '../utils/JSON'

export namespace EntitySerializer {
  export function serialize<
    Variant extends string = string,
    State extends string = string
  >(
    entity: Entity<Variant, State>,
    subDefaults: Omit<
      DeepImmutable<Entity.SubProps<Variant, State | Entity.BaseState>>,
      'children' | 'map' | 'collisionBodies'
    >
  ): JSONObject {
    const defaults: Writable<typeof Entity.defaults & typeof subDefaults> = {
      ...Entity.defaults,
      state: Entity.BaseState.HIDDEN
    }
    if (subDefaults.id !== undefined) defaults.id = subDefaults.id
    if (subDefaults.type !== undefined) defaults.type = subDefaults.type
    if (subDefaults.variant !== undefined)
      defaults.variant = subDefaults.variant
    if (subDefaults.position !== undefined)
      defaults.position = subDefaults.position
    if (subDefaults.velocity !== undefined)
      defaults.velocity = subDefaults.velocity
    if (subDefaults.constituentID !== undefined)
      defaults.constituentID = subDefaults.constituentID
    if (subDefaults.scale !== undefined) defaults.scale = subDefaults.scale
    if (subDefaults.state !== undefined) defaults.state = subDefaults.state
    if (subDefaults.updatePredicate !== undefined)
      defaults.updatePredicate = subDefaults.updatePredicate
    if (subDefaults.collisionType !== undefined)
      defaults.collisionType = subDefaults.collisionType
    if (subDefaults.collisionPredicate !== undefined)
      defaults.collisionPredicate = subDefaults.collisionPredicate

    const diff: Writable<EntityConfig> & JSONObject = {type: entity.type}
    if (entity.id !== defaults.id) diff.id = entity.id
    if (entity.variant !== defaults.variant) diff.variant = entity.variant
    if (entity.bounds.position.x !== defaults.position.x)
      diff.x = entity.bounds.position.x
    if (entity.bounds.position.y !== defaults.position.y)
      diff.y = entity.bounds.position.y
    if (entity.velocity.x !== defaults.velocity.x) diff.vx = entity.velocity.x
    if (entity.velocity.y !== defaults.velocity.y) diff.vy = entity.velocity.y
    if (
      entity.constituentID() !== undefined &&
      entity.constituentID() !== defaults.constituentID
    )
      diff.constituentID = entity.constituentID()
    if (entity.scale().x !== defaults.scale.x) diff.sx = entity.scale().x
    if (entity.scale().y !== defaults.scale.y) diff.sy = entity.scale().y
    if (entity.state() !== defaults.state) diff.state = entity.state()
    if (entity.updatePredicate !== defaults.updatePredicate)
      diff.updatePredicate = entity.updatePredicate
    if (entity.collisionType !== defaults.collisionType)
      diff.collisionType = entity.collisionType
    if (entity.collisionPredicate !== defaults.collisionPredicate)
      diff.collisionPredicate = entity.collisionPredicate
    return diff
  }
}
