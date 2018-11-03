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

/**
 * @arg {atlas.Atlas} atlas
 * @arg {random.State} randomState
 * @return {Level}
 */
export function newState(atlas, randomState) {
  const entities = [
    drawable.newState(
      AnimationID.PALETTE_PALE,
      {x: Limits.HALF_MIN, y: Limits.HALF_MIN},
      {x: Limits.MAX, y: Limits.MAX}
    ),
    drawable.newState(AnimationID.GRASS_L, {x: -512, y: -12}, {x: 480, y: 1}),
    drawable.newState(AnimationID.GRASS_L, {x: 208, y: -12}, {x: 2, y: 1}),
    drawable.newState(AnimationID.HILL, {x: 40, y: -28}),
    drawable.newState(AnimationID.GRASS_L, {x: 228, y: -12}, {x: 6, y: 1}),
    animatable.newState(drawable.newState(AnimationID.TREE, {x: 185, y: -39})),
    tallGrassPatch.newState({x: 188, y: -15}, 1000, randomState),
    drawable.newState(AnimationID.CLOUD_S, {x: 40, y: -60}),
    entity.newState(
      EntityID.CLOUD,
      [animatable.newState(drawable.newState(AnimationID.CLOUD_M))],
      {x: 58, y: -76},
      {x: -0.0005, y: 0}
    ),
    drawable.newState(AnimationID.CLOUD_XL, {x: 120, y: -60}),
    rainCloud.newState(AnimationID.CLOUD_S, {x: 75, y: -65}, -0.0001),
    rainCloud.newState(AnimationID.CLOUD_L, {x: 20, y: -81}, -0.00008),
    ...util.range(0, 1000).map(i => {
      return superBall.newState(
        {
          x: (10 + i + random.int(randomState, 0, 20)) % 80,
          y: -100 + random.int(randomState, 0, 50)
        },
        {x: 0, y: 0.004}
      )
    })
  ]

  const playerState = player.newState({
    x: 0,
    y: -atlas.animations[AnimationID.PLAYER_IDLE].cels[0].bounds.h - 12
  })
  entities.push(playerState)
  return {
    bounds: {x: -512, y: 0, w: 2048, h: 200},
    player: playerState,
    entities
  }
}
