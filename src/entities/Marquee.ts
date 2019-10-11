import {EntityCollider} from '../collision/EntityCollider'
import {Entity} from '../entity/Entity'
import {EntityID} from '../entity/EntityID'
import {Input} from '../inputs/Input'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {XY} from '../math/XY'
import {UpdateState} from '../updaters/UpdateState'
import {WH} from '../math/WH'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {NumberUtil} from '../math/NumberUtil'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Rect} from '../math/Rect'

export class Marquee extends Entity<Marquee.Variant, Marquee.State> {
  selection?: Entity
  private _dragOffset?: Readonly<XY>

  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Marquee.Variant, Marquee.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Marquee.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.UI_CHECKERBOARD_BLACK_WHITE,
              layer: Layer.UI_HIHI,
              wrapVelocity: new XY(20, 0)
            }),
            new Image(atlas, {
              id: AtlasID.UI_CHECKERBOARD_BLACK_WHITE,
              layer: Layer.UI_HIHI,
              wrapVelocity: new XY(20, 0)
            }),
            new Image(atlas, {
              id: AtlasID.UI_CHECKERBOARD_BLACK_WHITE,
              layer: Layer.UI_HIHI,
              wrapVelocity: new XY(20, 0)
            }),
            new Image(atlas, {
              id: AtlasID.UI_CHECKERBOARD_BLACK_WHITE,
              layer: Layer.UI_HIHI,
              wrapVelocity: new XY(20, 0)
            })
          ]
        })
      },
      ...props
    })
    this.selection = undefined
    this._dragOffset = undefined
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const sandbox = Entity.findAnyByID(
      state.level.parentEntities,
      EntityID.UI_LEVEL_EDITOR_SANDBOX
    )
    if (!sandbox) return status

    const {pick} = state.inputs
    if (!pick || !pick.active) {
      this._dragOffset = undefined
      return status
    }

    const hudCollision = EntityCollider.collidesEntities(
      state.level.cursor,
      state.level.hud
    )

    const pickCenter = Rect.centerOf(state.level.cursor.bounds)
    const cursorSandboxCollision = EntityCollider.collidesEntity(
      state.level.cursor,
      sandbox
    ).sort(
      // Sort by centroid.
      (lhs, rhs) =>
        Rect.centerOf(lhs.bounds)
          .sub(pickCenter)
          .magnitude() -
        Rect.centerOf(rhs.bounds)
          .sub(pickCenter)
          .magnitude()
    )
    const triggered = Input.activeTriggered(state.inputs.pick)
    if (!triggered && this.selection && this._dragOffset) {
      const destination = state.level.cursor.bounds.position.add(
        this._dragOffset
      )
      status |= this.moveTo(destination.sub(new XY(1, 1)))
      status |= this.selection.moveTo(destination)
      sandbox.invalidateBounds()
    } else if (
      triggered &&
      !hudCollision.length &&
      cursorSandboxCollision.length
    ) {
      status |= this.transition(Marquee.State.VISIBLE)

      const {selection} = this
      const currentIndex = selection
        ? cursorSandboxCollision.findIndex(entity => entity.equal(selection))
        : -1
      const nextIndex = NumberUtil.wrap(
        currentIndex + 1,
        0,
        cursorSandboxCollision.length
      )
      const sandboxEntity = cursorSandboxCollision[nextIndex] // this won't work correctly for sub-entities
      this.selection = sandboxEntity

      const destination = sandboxEntity.bounds.position.sub(new XY(1, 1))
      status |= this.moveTo(destination)
      resize(this, destination, sandboxEntity)
      this._dragOffset = sandboxEntity.bounds.position.sub(
        state.level.cursor.bounds.position
      )
    } else if (triggered && !hudCollision.length) {
      status |= this.transition(Entity.BaseState.HIDDEN)
      this.selection = undefined
      this._dragOffset = undefined
    }

    return status
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
  }
}

export namespace Marquee {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

enum Images {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3
}

function resize(
  marquee: Marquee,
  destination: XY,
  sandboxEntity: Entity
): void {
  const marqueeImages = marquee.images()

  marqueeImages[Images.TOP].moveTo(destination)
  marqueeImages[Images.TOP].sizeTo(new WH(sandboxEntity.bounds.size.w + 2, 1))

  marqueeImages[Images.LEFT].moveTo(destination)
  marqueeImages[Images.LEFT].sizeTo(new WH(1, sandboxEntity.bounds.size.h + 2))

  marqueeImages[Images.RIGHT].moveTo(
    new XY(destination.x + sandboxEntity.bounds.size.w + 1, destination.y)
  )
  marqueeImages[Images.RIGHT].sizeTo(new WH(1, sandboxEntity.bounds.size.h + 2))
  marqueeImages[Images.RIGHT].wrapTo(
    new XY((sandboxEntity.bounds.size.w + 1) & 1 ? 1 : 0, 0)
  )

  marqueeImages[Images.BOTTOM].moveTo(
    new XY(destination.x, destination.y + sandboxEntity.bounds.size.h + 1)
  )
  marqueeImages[Images.BOTTOM].sizeTo(
    new WH(sandboxEntity.bounds.size.w + 2, 1)
  )
  marqueeImages[Images.BOTTOM].wrapTo(
    new XY((sandboxEntity.bounds.size.h + 1) & 1 ? 1 : 0, 0)
  )
  marquee.invalidateBounds()
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_MARQUEE,
  variant: Marquee.Variant.NONE,
  state: Entity.BaseState.HIDDEN,
  updatePredicate: UpdatePredicate.ALWAYS
})
