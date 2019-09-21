import {EntityIDConfig} from '../entityID/EntityIDConfig'
import {EntityStateConfig} from '../entityState/EntityStateConfig'
import {EntityTypeConfig} from '../entityType/EntityTypeConfig'
import {ImageScaleConfig} from '../../images/imageScale/ImageScaleConfig'
import {ImageStateMapConfig} from '../../images/imageStateMap/ImageStateMapConfig'
import {UpdatePredicateConfig} from '../updaters/updatePredicate/UpdatePredicateConfig'
import {XYConfig} from '../../math/xy/XYConfig'
import {CollisionPredicateConfig} from '../../collision/collisionPredicate/CollisionPredicateConfig'
import {UpdaterTypeArrayConfig} from '../updaters/updaterType/UpdaterTypeConfig'
import {RectArrayConfig} from '../../math/rect/RectConfig'

export interface EntityConfig {
  /** Defaults to EntityID.UNDEFINED. */
  readonly id?: EntityIDConfig
  readonly type: EntityTypeConfig
  /** Defaults to (0, 0). */
  readonly position?: XYConfig
  readonly scale?: ImageScaleConfig
  /** Defaults to {}. */
  readonly state?: EntityStateConfig
  readonly imageStates?: ImageStateMapConfig
  /** Defaults to BehaviorPredicate.NEVER. */
  readonly updatePredicate?: UpdatePredicateConfig
  /** Defaults to []. */
  readonly updaters?: UpdaterTypeArrayConfig
  /** Defaults to CollisionPredicate.NEVER. */
  readonly collisionPredicate?: CollisionPredicateConfig
  /** Defaults to []. */
  readonly collisionBodies?: RectArrayConfig
  /** Defaults to []. */
  readonly children?: EntityArrayConfig
}

export type EntityArrayConfig = Maybe<readonly EntityConfig[]>
