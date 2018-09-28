import * as aseprite from './aseprite'
import * as atlas from '../entities/atlas'

export function parse(file: aseprite.File): atlas.State {
  return {
    size: file.meta.size,
    animations: parseAnimations(
      file.meta.frameTags,
      file.frames,
      file.meta.slices
    )
  }
}

export function parseAnimations(
  frameTags: aseprite.FrameTag[],
  frames: aseprite.FrameMap,
  slices: aseprite.Slice[]
): atlas.AnimationMap {
  return frameTags
    .map(frameTag => ({
      [frameTag.name]: parseAnimation(frameTag, frames, slices)
    }))
    .reduce((sum, animations) => ({...sum, ...animations}), {})
}

export function parseAnimation(
  frameTag: aseprite.FrameTag,
  frames: aseprite.FrameMap,
  slices: aseprite.Slice[]
): atlas.Animation {
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
    const cel = parseCel(frameTag, frame, frameNumber, slices)
    cels.push(cel)
  }

  return {cels, direction: parseAnimationDirection(frameTag.direction)}
}

export function marshalTagFrameNumber(
  animationID: atlas.AnimationID,
  index?: number
): aseprite.TagFrameNumber {
  return `${animationID} ${index === undefined ? '' : index}`
}

export function parseCel(
  frameTag: aseprite.FrameTag,
  frame: aseprite.Frame,
  frameNumber: number,
  slices: aseprite.Slice[]
): atlas.Cel {
  return {
    bounds: parseTexture(frame),
    duration: parseDuration(frame.duration),
    collision: parseCollision(frameTag, frameNumber, slices)
  }
}

export function parseTexture(frame: aseprite.Frame): Rect {
  const padding = parsePadding(frame)
  return {
    x: frame.frame.x + padding.w / 2,
    y: frame.frame.y + padding.h / 2,
    w: frame.sourceSize.w,
    h: frame.sourceSize.h
  }
}

export function parsePadding(frame: aseprite.Frame): WH {
  return {
    w: frame.frame.w - frame.sourceSize.w,
    h: frame.frame.h - frame.sourceSize.h
  }
}

export function parseDuration(duration: aseprite.Duration): number {
  return duration === aseprite.INFINITE_DURATION
    ? Number.POSITIVE_INFINITY
    : duration
}

export function parseCollision(
  frameTag: aseprite.FrameTag,
  frameNumber: number,
  slices: aseprite.Slice[]
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

// todo: remove string when type can be resolved as enum.
function parseAnimationDirection(direction: string): atlas.AnimationDirection {
  if (isDirection(direction)) return direction
  throw new Error(`"${direction}" is not a Direction.`)
}

// todo: remove string when type can be resolved as enum.
function isDirection(direction: string): direction is aseprite.Direction {
  return Object.values(aseprite.Direction).includes(direction)
}
