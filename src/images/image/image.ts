import {AtlasID} from '../../atlas/atlas-id/atlas-id'
import {Animator} from '../animator/animator'
import {Atlas} from '../../atlas/atlas/atlas'
import {DecamillipixelIntXY, IntXY, XY} from '../../math/xy/xy'
import {Layer} from '../layer/layer'
import {Rect} from '../../math/rect/rect'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering. The image may be animated. Each Cel has the same
    size. Specifying a different target width or height than the source
    truncates or repeats the scaled rendered source. Images do not affect
    collision tests but their bounds may be used. */
export interface Image {
  readonly id: AtlasID
  /** Specified in fractional pixel level coordinates. Includes scaling.

      Images.bounds are used to determine when the image is on screen and
      therefor should be drawn, as well as for rendering itself.

      Images.bounds are used for some collision tests (see CollisionPredicate)
      as entity bounds are calculated in part by Image.bounds, ImageRect.bounds,
      and Entity.bounds. */
  readonly bounds: Writable<Rect>
  layer: Layer
  readonly animator: Animator
  /** See bounds. */
  readonly scale: Writable<IntXY>
  /** Specifies the initial marquee offset. */
  readonly wrap: DecamillipixelIntXY
  /** Specifies the additional marquee offset added by the shader according to
      the game clock. */
  readonly wrapVelocity: DecamillipixelIntXY
}

export namespace Image {
  /** Translate by. */
  export function moveBy(image: Image, by: XY): void {
    image.bounds.x += by.x
    image.bounds.y += by.y
  }

  /** Set absolute scale. */
  export function setScale(image: Image, to: XY): void {
    image.bounds.w *= Math.abs(to.x / image.scale.x)
    image.bounds.h *= Math.abs(to.y / image.scale.y)
    image.scale.x = to.x
    image.scale.y = to.y
  }

  /** Multiply by scale. */
  export function scale(image: Image, by: XY): void {
    by = {x: by.x * image.scale.x, y: by.y * image.scale.y}
    Image.setScale(image, by)
  }

  /** For sorting by draw order. E.g., `images.sort(Image.compare)`. See
      Layer. */
  export function compareElevation(
    lhs: Readonly<Image>,
    rhs: Readonly<Image>
  ): number {
    return (
      lhs.layer - rhs.layer ||
      lhs.bounds.y + lhs.bounds.h - (rhs.bounds.y + rhs.bounds.h)
    )
  }

  export function animate(
    image: Image,
    time: Milliseconds,
    atlas: Atlas
  ): void {
    const animator = Animator.animate(
      image.animator.period,
      image.animator.exposure + time,
      atlas[image.id]
    )
    image.animator.period = animator.period
    image.animator.exposure = animator.exposure
  }

  export function cel(image: Readonly<Image>, atlas: Atlas): Atlas.Cel {
    const index = Animator.index(image.animator.period, atlas[image.id].cels)
    return atlas[image.id].cels[index]
  }

  /** Raise or lower by offset. */
  export function elevate(image: Image, offset: Layer): void {
    image.layer += offset
  }
}
