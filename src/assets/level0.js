import * as atlas from '../textures/atlas.js'
import * as entity from '../entities/entity.js'
import * as factory from '../entities/factory.js'
import * as util from '../util.js'
import {AnimationID} from '../textures/animation-id.js'
import {Background} from '../entities/background.js'
import {Cloud} from '../entities/cloud.js'
import {Grass} from '../entities/grass.js'
import {Hill} from '../entities/hill.js'
import {Player} from '../entities/player.js'
import {Random} from '../random.js'
import {SuperBall} from '../entities/super-ball.js'
import {Tree} from '../entities/tree.js'

/**
 * @typedef {Readonly<{
 *   player: entity.Entity
 *   entities: ReadonlyArray<entity.Entity>
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
    new Background(
      {x: entity.Limits.HALF_MIN, y: entity.Limits.HALF_MIN},
      {x: entity.Limits.MAX, y: entity.Limits.MAX}
    ),
    new Grass(AnimationID.GRASS_L, {x: -512, y: -12}, {x: 48, y: 1}),
    new Grass(AnimationID.GRASS_L, {x: 208, y: -12}, {x: 2, y: 1}),
    new Hill({x: 40, y: -28}),
    new Grass(AnimationID.TALL_GRASS_A, {x: 188, y: -15}),
    new Grass(AnimationID.TALL_GRASS_B, {x: 208, y: -15}),
    ...util.range(0, 20).map(i => {
      return new Grass(tallGrassIDs[random.int(0, tallGrassIDs.length)], {
        x: 228 + i * 4,
        y: -16
      })
    }),
    new Grass(AnimationID.GRASS_L, {x: 228, y: -12}, {x: 6, y: 1}),
    new Tree({x: 185, y: -39}),
    new Cloud(AnimationID.CLOUD_S, {x: 40, y: -60}),
    new Cloud(AnimationID.CLOUD_M, {x: 58, y: -76}),
    ...factory.newRainCloud(AnimationID.CLOUD_S, {x: 75, y: -65}, -0.0001),
    new Cloud(AnimationID.CLOUD_XL, {x: 120, y: -60}),
    ...factory.newRainCloud(AnimationID.CLOUD_L, {x: 20, y: -81}, -0.00008),
    ...util.range(0, 1000).map(i => {
      return new SuperBall(
        {
          x: (10 + i + random.int(0, 20)) % 80,
          y: -100 + random.int(0, 50)
        },
        {x: 0, y: 0.004}
      )
    })
  ]

  const player = new Player({
    x: 0,
    y: -atlas.animations[AnimationID.PLAYER_IDLE].cels[0].bounds.h - 12
  })
  entities.push(player)
  return {player, entities}
}
