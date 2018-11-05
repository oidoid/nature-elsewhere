import * as animatable from '../drawables/animatable.js'
import * as atlas from '../drawables/atlas.js'
import * as drawable from '../drawables/drawable.js'
import * as entity from '../entities/entity.js'
import * as player from '../entities/player.js'
import * as rainCloud from '../entities/rain-cloud.js'
import * as random from '../random.js'
import * as superBall from '../entities/super-ball.js'
import * as tallGrassPatch from '../entities/tall-grass-patch.js'
import * as util from '../util.js'
import {AnimationID} from '../drawables/animation-id.js'
import {Limits} from '../graphics/limits.js'
import {EntityID} from '../entities/entity-id.js'

/** @typedef {import('../level').Level} Level */

const ground = 96

/**
 * @arg {atlas.Atlas} atlas
 * @arg {random.State} randomState
 * @return {Level}
 */
export function newState(atlas, randomState) {
  const bounds = {x: 0, y: 0, w: 2048, h: 128}
  const entities = [
    drawable.newState(
      AnimationID.PALETTE_PALE,
      {x: Limits.HALF_MIN, y: Limits.HALF_MIN},
      {x: Limits.MAX, y: Limits.MAX}
    ),
    drawable.newState(
      AnimationID.GRASS_L,
      {
        x: 0,
        y: ground - atlas.animations[AnimationID.GRASS_L].cels[0].bounds.h
      },
      {x: Limits.MAX, y: 1}
    ),
    drawable.newState(AnimationID.HILL, {
      x: 40,
      y: ground - atlas.animations[AnimationID.HILL].cels[0].bounds.h
    }),
    animatable.newState(
      drawable.newState(AnimationID.TREE, {
        x: 185,
        y: ground - atlas.animations[AnimationID.TREE].cels[0].bounds.h
      })
    ),
    tallGrassPatch.newState(
      {
        x: bounds.x,
        y: ground - atlas.animations[AnimationID.TALL_GRASS_A].cels[0].bounds.h
      },
      bounds.x + bounds.w + 1024,
      randomState
    ),
    drawable.newState(AnimationID.CLOUD_S, {x: 40, y: ground - 40}),
    entity.newState(
      EntityID.CLOUD,
      [animatable.newState(drawable.newState(AnimationID.CLOUD_M))],
      {x: 58, y: ground - 48},
      {x: -0.0005, y: 0}
    ),
    drawable.newState(AnimationID.CLOUD_XL, {x: 120, y: ground - 32}),
    rainCloud.newState(AnimationID.CLOUD_S, {x: 75, y: ground - 54}, -0.0001),
    rainCloud.newState(AnimationID.CLOUD_L, {x: 140, y: ground - 60}, -0.00008),
    ...util.range(0, 1000).map(i => {
      return superBall.newState(
        {
          x: (10 + i + random.int(randomState, 0, 20)) % 80,
          y: ground - 140 + random.int(randomState, 0, 50)
        },
        {x: 0, y: 0.004}
      )
    })
  ]

  const playerState = player.newState({
    x: 16,
    y: ground - atlas.animations[AnimationID.PLAYER_IDLE].cels[0].bounds.h - 1
  })
  entities.push(playerState)
  return {
    bounds,
    player: playerState,
    entities
  }
}
