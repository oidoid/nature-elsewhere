import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {ImageRect} from '../images/image-rect'
import {JSONUtil} from '../utils/json-util'
import {Text} from './text'
import {EntityRect} from './entity-rect'

export interface UIEditorLabelButton extends Entity {
  readonly id: 'uiEditorLabelButton'
  readonly text: string
}
type t = UIEditorLabelButton

export namespace UIEditorLabelButton {
  export const make = (atlas: Atlas, entity: Entity | t): t => {
    if (!is(entity)) throw new Error(`Unknown ID "${entity.id}".`)
    // const str = entity.text.padStart()
    let {text} = Text.make(atlas, {...entity, id: 'text'}).states
    text = ImageRect.moveBy(text, {x: 1, y: 0})
    ImageRect.invalidate(text)
    const states = Object.entries(entity.states).reduce(
      (ret: Record<string, ImageRect>, [key, val]) => ({
        ...ret,
        [key]: {...val, images: val.images.concat(JSONUtil.copy(text.images))}
      }),
      {}
    )
    ;['deselected', 'selected']
      .map(val => states[val])
      .forEach(val => {
        ;(<any>val.images[0]).w = text.w
        ;(<any>val.images[2]).x = text.w + 1
      })
    return {...entity, states}
  }

  export const is = (val: Entity | EntityRect): val is t =>
    'id' in val && val.id === 'uiEditorLabelButton'
}
