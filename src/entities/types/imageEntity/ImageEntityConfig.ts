import {ImageConfig} from '../../../images/image/ImageConfig'
import {EntityConfig} from '../../entity/EntityParser'

export interface ImageEntityConfig extends EntityConfig {
  /** A single image to be added to the default state. */
  readonly image?: ImageConfig
}
