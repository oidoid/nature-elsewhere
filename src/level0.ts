import * as atlas from './assets/atlas'
import * as entity from './entities/entity'
import * as random from './random'
import * as texture from './assets/texture'
import * as util from './util'

type State = Readonly<{player: entity.State; entities: entity.State[]}>

const tallGrassIDs = [
  texture.ID.TALL_GRASS_A,
  texture.ID.TALL_GRASS_B,
  texture.ID.TALL_GRASS_C,
  texture.ID.TALL_GRASS_D,
  texture.ID.TALL_GRASS_E,
  texture.ID.TALL_GRASS_F,
  texture.ID.TALL_GRASS_G,
  texture.ID.TALL_GRASS_H,
  texture.ID.TALL_GRASS_I
]

export function newState(atlas: atlas.State, randomState: random.State): State {
  const entities = [
    ...entity.newPalette3(
      atlas,
      {x: entity.Limits.HALF_MIN, y: entity.Limits.HALF_MIN},
      {x: entity.Limits.MAX, y: entity.Limits.MAX}
    ),
    ...entity.newGrass(
      atlas,
      texture.ID.GRASS_L,
      {x: -100, y: -27},
      {x: 40, y: 1}
    ),
    ...entity.newGrass(
      atlas,
      texture.ID.GRASS_L,
      {x: 208, y: -27},
      {x: 2, y: 1}
    ),
    ...entity.newGrass(atlas, texture.ID.TALL_GRASS_A, {x: 188, y: -15}),
    ...entity.newGrass(atlas, texture.ID.TALL_GRASS_B, {x: 208, y: -15}),
    ...util
      .range(0, 20)
      .map(i => {
        randomState = random.nextIntState(randomState, 0, tallGrassIDs.length)
        return entity.newGrass(
          atlas,
          tallGrassIDs[(<random.NextState>randomState).result],
          {
            x: 228 + i * 4,
            y: -16
          }
        )
      })
      .reduce(util.flatten),
    ...entity.newGrass(
      atlas,
      texture.ID.GRASS_L,
      {x: 228, y: -12},
      {x: 6, y: 1}
    ),
    ...entity.newTree(atlas, {x: 185, y: -39}),
    ...entity.newCloud(atlas, texture.ID.CLOUD_S, {x: 40, y: -60}),
    ...entity.newCloud(atlas, texture.ID.CLOUD_M, {x: 58, y: -76}),
    ...entity.newRainCloud(atlas, texture.ID.CLOUD_S, {x: 75, y: -65}, -0.08),
    ...entity.newCloud(atlas, texture.ID.CLOUD_XL, {x: 120, y: -60}),
    ...entity.newRainCloud(atlas, texture.ID.CLOUD_L, {x: 20, y: -81}, -0.1)
  ]

  const player = entity.newPlayer(atlas, {
    x: 0,
    y: -atlas.animations['player idle'].cels[0].bounds.h - 12
  })[0]
  entities.push(player)
  return {player, entities}
}
