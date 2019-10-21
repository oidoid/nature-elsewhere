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
      Readonly<Entity.SubProps<Variant, State>>,
      'children' | 'map' | 'collisionBodies'
    >
  ): JSONObject {
    const defaults = {...Entity.defaults, ...subDefaults}

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
