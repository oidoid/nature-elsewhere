import * as animatable from '../textures/animatable.js'
import * as atlas from '../textures/atlas.js'
import * as cloud from '../entities/cloud.js'
import * as drawable from '../textures/drawable.js'
import * as entity from '../entities/entity.js'
import * as player from '../entities/player.js'
import * as rainCloud from '../entities/rain-cloud.js'
import * as superBall from '../entities/super-ball.js'
import * as util from '../util.js'
import {AnimationID} from './animation-id.js'
import {Limits} from '../graphics/limits.js'
import {Random} from '../random.js'
import {Layer} from '../textures/layer.js'

/**
 * @typedef {Readonly<{
 *   player: entity.State
 *   entities: ReadonlyArray<entity.State>
 * }>} Level0
 */

const tallGrassIDs = [
  AnimationID.TALL_GRASS_A,
  AnimationID.TALL_GRASS_B,
  AnimationID.TALL_GRASS_C,
  AnimationID.TALL_GRASS_D,
  AnimationID.TALL_GRASS_E,
  AnimationID.TALL_GRASS_F,
  AnimationID.TALL_GRASS_G,
  AnimationID.TALL_GRASS_H,
  AnimationID.TALL_GRASS_I
]

/**
 * @arg {atlas.Atlas} atlas
 * @arg {Random} random
 * @return {Level0}
 */
export function newState(atlas, random) {
  const animatables = [
    animatable.newState(
      drawable.newState(
        AnimationID.PALETTE_PALE,
        {x: Limits.HALF_MIN, y: Limits.HALF_MIN},
        {x: Limits.MAX, y: Limits.MAX}
      )
    ),
    animatable.newState(
      drawable.newState(AnimationID.GRASS_L, {x: -512, y: -12}, {x: 48, y: 1})
    ),
    animatable.newState(
      drawable.newState(AnimationID.GRASS_L, {x: 208, y: -12}, {x: 2, y: 1})
    ),
    animatable.newState(drawable.newState(AnimationID.HILL, {x: 40, y: -28})),
    animatable.newState(
      drawable.newState(AnimationID.TALL_GRASS_A, {x: 188, y: -15})
    ),
    animatable.newState(
      drawable.newState(AnimationID.TALL_GRASS_B, {x: 208, y: -15})
    ),
    ...util.range(0, 20).map(i => {
      return animatable.newState(
        drawable.newState(tallGrassIDs[random.int(0, tallGrassIDs.length)], {
          x: 228 + i * 4,
          y: -16
        })
      )
    }),
    animatable.newState(
      drawable.newState(AnimationID.GRASS_L, {x: 228, y: -12}, {x: 6, y: 1})
    ),
    animatable.newState(drawable.newState(AnimationID.TREE, {x: 185, y: -39}))
  ]
  const entities = [
    entity.newState(animatables, Layer.BACKGROUND),
    cloud.newState(AnimationID.CLOUD_S, {x: 40, y: -60}),
    cloud.newState(AnimationID.CLOUD_M, {x: 58, y: -76}, {x: -0.0005, y: 0}),
    rainCloud.newState(AnimationID.CLOUD_S, {x: 75, y: -65}, -0.0001),
    cloud.newState(AnimationID.CLOUD_XL, {x: 120, y: -60}),
    rainCloud.newState(AnimationID.CLOUD_L, {x: 20, y: -81}, -0.00008),
    ...util.range(0, 1000).map(i => {
      return superBall.newState(
        {x: (10 + i + random.int(0, 20)) % 80, y: -100 + random.int(0, 50)},
        {x: 0, y: 0.004}
      )
    })
  ]

  const playerState = player.newState({
    x: 0,
    y: -atlas.animations[AnimationID.PLAYER_IDLE].cels[0].bounds.h - 12
  })
  entities.push(playerState)
  return {player: playerState, entities}
}
