import {AlphaComposition} from './AlphaComposition'
import {ObjectUtil} from '../utils/ObjectUtil'

export type AlphaCompositionKeyConfig = Maybe<AlphaComposition.Key | string>

export namespace AlphaCompositionParser {
  export function parseKey(
    config: AlphaCompositionKeyConfig
  ): AlphaComposition {
    const key = config || 'IMAGE'
    if (ObjectUtil.assertKeyOf(AlphaComposition, key, 'AlphaComposition.Key'))
      return AlphaComposition[key]
    throw new Error()
  }
}
