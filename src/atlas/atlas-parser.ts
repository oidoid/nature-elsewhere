import {Aseprite} from './aseprite'
import {Atlas} from './atlas'
import {WH} from '../math/wh'
import {XY} from '../math/xy'
import {ObjectUtil} from '../utils/object-util'

export namespace AtlasParser {
  export const parse = ({meta, frames}: Aseprite.File): Atlas =>
    meta.frameTags.reduce(
      (sum, val) => ({...sum, [val.name]: parseAnimation(val, frames)}),
      {}
    )

  export const parseAnimation = (
    frameTag: Aseprite.FrameTag,
    frames: Aseprite.FrameMap
  ): Atlas.Animation => {
    const cels = tagFrames(frameTag, frames).map(parseCel)

    let duration = cels.reduce((sum, {duration}) => sum + duration, 0)
    const pingPong =
      frameTag.direction === Aseprite.AnimationDirection.PING_PONG
    if (pingPong && cels.length > 2)
      duration += duration - (cels[0].duration + cels[cels.length - 1].duration)

    const size = frames[`${frameTag.name} ${frameTag.from}`].sourceSize
    const direction = parseAnimationDirection(frameTag)
    return {...size, cels, duration, direction}
  }

  const tagFrames = (
    {name, from, to}: Aseprite.FrameTag,
    frames: Aseprite.FrameMap
  ): readonly Aseprite.Frame[] => {
    const ret = []
    for (; from <= to; ++from) ret.push(frames[`${name} ${from}`])
    return ret
  }

  export const parseAnimationDirection = ({
    direction
  }: Aseprite.FrameTag): Atlas.AnimationDirection => {
    if (isAnimationDirection(direction)) return direction
    throw new Error(`"${direction}" is not a Direction.`)
  }

  export const isAnimationDirection = (
    val: string
  ): val is Atlas.AnimationDirection =>
    ObjectUtil.values(Atlas.AnimationDirection).includes(<
      Atlas.AnimationDirection
    >val)

  export const parseCel = (frame: Aseprite.Frame): Atlas.Cel => ({
    ...parsePosition(frame),
    duration: parseDuration(frame.duration)
  })

  export const parsePosition = (frame: Aseprite.Frame): XY => {
    const padding = parsePadding(frame)
    return {x: frame.frame.x + padding.w / 2, y: frame.frame.y + padding.h / 2}
  }

  export const parsePadding = ({frame, sourceSize}: Aseprite.Frame): WH => ({
    w: frame.w - sourceSize.w,
    h: frame.h - sourceSize.h
  })

  export const parseDuration = (duration: Aseprite.Duration): number => {
    const infinite = duration === Aseprite.INFINITE_DURATION
    return infinite ? Number.POSITIVE_INFINITY : duration
  }
}
