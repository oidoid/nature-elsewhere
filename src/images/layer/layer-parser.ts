import {Layer} from './layer'
import {LayerKeyConfig} from './layer-config'
import {ObjectUtil} from '../../utils/object-util'

export namespace LayerParser {
  export function parse(config: LayerKeyConfig): Layer {
    const key = config || 'DEFAULT'
    if (ObjectUtil.hasKey(Layer, key)) return Layer[key]
    throw new Error(`Unknown Layer.Key "${key}".`)
  }
}
