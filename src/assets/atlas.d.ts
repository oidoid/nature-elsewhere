import * as aseprite from './aseprite'

type State = Readonly<{size: WH; animations: AnimationMap}>

type AnimationMap = Readonly<Record<AnimationID, Animation>>

type AnimationID = aseprite.Tag

/** Animation and collision frames. */
type Animation = Readonly<{cels: Cel[]; direction: Direction}>

/** A single cel of animation sequence. */
type Cel = Readonly<{
  /** Texture bounds within the atlas. */
  bounds: Rect
  /** Cel exposure in milliseconds, possibly infinite. */
  duration: number
  /** Collision bounds within the texture. */
  collision: Rect[]
}>

type Direction = aseprite.Direction
