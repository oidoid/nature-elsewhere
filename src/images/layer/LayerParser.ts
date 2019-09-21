import {Layer} from './layer'
import {LayerKeyConfig} from './LayerConfig'
import {ObjectUtil} from '../../utils/ObjectUtil'

export namespace LayerParser {
  export function parse(config: LayerKeyConfig): Layer {
    const key = config || 'DEFAULT'
    if (ObjectUtil.assertKeyOf(Layer, key, 'Layer.Key')) return Layer[key]
    throw new Error()
  }
}
