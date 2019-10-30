import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {Entity} from '../../entity/Entity'
import {EntityConfig} from '../../entity/EntityConfig'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {ProcessChildren} from '../../entity/ProcessChildren'
import {ReadonlyRect, Rect} from '../../math/Rect'
import {SpriteRect} from '../../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../../updaters/UpdatePredicate'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/UpdateStatus'

export class LevelEditorSandbox extends Entity<
  LevelEditorSandbox.Variant,
  LevelEditorSandbox.State
> {
  constructor(
    props?: Entity.SubProps<
      LevelEditorSandbox.Variant,
      LevelEditorSandbox.State
    >
  ) {
    super({
      ...defaults,
      map: {
        [LevelEditorSandbox.State.NONE]: new SpriteRect()
      },
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    // Children are forbidden from updating.
    return super.update(state, ProcessChildren.SKIP)
  }

  collidesRect(rect: ReadonlyRect): Entity[] {
    const collisions = []

    // Force bounds collision for children only.
    for (const child of this.children)
      if (Rect.intersects(child.bounds, rect)) collisions.push(child)

    return collisions
  }

  toJSON(): EntityConfig {
    const diff = EntitySerializer.serialize(this, defaults)
    const children = this.children.map(child => child.toJSON())
    return {...diff, children}
  }
}

export namespace LevelEditorSandbox {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.LEVEL_EDITOR_SANDBOX,
  variant: LevelEditorSandbox.Variant.NONE,
  state: LevelEditorSandbox.State.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.CHILDREN
})
