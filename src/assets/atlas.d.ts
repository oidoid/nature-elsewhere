import * as aseprite from './aseprite'

type State = Readonly<{size: WH; animations: AnimationMap}>

type AnimationMap = Readonly<Record<TextureID, Animation>>

type TextureID = aseprite.Tag

/** Animation and collision frames. */
type Animation = Readonly<{cels: Cel[]; direction: aseprite.Direction}>

type Direction = aseprite.Direction

/** A single cel of animation sequence. */
type Cel = Readonly<{
  /** Texture bounds within the atlas. */
  bounds: Rect
  /** Animation length in milliseconds, possibly infinite. */
  duration: number
  /** Collision bounds within the texture. */
  collision: Rect[]
}>
