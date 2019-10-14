import {Entity} from './Entity'
import {EntityConfig} from './EntityParser'
import {JSONObject} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

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
    const defaults: typeof Entity.defaults & typeof subDefaults = {
      ...Entity.defaults,
      state: Entity.BaseState.HIDDEN,
      ...ObjectUtil.definedEntry(subDefaults, 'id'),
      ...ObjectUtil.definedEntry(subDefaults, 'type'),
      ...ObjectUtil.definedEntry(subDefaults, 'variant'),
      ...ObjectUtil.definedEntry(subDefaults, 'position'),
      ...ObjectUtil.definedEntry(subDefaults, 'velocity'),
      ...ObjectUtil.definedEntry(subDefaults, 'imageID'),
      ...ObjectUtil.definedEntry(subDefaults, 'scale'),
      ...ObjectUtil.definedEntry(subDefaults, 'state'),
      ...ObjectUtil.definedEntry(subDefaults, 'updatePredicate'),
      ...ObjectUtil.definedEntry(subDefaults, 'collisionType'),
      ...ObjectUtil.definedEntry(subDefaults, 'collisionPredicate')
    }

    const diff: Writable<EntityConfig> & JSONObject = {type: entity.type}
    if (entity.id !== defaults.id) diff.id = entity.id
    if (entity.variant !== defaults.variant) diff.variant = entity.variant
    if (!entity.bounds.position.equal(defaults.position))
      diff.position = {
        ...(entity.bounds.position.x !== defaults.position.x && {
          x: entity.bounds.position.x
        }),
        ...(entity.bounds.position.y !== defaults.position.y && {
          y: entity.bounds.position.y
        })
      }
    if (!entity.velocity.equal(defaults.velocity))
      diff.velocity = {
        ...(entity.velocity.x !== defaults.velocity.x && {
          x: entity.velocity.x
        }),
        ...(entity.velocity.y !== defaults.velocity.y && {y: entity.velocity.y})
      }
    if (entity.imageID() && entity.imageID() !== defaults.imageID)
      diff.imageID = entity.imageID()
    if (!entity.scale().equal(defaults.scale))
      diff.scale = {
        ...(entity.scale().x !== defaults.scale.x && {x: entity.scale().x}),
        ...(entity.scale().y !== defaults.scale.y && {y: entity.scale().y})
      }
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
