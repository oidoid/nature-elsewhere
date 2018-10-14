import * as animation from '../entities/animation.js'
import * as atlas from '../entities/atlas.js'
import * as entity from '../entities/entity.js'
import * as factory from '../entities/factory.js'
import * as random from '../random.js'
import * as util from '../util.js'

/** @typedef {Readonly<{player: entity.State; entities: ReadonlyArray<entity.State>}>} State */

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
 * @arg {random.Random} randomState
 * @return {State}
 */
export function newState(atlas, randomState) {
  const entities = [
    ...factory.newBackground(
      {x: entity.Limits.HALF_MIN, y: entity.Limits.HALF_MIN},
      {x: entity.Limits.MAX, y: entity.Limits.MAX}
    ),
    ...factory.newGrass(animation.ID.GRASS_L, {x: -512, y: -12}, {x: 48, y: 1}),
    ...factory.newGrass(animation.ID.GRASS_L, {x: 208, y: -12}, {x: 2, y: 1}),
    ...factory.newHill({x: 40, y: -28}),
    ...factory.newGrass(animation.ID.TALL_GRASS_A, {x: 188, y: -15}),
    ...factory.newGrass(animation.ID.TALL_GRASS_B, {x: 208, y: -15}),
    ...util
      .range(0, 20)
      .map(i => {
        return factory.newGrass(
          tallGrassIDs[randomState.int(0, tallGrassIDs.length)],
          {x: 228 + i * 4, y: -16}
        )
      })
      .reduce(util.flatten),
    ...factory.newGrass(animation.ID.GRASS_L, {x: 228, y: -12}, {x: 6, y: 1}),
    ...factory.newTree({x: 185, y: -39}),
    ...factory.newCloud(animation.ID.CLOUD_S, {x: 40, y: -60}),
    ...factory.newCloud(animation.ID.CLOUD_M, {x: 58, y: -76}),
    ...factory.newRainCloud(animation.ID.CLOUD_S, {x: 75, y: -65}, -0.0001),
    ...factory.newCloud(animation.ID.CLOUD_XL, {x: 120, y: -60}),
    ...factory.newRainCloud(animation.ID.CLOUD_L, {x: 20, y: -81}, -0.00008),
    ...util
      .range(0, 1000)
      .map(i => {
        return factory.newSuperBall(
          {
            x: (10 + i + randomState.int(0, 20)) % 80,
            y: -100 + randomState.int(0, 50)
          },
          {x: 0, y: 0.004}
        )
      })
      .reduce(util.flatten)
  ]

  const player = factory.newPlayer({
    x: 0,
    y: -atlas.animations[animation.ID.PLAYER_IDLE].cels[0].bounds.h - 12
  })[0]
  entities.push(player)
  return {player, entities}
}
