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
  readonly x?: Integer
  readonly y?: Integer
  readonly position?: XYConfig
  readonly vx?: Integer
  readonly vy?: Integer
  readonly velocity?: XYConfig
  readonly constituentID?: string
  readonly sx?: Integer
  readonly sy?: Integer
  readonly scale?: XYConfig
  readonly state?: string
  readonly map?: SpriteStateMapConfig
  readonly updatePredicate?: UpdatePredicateConfig
  readonly collisionType?: CollisionTypeConfig
  readonly collisionPredicate?: CollisionPredicateConfig
  readonly collisionBodies?: Maybe<readonly RectConfig[]>
  readonly children?: Maybe<readonly EntityConfig[]>
}
