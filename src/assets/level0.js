import * as animatable from '../textures/animatable.js'
import * as atlas from '../textures/atlas.js'
import * as drawable from '../textures/drawable.js'
import * as util from '../util.js'
import {AnimationID} from './animation-id.js'
import {Cloud} from '../entities/cloud.js'
import {Entity} from '../entities/entity.js'
import {Limits} from '../graphics/limits.js'
import {Player} from '../entities/player.js'
import {RainCloud} from '../entities/rain-cloud.js'
import {Random} from '../random.js'
import {SuperBall} from '../entities/super-ball.js'

/**
 * @typedef {Readonly<{
 *   player: Entity
 *   entities: ReadonlyArray<animatable.State|Entity>
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
  const entities = [
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
    animatable.newState(drawable.newState(AnimationID.TREE, {x: 185, y: -39})),
    new Cloud(AnimationID.CLOUD_S, {x: 40, y: -60}),
    new Cloud(AnimationID.CLOUD_M, {x: 58, y: -76}, {x: -0.0005, y: 0}),
    new RainCloud(AnimationID.CLOUD_S, {x: 75, y: -65}, -0.0001),
    new Cloud(AnimationID.CLOUD_XL, {x: 120, y: -60}),
    new RainCloud(AnimationID.CLOUD_L, {x: 20, y: -81}, -0.00008),
    ...util.range(0, 1000).map(i => {
      return new SuperBall(
        {x: (10 + i + random.int(0, 20)) % 80, y: -100 + random.int(0, 50)},
        {x: 0, y: 0.004}
      )
    })
  ]

  const player = new Player().setPosition({
    x: 0,
    y: -atlas.animations[AnimationID.PLAYER_IDLE].cels[0].bounds.h - 12
  })
  entities.push(player)
  return {player, entities}
}
