import {Layer} from './Layer'
import {ObjectUtil} from '../../utils/ObjectUtil'

export type LayerKeyConfig = Maybe<Layer.Key | string>

export namespace LayerParser {
  export function parseKey(config: LayerKeyConfig): Layer {
    const key = config || 'DEFAULT'
    if (ObjectUtil.assertKeyOf(Layer, key, 'Layer.Key')) return Layer[key]
    throw new Error()
  }
}
