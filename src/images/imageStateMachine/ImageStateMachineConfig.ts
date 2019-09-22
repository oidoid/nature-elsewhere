import {EntityStateConfig} from '../../entities/entityState/EntityStateConfig'
import {ImageStateMapConfig} from '../imageStateMap/ImageStateMapConfig'

export type ImageStateMachineConfig = Maybe<
  Readonly<{state?: EntityStateConfig; map?: ImageStateMapConfig}>
>
