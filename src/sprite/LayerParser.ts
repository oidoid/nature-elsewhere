import {Layer} from './Layer'
import {LayerConfig} from './LayerConfig'

export namespace LayerParser {
  export function parse(config: LayerConfig): Layer {
    const layer = config === undefined ? Layer.DEFAULT : config
    if (!(layer in Layer)) throw new Error(`Unknown Layer "${layer}".`)
    return typeof layer === 'number' ? layer : Layer[<keyof typeof Layer>layer]
  }
}
