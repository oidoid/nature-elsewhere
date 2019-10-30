import {LifeCounter} from './LifeCounter'
import {LifeCounterPropsConfig} from './LifeCounterPropsConfig'

export namespace LifeCounterParser {
  export function parseProps(
    config: LifeCounterPropsConfig
  ): LifeCounter.Props {
    const props: Writable<LifeCounter.Props> = {}
    if (config.lives !== undefined) props.lives = config.lives
    return props
  }
}
