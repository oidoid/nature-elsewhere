import {UpdateStatus} from '../../updaters/UpdateStatus'
import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'
import {Rect} from '../../math/Rect'
import {SpriteRect} from '../../spriteStateMachine/SpriteRect'
import {WH} from '../../math/WH'
import {JSONValue} from '../../utils/JSON'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {Sprite} from '../../sprite/Sprite'

/** A special kind of sprite group. Only origin is sized but the rest behave like sprites.
 * 
   ┌──┼──┼──┐
   │NW│N │NE│
   ┼──┼──┼──┼
   │W │O │E │
   ┼──┼──┼──┼
   │SW│S │SE│
   └──┼──┼──┘
   
   Corners are never resized but may be moved.
  When the width changes, O, N, and S change size and NE, E, and SE move.
  When the hieght changes, O, W, and E change size and SW, S, and SE move.
  the origin patch has no relation to Entity.origin
*/
export class NinePatch extends Entity<NinePatch.Variant, NinePatch.State> {
  constructor(props?: NinePatch.Props) {
    super({
      ...defaults,
      map: {
        [NinePatch.State.NONE]: new SpriteRect({
          sprites: patchesToSprites(props?.patches)
        })
      },
      children: props?.children || defaults.children,
      ...props
    })

    if (props?.size !== undefined) this.sizeTo(props.size)
    else this.invalidatePatches()
  }

  originPatch(): Rect {
    return {
      position: this.bounds.position.add({
        x: Math.max(
          this.sprites[NinePatch.Patch.NORTH_WEST]?.bounds.size.w ?? 0,
          this.sprites[NinePatch.Patch.WEST]?.bounds.size.w ?? 0,
          this.sprites[NinePatch.Patch.SOUTH_WEST]?.bounds.size.w ?? 0
        ),
        y: Math.max(
          this.sprites[NinePatch.Patch.NORTH_WEST]?.bounds.size.h ?? 0,
          this.sprites[NinePatch.Patch.NORTH]?.bounds.size.h ?? 0,
          this.sprites[NinePatch.Patch.NORTH_EAST]?.bounds.size.h ?? 0
        )
      }),
      size: new WH(
        Math.max(
          this.sprites[NinePatch.Patch.NORTH]?.bounds.size.w ?? 0,
          this.sprites[NinePatch.Patch.ORIGIN]?.bounds.size.w ?? 0,
          this.sprites[NinePatch.Patch.SOUTH]?.bounds.size.w ?? 0
        ),
        Math.max(
          this.sprites[NinePatch.Patch.WEST]?.bounds.size.h ?? 0,
          this.sprites[NinePatch.Patch.ORIGIN]?.bounds.size.h ?? 0,
          this.sprites[NinePatch.Patch.EAST]?.bounds.size.h ?? 0
        )
      )
    }
  }

  /** Repositions all patches because of size change */
  invalidatePatches(): void {
    // Patches are optional but origin is the most likely to exist. Base all
    // measurements on it.
    const origin = this.originPatch()

    this.sprites[NinePatch.Patch.NORTH_WEST]?.moveTo(
      origin.position.sub({
        x: this.sprites[NinePatch.Patch.NORTH_WEST].bounds.size.w,
        y: this.sprites[NinePatch.Patch.NORTH_WEST].bounds.size.h
      })
    )
    this.sprites[NinePatch.Patch.NORTH]?.moveTo(
      origin.position.sub({
        x: 0,
        y: this.sprites[NinePatch.Patch.NORTH].bounds.size.h
      })
    )
    this.sprites[NinePatch.Patch.NORTH_EAST]?.moveTo(
      origin.position.add({
        x: origin.size.w,
        y: -this.sprites[NinePatch.Patch.NORTH_EAST].bounds.size.h
      })
    )

    this.sprites[NinePatch.Patch.WEST]?.moveTo(
      origin.position.sub({
        x: this.sprites[NinePatch.Patch.WEST].bounds.size.w,
        y: 0
      })
    )
    this.sprites[NinePatch.Patch.ORIGIN]?.moveTo(origin.position)
    this.sprites[NinePatch.Patch.EAST]?.moveTo(
      origin.position.add({x: origin.size.w, y: 0})
    )

    this.sprites[NinePatch.Patch.SOUTH_WEST]?.moveTo(
      origin.position.add({
        x: -this.sprites[NinePatch.Patch.SOUTH_WEST].bounds.size.w,
        y: origin.size.h
      })
    )
    this.sprites[NinePatch.Patch.SOUTH]?.moveTo(
      origin.position.add({x: 0, y: origin.size.h})
    )
    this.sprites[NinePatch.Patch.SOUTH_EAST]?.moveTo(
      origin.position.add({x: origin.size.w, y: origin.size.h})
    )

    this.invalidateBounds()
  }

  sizeOriginTo(to: Readonly<WH>): UpdateStatus {
    const origin = this.originPatch().size
    if (origin.equal(to)) return UpdateStatus.UNCHANGED

    this.sprites[NinePatch.Patch.ORIGIN]?.sizeTo(to)

    this.sprites[NinePatch.Patch.EAST]?.sizeTo(
      new WH(this.sprites[NinePatch.Patch.EAST].bounds.size.w, to.h)
    )
    this.sprites[NinePatch.Patch.WEST]?.sizeTo(
      new WH(this.sprites[NinePatch.Patch.WEST].bounds.size.w, to.h)
    )

    this.sprites[NinePatch.Patch.NORTH]?.sizeTo(
      new WH(to.w, this.sprites[NinePatch.Patch.NORTH].bounds.size.h)
    )
    this.sprites[NinePatch.Patch.SOUTH]?.sizeTo(
      new WH(to.w, this.sprites[NinePatch.Patch.SOUTH].bounds.size.h)
    )

    this.invalidatePatches()
    return UpdateStatus.UPDATED
  }

  sizeTo(to: Readonly<WH>): UpdateStatus {
    const remainder = new WH(
      Math.max(
        0,
        to.w -
          (this.sprites[NinePatch.Patch.EAST]?.bounds.size.w ?? 0) -
          (this.sprites[NinePatch.Patch.WEST]?.bounds.size.w ?? 0)
      ),
      Math.max(
        0,
        to.h -
          (this.sprites[NinePatch.Patch.NORTH]?.bounds.size.h ?? 0) -
          (this.sprites[NinePatch.Patch.SOUTH]?.bounds.size.h ?? 0)
      )
    )
    return this.sizeOriginTo(remainder)
  }

  toJSON(): JSONValue {
    const diff = EntitySerializer.serialize(this, defaults)
    const size = this.originPatch().size
    if (size.w || size.h) {
      diff.size = {}
      if (size.w) diff.size.w = size.w
      if (size.h) diff.size.h = size.h
    }
    return diff
  }
}

export namespace NinePatch {
  export enum Variant {
    NONE = 'none '
  }

  export enum State {
    NONE = 'none '
  }

  export interface Props extends Entity.SubProps<Variant, State> {
    /** If specified,  */
    size?: Readonly<WH>
    patches?: PatchesProp
  }

  export type PatchesProp = Maybe<Readonly<Partial<Record<Patch, Sprite>>>>

  export enum Patch {
    ORIGIN,
    NORTH,
    EAST,
    SOUTH,
    WEST,
    NORTH_EAST,
    SOUTH_EAST,
    SOUTH_WEST,
    NORTH_WEST
  }
}

function patchesToSprites(patches: NinePatch.PatchesProp): Sprite[] {
  const array: Sprite[] = []
  for (const index of Object.keys(patches ?? {})) {
    const sprite = patches?.[<NinePatch.Patch>(<unknown>index)]
    if (sprite) array[<NinePatch.Patch>(<unknown>index)] = sprite
  }
  return array
}

const defaults = Object.freeze({
  type: EntityType.NINE_PATCH,
  variant: NinePatch.Variant.NONE,
  state: NinePatch.State.NONE,
  children: []
})
