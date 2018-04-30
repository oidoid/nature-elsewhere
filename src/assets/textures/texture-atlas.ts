import * as Aseprite from './aseprite'
import {Rect, WH} from '../../geo'

/** A sprite sheet or composite texture. */
export type TextureAtlas = {
  size: WH
  animations: AnimationMap
}

/** @type {Object.<Tag, Animation>} */
export type AnimationMap = {[tag: string]: Animation}

export type Tag = Aseprite.Tag

/** Animation and collision frames. */
export type Animation = {
  cels: Cel[]
  direction: Aseprite.Direction
}

export type Direction = Aseprite.Direction

export type Cel = {
  /** Texture bounds within the atlas. */
  texture: Rect
  /** Animation length in milliseconds, possibly infinite. */
  duration: number
  /** Collision within the texture. */
  collision: Rect[]
}

export function unmarshal(file: Aseprite.File): TextureAtlas {
  return {
    size: file.meta.size,
    animations: unmarshalAnimations(
      file.meta.frameTags,
      file.frames,
      file.meta.slices
    )
  }
}

export function unmarshalAnimations(
  frameTags: Aseprite.FrameTag[],
  frames: Aseprite.FrameMap,
  slices: Aseprite.Slice[]
): AnimationMap {
  return (
    frameTags
      // Animations[]
      .map(frameTag => ({
        [frameTag.name]: unmarshalAnimation(frameTag, frames, slices)
      }))
      .reduce((sum, animations) => ({...sum, ...animations}), {}) // Animations
  )
}

export function unmarshalAnimation(
  frameTag: Aseprite.FrameTag,
  frames: Aseprite.FrameMap,
  slices: Aseprite.Slice[]
): Animation {
  const cels = []
  for (
    let frameNumber = frameTag.from;
    frameNumber <= frameTag.to;
    ++frameNumber
  ) {
    let tagFrameNumber = marshalTagFrameNumber(frameTag.name, frameNumber)
    let frame = frames[tagFrameNumber]
    if (!frameNumber && frame === undefined) {
      // https://github.com/aseprite/aseprite/issues/1713
      tagFrameNumber = marshalTagFrameNumber(frameTag.name)
      frame = frames[tagFrameNumber]
    }
    const cel = unmarshalCel(frameTag, frame, frameNumber, slices)
    cels.push(cel)
  }

  return {cels, direction: frameTag.direction}
}

export function marshalTagFrameNumber(
  tag: Tag,
  index?: number
): Aseprite.TagFrameNumber {
  return `${tag} ${index === undefined ? '' : index}`
}

export function unmarshalCel(
  frameTag: Aseprite.FrameTag,
  frame: Aseprite.Frame,
  frameNumber: number,
  slices: Aseprite.Slice[]
): Cel {
  return {
    texture: unmarshalTexture(frame),
    duration: unmarshalDuration(frame.duration),
    collision: unmarshalCollision(frameTag, frameNumber, slices)
  }
}

export function unmarshalTexture(frame: Aseprite.Frame): Rect {
  const padding = unmarshalPadding(frame)
  return {
    x: frame.frame.x + padding.w / 2,
    y: frame.frame.y + padding.h / 2,
    w: frame.sourceSize.w,
    h: frame.sourceSize.h
  }
}

export function unmarshalPadding(frame: Aseprite.Frame): WH {
  return {
    w: frame.frame.w - frame.sourceSize.w,
    h: frame.frame.h - frame.sourceSize.h
  }
}

export function unmarshalDuration(duration: Aseprite.Duration): number {
  return duration === Aseprite.INFINITE_DURATION
    ? Number.POSITIVE_INFINITY
    : duration
}

export function unmarshalCollision(
  frameTag: Aseprite.FrameTag,
  frameNumber: number,
  slices: Aseprite.Slice[]
): Rect[] {
  const offset = frameNumber - frameTag.from
  return (
    slices
      // Filter out Slices not for this Tag.
      .filter(slice => slice.name === frameTag.name)
      // For each Slice, get the greatest relevant Key (as a Key[]).
      .map(slice => slice.keys.filter(key => key.frame <= offset).slice(-1))
      .reduce((sum, keys) => sum.concat(keys), []) // Key[]
      .map(key => key.bounds) // Bounds
  )
}