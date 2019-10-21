import {CollisionPredicateConfig} from '../collision/CollisionPredicateParser'
import {CollisionTypeConfig} from '../collision/CollisionTypeParser'
import {Integer} from 'aseprite-atlas'
import {RectConfig} from '../math/RectConfig'
import {SpriteStateMapConfig} from '../spriteStateMachine/SpriteStateMachineParser'
import {UpdatePredicateConfig} from '../updaters/UpdatePredicateParser'
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
