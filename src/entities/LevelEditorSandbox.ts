import {Atlas} from 'aseprite-atlas'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Entity} from '../entity/Entity'
import {EntityParser} from '../entity/EntityParser'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONArray} from '../utils/JSON'
import {LocalStorage} from '../storage/LocalStorage'
import {ObjectUtil} from '../utils/ObjectUtil'
import {ReadonlyRect, Rect} from '../math/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'

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
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [LevelEditorSandbox.State.VISIBLE]: new ImageRect()
      },
      ...props
    })
  }

  load(atlas: Atlas, data: string): void {
    const config = JSON.parse(data)
    let sandboxChildren: Entity[] = []
    try {
      sandboxChildren = EntityParser.parseAll(config, atlas)
    } catch (e) {
      console.error(e, data, config)
      LocalStorage.put(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_BACK_UP, data)
    }
    this.addChildren(...sandboxChildren)
  }

  update(state: UpdateState): UpdateStatus {
    return super.update(state, true) // Children are forbidden from updating.
  }

  collidesRect(rect: ReadonlyRect): Entity[] {
    const collisions = []

    // Force bounds collision for children only.
    for (const child of this.children)
      if (Rect.intersects(child.bounds, rect)) collisions.push(child)

    return collisions
  }

  toJSON(): JSONArray {
    return this.children.map(child => child.toJSON())
  }
}

export namespace LevelEditorSandbox {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.LEVEL_EDITOR_SANDBOX,
  variant: LevelEditorSandbox.Variant.NONE,
  state: LevelEditorSandbox.State.VISIBLE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.CHILDREN
})
