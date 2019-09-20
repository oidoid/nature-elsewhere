import {EntityConfig} from '../../entity/entity-config'
import {ImageConfig} from '../../../images/image/image-config'

export interface ImageEntityConfig extends EntityConfig {
  /** A single image to be added to the default state. */
  readonly image?: ImageConfig
}
