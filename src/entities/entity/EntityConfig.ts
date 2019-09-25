import {CollisionPredicateConfig} from '../../collision/collisionPredicate/CollisionPredicateConfig'
import {EntityIDConfig} from '../entityID/EntityIDConfig'
import {EntityTypeConfig} from '../entityType/EntityTypeConfig'
import {ImageScaleConfig} from '../../images/imageScale/ImageScaleConfig'
import {ImageStateMachineConfig} from '../../images/imageStateMachine/ImageStateMachineConfig'
import {RectArrayConfig} from '../../math/rect/RectConfig'
import {UpdatePredicateConfig} from '../updaters/updatePredicate/UpdatePredicateConfig'
import {UpdaterTypeArrayConfig} from '../updaters/updaterType/UpdaterTypeConfig'
import {XYConfig} from '../../math/xy/XYConfig'
import {AtlasIDConfig} from '../../atlas/atlasID/AtlasIDConfig'

export interface EntityConfig {
  /** Defaults to EntityID.UNDEFINED. */
  readonly id?: EntityIDConfig
  readonly type: EntityTypeConfig
  /** Defaults to (0, 0). */
  readonly position?: XYConfig
  readonly imageID?: AtlasIDConfig
  readonly scale?: ImageScaleConfig
  /** Defaults to {}. */
  readonly machine?: ImageStateMachineConfig
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
