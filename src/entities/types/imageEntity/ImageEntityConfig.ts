import {EntityConfig} from '../../entity/EntityConfig'
import {ImageConfig} from '../../../images/image/ImageConfig'

export interface ImageEntityConfig extends EntityConfig {
  /** A single image to be added to the default state. */
  readonly image?: ImageConfig
}
