import {CollisionPredicateConfig} from '../collision/CollisionPredicateConfig'
import {CollisionTypeConfig} from '../collision/CollisionTypeConfig'
import {Integer} from 'aseprite-atlas'
import {RectConfig} from '../math/RectConfig'
import {SpriteStateMapConfig} from '../spriteStateMachine/SpriteStateMachineConfig'
import {UpdatePredicateConfig} from '../updaters/UpdatePredicateConfig'
import {XYConfig} from '../math/XYConfig'

// See Entity.Props.
export interface EntityConfig {
  readonly id?: string
  readonly type: string
  readonly variant?: string
  readonly position?: XYConfig
  readonly x?: Integer
  readonly y?: Integer
  readonly scale?: XYConfig
  readonly sx?: Integer
  readonly velocity?: XYConfig
  readonly sy?: Integer
  readonly vx?: Integer
  readonly vy?: Integer
  readonly constituentID?: string
  readonly elevation?: number
  readonly state?: string
  readonly map?: SpriteStateMapConfig
  readonly updatePredicate?: UpdatePredicateConfig
  readonly collisionType?: CollisionTypeConfig
  readonly collisionPredicate?: CollisionPredicateConfig
  readonly collisionBodies?: Maybe<readonly RectConfig[]>
  readonly children?: Maybe<readonly EntityConfig[]>
}
