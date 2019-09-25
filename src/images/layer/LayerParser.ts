import {Layer} from './Layer'
import {LayerKeyConfig} from './LayerConfig'
import {ObjectUtil} from '../../utils/ObjectUtil'

export namespace LayerParser {
  export function parseKey(config: LayerKeyConfig): Layer {
    const key = config || 'DEFAULT'
    if (ObjectUtil.assertKeyOf(Layer, key, 'Layer.Key')) return Layer[key]
    throw new Error()
  }
}
