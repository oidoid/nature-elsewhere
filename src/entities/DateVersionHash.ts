import {Atlas} from 'aseprite-atlas'
import {Text} from './text/Text'
import {Build} from '../utils/Build'
import {EntityType} from '../entity/EntityType'
import {Entity} from '../entity/Entity'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {JSON} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class DateVersionHash extends Entity<
  DateVersionHash.Variant,
  DateVersionHash.State
> {
  constructor(
    atlas: Atlas,
    props?: Text.Props<DateVersionHash.Variant, Text.State>
  ) {
    super({
      ...defaults,
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

  toJSON(): JSON {
    return this._toJSON(defaults)
  }
}

export namespace DateVersionHash {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_DATE_VERSION_HASH,
  variant: DateVersionHash.Variant.NONE,
  state: DateVersionHash.State.VISIBLE,
  updatePredicate: UpdatePredicate.ALWAYS
})
