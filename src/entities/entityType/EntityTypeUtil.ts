import {Entity} from '../entity/Entity'

export namespace EntityTypeUtil {
  export function is<T extends Entity>(
    entity: Entity,
    type: T['type']
  ): entity is T {
    return entity.type === type
  }

  export function assert<T extends Entity>(
    entity: Entity,
    type: T['type']
  ): entity is T {
    const msg = `Unexpected entity type "${entity.type}". Expected "${type}".`
    if (!is(entity, type)) throw new Error(msg)
    return true
  }
}
