import {Aseprite} from './aseprite'
import {AtlasID} from '../atlas-id/atlas-id'
import {WH} from '../../math/wh/wh'
import {XY} from '../../math/xy/xy'

export interface Atlas extends Readonly<Record<AtlasID, Atlas.Animation>> {}

export namespace Atlas {
  /** Animation frames. */
  export interface Animation {
    /** Width and height within the source atlas image in integral pixels.
        Dimensions are identical for every cel. */
    readonly size: WH
    readonly cels: readonly Cel[]
    /** Positive animation length in milliseconds for a full cycle, possibly
        infinite. For a ping-pong animation, this is a full traversal forward
        plus the traversal backward excluding the first and last frame. */
    readonly duration: Milliseconds
    readonly direction: AnimationDirection
  }

  /** A single frame of an animation sequence. */
  export interface Cel {
    /** Location within the source atlas image in integral pixels. */
    readonly position: XY
    /** Positive cel exposure in milliseconds, possibly infinite. */
    readonly duration: Milliseconds
  }

  export import AnimationDirection = Aseprite.AnimationDirection
}
