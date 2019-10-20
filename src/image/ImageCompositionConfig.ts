import {ImageComposition} from './ImageComposition'

export type ImageCompositionConfig = Maybe<
  keyof typeof ImageComposition | string | number
>
