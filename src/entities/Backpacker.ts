import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {NumberUtil} from '../math/NumberUtil'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {XY} from '../math/XY'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Rect} from '../math/Rect'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {Layer} from '../image/Layer'

export class Backpacker extends Entity<Backpacker.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Backpacker.State>) {
    super({
      type: EntityType.CHAR_BACKPACKER,
      state: Backpacker.State.IDLE_DOWN,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Backpacker.State.IDLE_UP]: new ImageRect({
          origin: new XY(-2, -13),
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BACKPACKER_IDLE_UP}),
            new Image(atlas, {
              id: AtlasID.CHAR_BACKPACKER_WALK_VERTICAL_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        }),
        [Backpacker.State.IDLE_RIGHT]: new ImageRect({
          origin: new XY(-2, -13),
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BACKPACKER_IDLE_RIGHT}),
            new Image(atlas, {
              id: AtlasID.CHAR_BACKPACKER_WALK_VERTICAL_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        }),
        [Backpacker.State.IDLE_DOWN]: new ImageRect({
          origin: new XY(-2, -13),
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BACKPACKER_IDLE_DOWN}),
            new Image(atlas, {
              id: AtlasID.CHAR_BACKPACKER_WALK_VERTICAL_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        }),
        [Backpacker.State.WALK_UP]: new ImageRect({
          origin: new XY(-2, -13),
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BACKPACKER_WALK_UP}),
            new Image(atlas, {
              id: AtlasID.CHAR_BACKPACKER_WALK_VERTICAL_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        }),
        [Backpacker.State.WALK_RIGHT]: new ImageRect({
          origin: new XY(-2, -13),
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BACKPACKER_WALK_RIGHT}),
            new Image(atlas, {
              id: AtlasID.CHAR_BACKPACKER_WALK_RIGHT_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        }),
        [Backpacker.State.WALK_DOWN]: new ImageRect({
          origin: new XY(-2, -13),
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BACKPACKER_WALK_DOWN}),
            new Image(atlas, {
              id: AtlasID.CHAR_BACKPACKER_WALK_VERTICAL_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        })
      },
      updatePredicate: UpdatePredicate.ALWAYS,
      collisionType:
        CollisionType.TYPE_CHARACTER |
        CollisionType.TYPE_BACKPACKER |
        CollisionType.HARMFUL |
        CollisionType.IMPEDIMENT,
      collisionPredicate: CollisionPredicate.BODIES,
      collisionBodies: [Rect.make(2, 12, 4, 3)],
      ...props
    })
  }
  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const destination = computeDestination(this, state)
    if (!destination) return UpdateStatus.UNCHANGED

    const {x, y} = this.bounds.position
    const left = destination.x < x
    const right = destination.x > x
    const up = destination.y < y
    const down = destination.y > y
    this.velocity.x = (left ? -1 : right ? 1 : 0) * 80
    this.velocity.y = (up ? -1 : down ? 1 : 0) * 80

    const idle = !this.velocity.x && !this.velocity.y
    const horizontal = !!Math.abs(destination.x - this.bounds.position.x)

    let nextState = this.machine.state
    if (idle) {
      nextState = computeIdleState(this)
      if (state.level.destination)
        state.level.destination.setState(Entity.BaseState.HIDDEN)
    } else {
      if (up) nextState = Backpacker.State.WALK_UP
      if (down) nextState = Backpacker.State.WALK_DOWN
      if ((left || right) && ((!up && !down) || horizontal))
        nextState = Backpacker.State.WALK_RIGHT
    }

    const scale = this.getScale().copy()
    if (up || down || right) scale.x = Math.abs(scale.x)
    if (left && horizontal) scale.x = -1 * Math.abs(scale.x)

    this.setScale(scale)
    this.setState(nextState)

    return status
  }
}
export namespace Backpacker {
  export enum State {
    IDLE_UP = 'idleUp',
    IDLE_RIGHT = 'idleRight',
    IDLE_DOWN = 'idleDown',
    WALK_UP = 'walkUp',
    WALK_RIGHT = 'walkRight',
    WALK_DOWN = 'walkDown'
  }
  export function collides(
    backpacker: Entity,
    entity: Entity,
    state: UpdateState
  ): void {
    if (entity.collisionType & CollisionType.OBSTACLE) {
      const idle = computeIdleState(backpacker)
      backpacker.setState(idle)
      if (state.level.destination)
        state.level.destination.setState(Entity.BaseState.HIDDEN)
    }
  }
}

function computeIdleState(backpacker: Entity): Backpacker.State {
  switch (backpacker.machine.state) {
    case Backpacker.State.WALK_UP:
    case Backpacker.State.IDLE_UP:
      return Backpacker.State.IDLE_UP
    case Backpacker.State.IDLE_RIGHT:
    case Backpacker.State.WALK_RIGHT:
      return Backpacker.State.IDLE_RIGHT
  }
  return Backpacker.State.IDLE_DOWN
}

function computeDestination(
  backpacker: Backpacker,
  state: UpdateState
): Maybe<XY> {
  if (
    !state.level.destination ||
    state.level.destination.machine.state === Entity.BaseState.HIDDEN
  )
    return
  const {x, y} = state.level.destination.bounds.position.add(
    backpacker.imageRect().origin
  )
  return new XY(
    NumberUtil.clamp(x, 0, state.level.size.w - backpacker.bounds.size.w),
    NumberUtil.clamp(y, 0, state.level.size.h - backpacker.bounds.size.h)
  )
}
