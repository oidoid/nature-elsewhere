import {AtlasID} from '../atlas/AtlasID'
import {Animator} from '../animator/Animator'
import {Atlas} from '../atlas/Atlas'
import {DecamillipixelIntXY, XY} from '../math/XY'
import {Layer} from './Layer'
import {Rect} from '../math/Rect'
import {AlphaComposition} from './AlphaComposition'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering. The image may be animated. Each Cel has the same
    size. Specifying a different target width or height than the source
    truncates or repeats the scaled rendered source. Images do not affect
    collision tests but their bounds may be used. */
export interface Image {
  readonly id: AtlasID
  /** If different than id, use id for masking and imageID for coloring. See
      AlphaComposition. */
  imageID: AtlasID
  /** Specified in fractional pixel level coordinates. Includes scaling.

      Images.bounds are used to determine when the image is on screen and
      therefor should be drawn, as well as for rendering itself.

      Images.bounds are used for some collision tests (see CollisionPredicate)
      as entity bounds are calculated in part by Image.bounds, ImageRect.bounds,
      and Entity.bounds. */
  readonly bounds: Rect
  layer: Layer
  readonly animator: Animator
  /** See bounds. */
  readonly scale: XY
  /** Specifies the initial marquee offset. */
  readonly wrap: DecamillipixelIntXY
  /** Specifies the additional marquee offset added by the shader according to
      the game clock. */
  readonly wrapVelocity: DecamillipixelIntXY
  readonly alphaComposition: AlphaComposition
}

export namespace Image {
  /** Translate by. */
  export function moveBy(image: Image, by: Readonly<XY>): void {
    image.bounds.position.x += by.x
    image.bounds.position.y += by.y
  }

  /** Set absolute scale. */
  export function setScale(image: Image, to: Readonly<XY>): void {
    image.bounds.size.w *= Math.abs(to.x / image.scale.x)
    image.bounds.size.h *= Math.abs(to.y / image.scale.y)
    image.scale.x = to.x
    image.scale.y = to.y
  }

  /** Multiply by scale. */
  export function scale(image: Image, by: Readonly<XY>): void {
    by = new XY(by.x * image.scale.x, by.y * image.scale.y)
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
      lhs.bounds.position.y +
        lhs.bounds.size.h -
        (rhs.bounds.position.y + rhs.bounds.size.h)
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

  /** Raise or lower by offset. */
  export function elevate(image: Image, offset: Layer): void {
    image.layer += offset
  }
}
