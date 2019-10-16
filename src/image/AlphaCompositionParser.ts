import {AlphaComposition} from './AlphaComposition'
import {ObjectUtil} from '../utils/ObjectUtil'

export type AlphaCompositionConfig = Maybe<AlphaComposition | string | number>

export namespace AlphaCompositionParser {
  export function parse(config: AlphaCompositionConfig): AlphaComposition {
    const composition = config === undefined ? AlphaComposition.IMAGE : config
    ObjectUtil.assertKeyOf(AlphaComposition, composition, 'AlphaComposition')
    return typeof composition === 'number'
      ? composition
      : AlphaComposition[<keyof typeof AlphaComposition>composition]
  }
}
