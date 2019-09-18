import {Rect} from '../math/rect'
import {Animator} from './animator'
import {XY} from '../math/xy'
import {Layer} from './layer'
import {Atlas} from '../atlas/atlas'
import {AnimationID} from '../atlas/animation-id'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering. The image may be animated. Each Cel has the same
    size. Specifying a different target width or height than the source
    truncates or repeats the scaled rendered source. */
export interface Image {
  readonly id: AnimationID
  /** Specified in level coordinates. Includes scaling.

      Images.bounds are used to determine when the image is on screen (and
      therefor) should be drawn as well as rendering itself.

      Images.bounds are used for some collision tests (see CollisionPredicate)
      as entity bounds are in part calculated by Image.bounds, ImageRect.bounds,
      and Entity.bounds. */
  readonly bounds: Writable<Rect>
  layer: Layer
  readonly animator: Animator
  /** In Int units. See bounds. */
  readonly scale: Writable<XY>
  /** Specifies the initial marquee offset. In MillipixelInt units. */
  readonly wrap: XY
  /** Specifies the additional marquee offset added by the shader according to
      the game clock. In MillipixelInt units. */
  readonly wrapVelocity: XY
}

export namespace Image {
  export function moveBy(image: Image, by: XY): void {
    image.bounds.x += by.x
    image.bounds.y += by.y
  }

  export function setScale(image: Image, scale: XY): void {
    image.bounds.w *= Math.abs(scale.x / image.scale.x)
    image.bounds.h *= Math.abs(scale.y / image.scale.y)
    image.scale.x = scale.x
    image.scale.y = scale.y
  }

  export function scale(image: Image, scale: XY): void {
    scale = {x: scale.x * image.scale.x, y: scale.y * image.scale.y}
    Image.setScale(image, scale)
  }

  /** For sorting by draw order. E.g., `images.sort(Image.compare)`. See
      Layer. */
  export function compare(lhs: Readonly<Image>, rhs: Readonly<Image>): number {
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
    const exposure = image.animator.exposure + time
    ;({
      period: image.animator.period,
      exposure: image.animator.exposure
    } = Animator.animate(atlas[image.id], image.animator.period, exposure))
  }

  export function cel(image: Readonly<Image>, atlas: Atlas): Atlas.Cel {
    const index = Animator.index(atlas[image.id].cels, image.animator.period)
    return atlas[image.id].cels[index]
  }
}
