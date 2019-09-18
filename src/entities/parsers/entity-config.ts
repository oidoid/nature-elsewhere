import {EntityArrayConfig} from './entity-array-config'
import {EntityIDConfig} from './entity-id-config'
import {EntityStateConfig} from './entity-state-config'
import {EntityTypeConfig} from './entity-type-config'
import {ImageScaleConfig} from '../../images/image-scale/image-scale-config'
import {ImageStateMapConfig} from '../../images/image-state-map/image-state-map-config'
import {RectArrayConfig} from '../../math/parsers/rect-array-config'
import {UpdatePredicateConfig} from '../updaters/parsers/update-predicate-config'
import {UpdaterArrayConfig} from '../updaters/parsers/updater-array-config'
import {XYConfig} from '../../math/parsers/xy-config'
import {CollisionPredicateConfig} from '../../collision/collision-predicate/collision-predicate-config'

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
  readonly updaters?: UpdaterArrayConfig
  /** Defaults to CollisionPredicate.NEVER. */
  readonly collisionPredicate?: CollisionPredicateConfig
  /** Defaults to []. */
  readonly collisionBodies?: RectArrayConfig
  /** Defaults to []. */
  readonly children?: EntityArrayConfig
}
