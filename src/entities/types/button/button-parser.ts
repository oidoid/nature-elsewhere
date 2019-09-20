import {Entity} from '../../entity/entity'
import {AtlasID} from '../../../atlas/atlas-id/atlas-id'
import {EntityType} from '../../entity-type/entity-type'
import {Atlas} from '../../../atlas/atlas/atlas'
import {XY} from '../../../math/xy/xy'
import {Image} from '../../../images/image/image'
import {ImageRect} from '../../../images/image-rect/image-rect'
import {ImageParser} from '../../../images/image/image-parser'
import {Button} from './button'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'
import {ButtonState} from './button-state'

export namespace ButtonParser {
  export function parse(button: Entity, atlas: Atlas): Button {
    if (!EntityTypeUtil.assert<Button>(button, EntityType.UI_BUTTON))
      throw new Error()

    for (const state of [ButtonState.PRESSED, ButtonState.UNPRESSED]) {
      const position = {
        x: button.imageStates[state].bounds.x,
        y: button.imageStates[state].bounds.y
      }
      const icon = newIcon(button.iconID, atlas, position)
      ImageRect.add(button.imageStates[state], icon)
    }

    EntityUtil.invalidateBounds(button)
    return button
  }
}
function newIcon(iconID: AtlasID, atlas: Atlas, position: XY): Image {
  const bounds = {x: position.x, y: position.y}
  const config = {id: iconID, layer: 'UI_HIHI', bounds}
  return ImageParser.parse(config, atlas)
}
