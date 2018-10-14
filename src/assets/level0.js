import * as animation from '../entities/animation.js'
import * as atlas from '../entities/atlas.js'
import * as entity from '../entities/entity.js'
import * as factory from '../entities/factory.js'
import * as util from '../util.js'
import Background from '../entities/Background.js'
import Cloud from '../entities/Cloud.js'
import Grass from '../entities/Grass.js'
import Hill from '../entities/Hill.js'
import Player from '../entities/Player.js'
import Random from '../Random.js'
import SuperBall from '../entities/SuperBall.js'
import Tree from '../entities/Tree.js'

/**
 * @typedef {Readonly<{
 *   player: entity.State
 *   entities: ReadonlyArray<entity.State>
 * }>} State
 */

const tallGrassIDs = [
  animation.ID.TALL_GRASS_A,
  animation.ID.TALL_GRASS_B,
  animation.ID.TALL_GRASS_C,
  animation.ID.TALL_GRASS_D,
  animation.ID.TALL_GRASS_E,
  animation.ID.TALL_GRASS_F,
  animation.ID.TALL_GRASS_G,
  animation.ID.TALL_GRASS_H,
  animation.ID.TALL_GRASS_I
]

/**
 * @arg {atlas.State} atlas
 * @arg {Random} randomState
 * @return {State}
 */
export function newState(atlas, randomState) {
  const entities = [
    new Background(
      {x: entity.Limits.HALF_MIN, y: entity.Limits.HALF_MIN},
      {x: entity.Limits.MAX, y: entity.Limits.MAX}
    ),
    new Grass(animation.ID.GRASS_L, {x: -512, y: -12}, {x: 48, y: 1}),
    new Grass(animation.ID.GRASS_L, {x: 208, y: -12}, {x: 2, y: 1}),
    new Hill({x: 40, y: -28}),
    new Grass(animation.ID.TALL_GRASS_A, {x: 188, y: -15}),
    new Grass(animation.ID.TALL_GRASS_B, {x: 208, y: -15}),
    ...util.range(0, 20).map(i => {
      return new Grass(tallGrassIDs[randomState.int(0, tallGrassIDs.length)], {
        x: 228 + i * 4,
        y: -16
      })
    }),
    new Grass(animation.ID.GRASS_L, {x: 228, y: -12}, {x: 6, y: 1}),
    new Tree({x: 185, y: -39}),
    new Cloud({x: 40, y: -60}, animation.ID.CLOUD_S),
    new Cloud({x: 58, y: -76}, animation.ID.CLOUD_M),
    ...factory.newRainCloud(animation.ID.CLOUD_S, {x: 75, y: -65}, -0.0001),
    new Cloud({x: 120, y: -60}, animation.ID.CLOUD_XL),
    ...factory.newRainCloud(animation.ID.CLOUD_L, {x: 20, y: -81}, -0.00008),
    ...util.range(0, 1000).map(i => {
      return new SuperBall(
        {
          x: (10 + i + randomState.int(0, 20)) % 80,
          y: -100 + randomState.int(0, 50)
        },
        {x: 0, y: 0.004}
      )
    })
  ]

  const player = new Player({
    x: 0,
    y: -atlas.animations[animation.ID.PLAYER_IDLE].cels[0].bounds.h - 12
  })
  entities.push(player)
  return {player, entities}
}
