import {Aseprite} from './Aseprite'
import {AtlasID} from './AtlasID'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export interface Atlas extends Readonly<Record<AtlasID, Atlas.Animation>> {}

export namespace Atlas {
  /** A sequence of animation cels. */
  export interface Animation {
    /** Width and height within the source atlas image in integral pixels.
        Dimensions are identical for every cel. */
    readonly size: Readonly<WH>
    readonly cels: readonly Cel[]
    /** Positive animation length in milliseconds for a full cycle, possibly
        infinite. For a ping-pong animation, this is a full traversal forward
        plus the traversal backward excluding the first and last frame. E.g.,
        in a five cel animation, the total duration would be the initial five
        frames plus the middle three frames. */
    readonly duration: Milliseconds
    readonly direction: AnimationDirection
  }

  /** A single frame of an animation sequence. */
  export interface Cel {
    /** Location within the source atlas image in integral pixels. */
    readonly position: Readonly<XY>
    /** Positive cel exposure in integral milliseconds, possibly infinite. */
    readonly duration: Milliseconds
  }

  export import AnimationDirection = Aseprite.AnimationDirection
}
