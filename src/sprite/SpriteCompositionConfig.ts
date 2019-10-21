import {SpriteComposition} from './SpriteComposition'

export type SpriteCompositionConfig = Maybe<
  keyof typeof SpriteComposition | string | number
>
