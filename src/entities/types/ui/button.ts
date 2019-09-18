import {Entity} from '../../entity'
import {EntityState} from '../../entity-state'
import {AtlasID} from '../../../atlas/atlas-id'
import {EntityType} from '../entity-type'
import {UpdateStatus} from '../../updaters/update-status'
import {UpdateState} from '../../updaters/update-state'
import {Updater} from '../../updaters/updater'
import {InputSource} from '../../../inputs/input-source'
import {InputBit} from '../../../inputs/input-bit'
import {Atlas} from '../../../atlas/atlas'
import {XY} from '../../../math/xy'
import {Image} from '../../../images/image/image'
import {ImageRect} from '../../../images/image-rect/image-rect'
import {Recorder} from '../../../inputs/recorder'
import {ImageParser} from '../../../images/image/image-parser'

export interface Button extends Entity {
  readonly type: EntityType.UI_BUTTON
  state: EntityState | Button.State
  iconID: AtlasID
  clicked: boolean
}

export namespace Button {
  export enum State {
    UNPRESSED = 'unpressed',
    PRESSED = 'pressed'
  }
  export function parse(button: Entity, atlas: Atlas): Button {
    if (!EntityType.assert<Button>(button, EntityType.UI_BUTTON))
      throw new Error()

    for (const state of [Button.State.PRESSED, Button.State.UNPRESSED]) {
      const position = {
        x: button.imageStates[state].bounds.x,
        y: button.imageStates[state].bounds.y
      }
      const icon = newIcon(button.iconID, atlas, position)
      ImageRect.add(button.imageStates[state], icon)
    }

    Entity.invalidateBounds(button)
    return button
  }

  export const update: Updater.Update = (button, state) => {
    if (!EntityType.assert<Button>(button, EntityType.UI_BUTTON))
      throw new Error()

    button.clicked = false
    const collision = UpdateState.collisionWithCursor(state, button)
    if (!collision) return Entity.setState(button, State.UNPRESSED)

    let status = Entity.setState(button, Button.State.PRESSED)

    const [set] = state.input.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]
    if (!pick || pick.bits !== InputBit.PICK) return status

    button.clicked = Recorder.triggered(state.input, InputBit.PICK)
    return status | UpdateStatus.TERMINATE
  }
}

function newIcon(iconID: AtlasID, atlas: Atlas, position: XY): Image {
  const bounds = {x: position.x, y: position.y}
  const config = {id: iconID, layer: 'UI_HIHI', bounds}
  return ImageParser.parse(config, atlas)
}
