import {Atlas} from 'aseprite-atlas'
import {Text} from './text/Text'
import {Build} from '../utils/Build'
import {EntityType} from '../entity/EntityType'
import {Entity} from '../entity/Entity'
import {ImageRect} from '../imageStateMachine/ImageRect'

export class DateVersionHash extends Entity<'none', DateVersionHash.State> {
  constructor(atlas: Atlas, props?: Text.Props<'none', Text.State>) {
    super({
      type: EntityType.UI_DATE_VERSION_HASH,
      variant: 'none',
      state: DateVersionHash.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [DateVersionHash.State.VISIBLE]: new ImageRect()
      },
      children: [
        new Text(atlas, {
          type: EntityType.UI_DATE_VERSION_HASH,
          text: `${Build.date} v${Build.version} ${Build.hash}`
        })
      ],
      ...props
    })
  }
}

export namespace DateVersionHash {
  export enum State {
    VISIBLE = 'visible'
  }
}
