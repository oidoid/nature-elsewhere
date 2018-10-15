import * as aseprite from './aseprite.js'
import * as atlas from '../textures/atlas.js'
import * as util from '../util.js'

/**
 * @arg {aseprite.File} file
 * @return {atlas.State}
 */
export function parse(file) {
  return {
    size: file.meta.size,
    animations: parseAnimations(
      file.meta.frameTags,
      file.frames,
      file.meta.slices
    )
  }
}

/**
 * @arg {ReadonlyArray<aseprite.FrameTag>} frameTags
 * @arg {aseprite.FrameMap} frames
 * @arg {ReadonlyArray<aseprite.Slice>} slices
 * @return {atlas.AnimationMap }
 */
export function parseAnimations(frameTags, frames, slices) {
  return frameTags
    .map(frameTag => ({
      [frameTag.name]: parseAnimation(frameTag, frames, slices)
    }))
    .reduce((sum, animations) => ({...sum, ...animations}), {})
}

/**
 * @arg {aseprite.FrameTag} frameTag
 * @arg {aseprite.FrameMap} frames
 * @arg {ReadonlyArray<aseprite.Slice>} slices
 * @return {atlas.Animation}
 */
export function parseAnimation(frameTag, frames, slices) {
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

/**
 * @arg {aseprite.Tag} tag
 * @arg {number} [index]
 * @return {aseprite.TagFrameNumber}
 */
export function marshalTagFrameNumber(tag, index) {
  return `${tag} ${index === undefined ? '' : index}`
}

/**
 *
 * @arg {aseprite.FrameTag} frameTag
 * @arg {aseprite.Frame} frame
 * @arg {number} frameNumber
 * @arg {ReadonlyArray<aseprite.Slice>} slices
 * @return {atlas.Cel}
 */
export function parseCel(frameTag, frame, frameNumber, slices) {
  return {
    bounds: parseTexture(frame),
    duration: parseDuration(frame.duration),
    collision: parseCollision(frameTag, frameNumber, slices)
  }
}

/**
 * @arg {aseprite.Frame} frame
 * @return {Rect}
 */
export function parseTexture(frame) {
  const padding = parsePadding(frame)
  return {
    x: frame.frame.x + padding.w / 2,
    y: frame.frame.y + padding.h / 2,
    w: frame.sourceSize.w,
    h: frame.sourceSize.h
  }
}

/**
 * @arg {aseprite.Frame} frame
 * @return {WH}
 */
export function parsePadding(frame) {
  return {
    w: frame.frame.w - frame.sourceSize.w,
    h: frame.frame.h - frame.sourceSize.h
  }
}

/**
 * @arg {aseprite.Duration} duration
 * @return {number}
 */
export function parseDuration(duration) {
  return duration === aseprite.INFINITE_DURATION
    ? Number.POSITIVE_INFINITY
    : duration
}

/**
 * @arg {aseprite.FrameTag} frameTag
 * @arg {number} frameNumber
 * @arg {ReadonlyArray<aseprite.Slice>} slices
 * @return {ReadonlyArray<Rect>}
 */
export function parseCollision(frameTag, frameNumber, slices) {
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

/**
 * @arg {aseprite.Direction} direction
 * @return {atlas.AnimationDirection}
 */
export function parseAnimationDirection(direction) {
  if (util.values(atlas.AnimationDirection).includes(direction)) {
    return direction
  }
  throw new Error(`"${direction}" is not a Direction.`)
}
