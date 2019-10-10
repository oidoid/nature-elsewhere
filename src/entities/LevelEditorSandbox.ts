import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue, JSONArray} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {CollisionPredicate} from '../collision/CollisionPredicate'

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
