import {Layer} from './layer'
import {LayerKeyConfig} from './layer-config'
import {ObjectUtil} from '../../utils/object-util'

export namespace LayerParser {
  export function parse(config: LayerKeyConfig): Layer {
    const key = config || 'DEFAULT'
    if (ObjectUtil.assertKeyOf(Layer, key, 'Layer.Key')) return Layer[key]
    throw new Error()
  }
}
