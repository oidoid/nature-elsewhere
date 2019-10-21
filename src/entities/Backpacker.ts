import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {NumberUtil} from '../math/NumberUtil'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'
import {DestinationMarker} from './DestinationMarker'
import {Atlas} from 'aseprite-atlas'

export class Backpacker extends Entity<Backpacker.Variant, Backpacker.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Backpacker.Variant.NONE, Backpacker.State>,
    // This reference is passed to all sprites so that any changes affect all
    // character sprites for all states. This orchestration could probably be
    // handled better, possibly with some new state or some way of generating
    // states on the fly, but it's unclear how to change the current system
    // without invalidating a lot of the encapsulation it provides.
    private readonly _size: WH = WH.fromProps(
      atlas.animations[AtlasID.BACKPACKER_IDLE_DOWN].size
    )
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Backpacker.State.IDLE_UP]: newSpriteRect(
          AtlasID.BACKPACKER_IDLE_UP,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.IDLE_LEFT]: newSpriteRect(
          AtlasID.BACKPACKER_IDLE_LEFT,
          // Use vertical shadow to skip horizontal shadow animation.
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.IDLE_RIGHT]: newSpriteRect(
          AtlasID.BACKPACKER_IDLE_RIGHT,
          // Use vertical shadow to skip horizontal shadow animation.
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.IDLE_DOWN]: newSpriteRect(
          AtlasID.BACKPACKER_IDLE_DOWN,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.WALK_UP]: newSpriteRect(
          AtlasID.BACKPACKER_WALK_UP,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.WALK_LEFT]: newSpriteRect(
          AtlasID.BACKPACKER_WALK_LEFT,
          AtlasID.BACKPACKER_WALK_HORIZONTAL_SHADOW,
          _size
        ),
        [Backpacker.State.WALK_RIGHT]: newSpriteRect(
          AtlasID.BACKPACKER_WALK_RIGHT,
          AtlasID.BACKPACKER_WALK_HORIZONTAL_SHADOW,
          _size
        ),
        [Backpacker.State.WALK_DOWN]: newSpriteRect(
          AtlasID.BACKPACKER_WALK_DOWN,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.MELEE_RIGHT]: newSpriteRect(
          AtlasID.BACKPACKER_MELEE_RIGHT,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW, // avoid anim
          _size
        )
      },
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const objective = this._computeObjective(state)

    const {x, y} = this.origin()
    const left = objective.x < x
    const right = objective.x > x
    const up = objective.y < y
    const down = objective.y > y

    this.velocity.x = (left ? -1 : right ? 1 : 0) * 90 // (In one ten-thousandth of a pixel per millisecond (.1 px / s).)
    this.velocity.y = (up ? -1 : down ? 1 : 0) * 90
    const stopped = !this.velocity.magnitude()

    let nextState = this.state()
    if (stopped) {
      nextState = idleStateFor[this.state()]
      hideDestinationMarker(state)
    } else {
      // If already in a horizontal state and further horizontal movement is
      // needed, allow the horizontal state to persist. Otherwise, require some
      // distance to transition. This prevents rapidly oscillating between
      // horizontal and vertical states when on a diagonal boundary.
      const distance = objective.sub(this.origin()).abs()
      const horizontalStatePreferred =
        distance.x &&
        (this.state() === Backpacker.State.WALK_LEFT ||
          this.state() === Backpacker.State.WALK_RIGHT ||
          distance.x > 3)

      if ((left || right) && ((!up && !down) || horizontalStatePreferred))
        nextState = left
          ? Backpacker.State.WALK_LEFT
          : Backpacker.State.WALK_RIGHT
      else if (down) nextState = Backpacker.State.WALK_DOWN
      else if (up) nextState = Backpacker.State.WALK_UP
    }

    status |= this.transition(nextState)

    return status
  }

  collides(entities: readonly Entity[], state: UpdateState): void {
    super.collides(entities, state)
    let collisionType = CollisionType.INERT
    for (const entity of entities) {
      collisionType |= entity.collisionType

      if (entity.collisionType & CollisionType.TYPE_ITEM)
        Entity.removeAny(state.level.parentEntities, entity)
    }

    if (collisionType & CollisionType.OBSTACLE) {
      const idle = idleStateFor[this.state()]
      if (!state.inputs.pick || !state.inputs.pick.active) {
        this.transition(idle)
        hideDestinationMarker(state)
        state.win.navigator.vibrate(1)
      }
    }

    this._submerge(!!(collisionType & CollisionType.DEEP_WATER))
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }

  private _submerge(submerge: boolean): void {
    this._size.h = 16 - (submerge ? 3 : 0)
  }

  private _computeObjective(state: UpdateState): XY {
    const {destination} = state.level

    if (!destination || destination.state() === DestinationMarker.State.HIDDEN)
      return this.origin().copy()

    const {x, y} = destination.origin()
    const objective = new XY(
      NumberUtil.clamp(x, 0, state.level.size.w - this.bounds.size.w),
      NumberUtil.clamp(y, 0, state.level.size.h - this.bounds.size.h)
    )

    // If not already moving, don't pursue objectives practically underfoot.
    const stopped = !this.velocity.magnitude()
    if (stopped && objective.sub(this.origin()).magnitude() < 4)
      return this.origin().copy()

    return objective
  }
}

export namespace Backpacker {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE_UP = 'idleUp',
    IDLE_LEFT = 'idleLeft',
    IDLE_RIGHT = 'idleRight',
    IDLE_DOWN = 'idleDown',
    WALK_UP = 'walkUp',
    WALK_LEFT = 'walkLeft',
    WALK_RIGHT = 'walkRight',
    WALK_DOWN = 'walkDown',
    MELEE_RIGHT = 'meleeRight'
  }
}

function newSpriteRect(
  character: AtlasID,
  shadow: AtlasID,
  size: WH
): SpriteRect {
  return new SpriteRect({
    origin: new XY(6, 14),
    sprites: [
      new Sprite({id: character, size}),
      new Sprite({id: shadow, size, layer: Layer.SHADOW})
    ]
  })
}

function hideDestinationMarker(state: UpdateState): void {
  state.level.destination?.transition(DestinationMarker.State.HIDDEN)
}

/** A mapping of the current state to the appropriate idle state. For example,
    if the backpacker is walking right then stops, the idle right animation is
    mapped. If the backpacker is walking down then stops, the idle down
    animation is mapped. */
const idleStateFor: Readonly<Record<
  Backpacker.State,
  Backpacker.State
>> = Object.freeze({
  [Backpacker.State.IDLE_UP]: Backpacker.State.IDLE_UP,
  [Backpacker.State.IDLE_LEFT]: Backpacker.State.IDLE_LEFT,
  [Backpacker.State.MELEE_RIGHT]: Backpacker.State.IDLE_RIGHT,
  [Backpacker.State.IDLE_RIGHT]: Backpacker.State.IDLE_RIGHT,
  [Backpacker.State.IDLE_DOWN]: Backpacker.State.IDLE_DOWN,
  [Backpacker.State.WALK_UP]: Backpacker.State.IDLE_UP,
  [Backpacker.State.WALK_LEFT]: Backpacker.State.IDLE_LEFT,
  [Backpacker.State.WALK_RIGHT]: Backpacker.State.IDLE_RIGHT,
  [Backpacker.State.WALK_DOWN]: Backpacker.State.IDLE_DOWN
})

const defaults = Object.freeze({
  type: EntityType.BACKPACKER,
  state: Backpacker.State.IDLE_DOWN,
  variant: Backpacker.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType:
    CollisionType.TYPE_CHARACTER |
    CollisionType.TYPE_BACKPACKER |
    CollisionType.HARMFUL |
    CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(2, 12, 4, 3))])
})
