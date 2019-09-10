import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {ImageParser} from '../images/image-parser'
import {ImageRect} from '../images/image-rect'
import {JSONUtil} from '../utils/json-util'

export interface UIEditorButton extends Entity {
  readonly id: 'uiEditorButton'
  readonly button: string
}
type t = UIEditorButton

export namespace UIEditorButton {
  export const make = (atlas: Atlas, entity: Entity | UIEditorButton): t => {
    if (!isUIEditorButtonConfig(entity))
      throw new Error(`Unknown ID "${entity.id}".`)
    const button = ImageParser.parse(atlas, {
      id: 'ui-editor-button ' + entity.button,
      layer: 'UI_HI'
    })
    const states = Object.entries(entity.states).reduce(
      (ret: Record<string, ImageRect>, [key, val]) => ({
        ...ret,
        [key]: {...val, images: val.images.concat(JSONUtil.copy(button))}
      }),
      {}
    )
    return {...entity, states}
  }
}

export interface Text extends Entity {
  readonly text: string
}

const isUIEditorButtonConfig = (val: Entity): val is t =>
  val.id === 'uiEditorButton'
