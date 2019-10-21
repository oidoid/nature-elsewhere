import {AtlasID} from '../atlas/AtlasID'
import {Cursor} from './Cursor'
import {Entity} from '../entity/Entity'
import {EntityCollider} from '../collision/EntityCollider'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Input} from '../inputs/Input'
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

export class Marquee extends Entity<Marquee.Variant, Marquee.State> {
  selectionTriggered: boolean
  private _selection?: Entity
  /** The offset from the top-left of the selection to the cursor when the
      cursor is in "drag mode." Undefined when no selection or not in drag
      mode. */
  private _cursorOffset: Maybe<XY>

  constructor(props?: Entity.SubProps<Marquee.Variant, Marquee.State>) {
    super({
      ...defaults,
      map: {
        [Marquee.State.HIDDEN]: new SpriteRect(),
        [Marquee.State.VISIBLE]: new SpriteRect({
          sprites: [
            new Sprite({
              id: AtlasID.UI_CHECKERBOARD_BLACK_WHITE,
              layer: Layer.UI_HIHI,
              wvx: 20
            }),
            new Sprite({
              id: AtlasID.UI_CHECKERBOARD_BLACK_WHITE,
              layer: Layer.UI_HIHI,
              wvx: 20
            }),
            new Sprite({
              id: AtlasID.UI_CHECKERBOARD_BLACK_WHITE,
              layer: Layer.UI_HIHI,
              wvx: 20
            }),
            new Sprite({
              id: AtlasID.UI_CHECKERBOARD_BLACK_WHITE,
              layer: Layer.UI_HIHI,
              wvx: 20
            })
          ]
        })
      },
      ...props
    })
    this._selection = undefined
    this._cursorOffset = undefined
    this.selectionTriggered = false
  }

  get selection(): Maybe<Entity> {
    return this._selection
  }

  setSelection(selection: Maybe<Entity>, cursor: Cursor): UpdateStatus {
    let status = UpdateStatus.UNCHANGED

    // If the state is now visible, transition prior to trying to manipulate the
    // marquee sprites as they only exist in visible.
    status |= this.transition(
      selection ? Marquee.State.VISIBLE : Marquee.State.HIDDEN
    )

    if (selection) {
      status |= UpdateStatus.UPDATED
      const to = selection.bounds.position.sub(new XY(1, 1))
      status |= this.moveTo(to)
      this._resize(to, selection)
    }

    this._selection = selection
    this._cursorOffset = selection
      ? selection.bounds.position.sub(cursor.bounds.position)
      : new XY(0, 0)
    return status
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    this.selectionTriggered = false
    const {pick} = state.inputs
    if (!pick?.active) {
      this._cursorOffset = undefined // Exit drag mode.
      return status
    }

    const {sandbox} = state.level
    if (!sandbox) return status

    const sandboxChildren = this._sandboxChildrenCollidingWithCursor(
      sandbox,
      state
    )
    const hudCollision = !!EntityCollider.collidesEntities(
      state.level.cursor,
      state.level.hud
    ).length

    const triggered = Input.activeTriggered(state.inputs.pick)
    if (triggered && !hudCollision) {
      const {selection} = this
      const currentIndex = selection
        ? sandboxChildren.findIndex(entity => entity === selection)
        : -1
      const nextIndex = NumberUtil.wrap(
        currentIndex + 1,
        0,
        sandboxChildren.length
      )
      const entity: Maybe<Entity> = sandboxChildren[nextIndex]
      if (selection !== entity) this.selectionTriggered = true
      return this.setSelection(entity, state.level.cursor)
    }

    const {selection} = this
    if (!triggered && selection && this._cursorOffset) {
      const destination = state.level.cursor.bounds.position.add(
        this._cursorOffset
      )
      status |= this.moveTo(destination.sub(new XY(1, 1)))
      status |= selection.moveTo(destination)
      sandbox.invalidateBounds()
      return status | UpdateStatus.UPDATED
    }

    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }

  private _sandboxChildrenCollidingWithCursor(
    sandbox: Entity,
    state: UpdateState
  ): Entity[] {
    const pickCenter = Rect.centerOf(state.level.cursor.bounds)
    return EntityCollider.collidesEntity(state.level.cursor, sandbox).sort(
      compareCentroidTo(pickCenter)
    )
  }

  /** These sprites are only present in the visible state. */
  private _resize(destination: XY, sandboxEntity: Entity): void {
    const marqueeSprites = this.sprites()

    marqueeSprites[Sprites.TOP].moveTo(destination)
    marqueeSprites[Sprites.TOP].sizeTo(
      new WH(sandboxEntity.bounds.size.w + 2, 1)
    )

    marqueeSprites[Sprites.LEFT].moveTo(destination)
    marqueeSprites[Sprites.LEFT].sizeTo(
      new WH(1, sandboxEntity.bounds.size.h + 2)
    )

    marqueeSprites[Sprites.RIGHT].moveTo(
      new XY(destination.x + sandboxEntity.bounds.size.w + 1, destination.y)
    )
    marqueeSprites[Sprites.RIGHT].sizeTo(
      new WH(1, sandboxEntity.bounds.size.h + 2)
    )
    marqueeSprites[Sprites.RIGHT].wrapTo(
      new XY((sandboxEntity.bounds.size.w + 1) & 1 ? 1 : 0, 0)
    )

    marqueeSprites[Sprites.BOTTOM].moveTo(
      new XY(destination.x, destination.y + sandboxEntity.bounds.size.h + 1)
    )
    marqueeSprites[Sprites.BOTTOM].sizeTo(
      new WH(sandboxEntity.bounds.size.w + 2, 1)
    )
    marqueeSprites[Sprites.BOTTOM].wrapTo(
      new XY((sandboxEntity.bounds.size.h + 1) & 1 ? 1 : 0, 0)
    )

    this.invalidateSpriteBounds()
    this.invalidateBounds()
  }
}

export namespace Marquee {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    HIDDEN = 'hidden',
    VISIBLE = 'visible'
  }
}

enum Sprites {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3
}

const defaults = Object.freeze({
  type: EntityType.UI_MARQUEE,
  variant: Marquee.Variant.NONE,
  state: Marquee.State.HIDDEN,
  updatePredicate: UpdatePredicate.ALWAYS
})

function compareCentroidTo(
  to: Readonly<XY>
): (lhs: Readonly<Entity>, rhs: Readonly<Entity>) => number {
  return (lhs, rhs) =>
    Rect.centerOf(lhs.bounds)
      .sub(to)
      .magnitude() -
    Rect.centerOf(rhs.bounds)
      .sub(to)
      .magnitude()
}
