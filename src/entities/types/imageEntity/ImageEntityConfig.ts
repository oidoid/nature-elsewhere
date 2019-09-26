import {EntityConfig} from '../../entity/EntityParser'
import {ImageConfig} from '../../../images/image/ImageParser'

export interface ImageEntityConfig extends EntityConfig {
  /** A single image to be added to the default state. */
  readonly image?: ImageConfig
}
