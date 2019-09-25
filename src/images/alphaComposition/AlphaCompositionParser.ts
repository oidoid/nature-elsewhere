import {AlphaCompositionKeyConfig} from './AlphaCompositionConfig'
import {AlphaComposition} from './AlphaComposition'
import {ObjectUtil} from '../../utils/ObjectUtil'

export namespace AlphaCompositionParser {
  export function parseKey(
    config: AlphaCompositionKeyConfig
  ): AlphaComposition {
    const key = config || 'SOURCE'
    if (ObjectUtil.assertKeyOf(AlphaComposition, key, 'AlphaComposition.Key'))
      return AlphaComposition[key]
    throw new Error()
  }
}
