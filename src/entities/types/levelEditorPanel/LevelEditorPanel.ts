import {Atlas} from 'aseprite-atlas'
import {Button} from '../button/Button'
import {Checkbox} from '../checkbox/Checkbox'
import {CheckboxParser} from '../checkbox/CheckboxParser'
import {Entity} from '../../../entity/Entity'
import {EntityPicker} from '../entityPicker/EntityPicker'
import {EntityPickerParser} from '../entityPicker/EntityPickerParser'
import {EntityType} from '../../../entity/EntityType'
import {IEntityParser} from '../../RecursiveEntityParser'
import {Layer} from '../../../image/Layer'
import {
  CHAR_VALUE_PREFIX,
  SCENERY_VALUE_PREFIX
} from '../../../entity/EntityType'

export interface LevelEditorPanel extends Entity {
  readonly type: EntityType.UI_LEVEL_EDITOR_PANEL
  readonly radioGroup: Entity
  readonly xCheckbox: Checkbox
  readonly yCheckbox: Checkbox
  readonly stateCheckbox: Checkbox
  readonly entityCheckbox: Checkbox
  readonly entityPicker: EntityPicker
  readonly decrementButton: Button
  readonly incrementButton: Button
  readonly destroyButton: Button
  readonly createButton: Button
  readonly toggleGridButton: Button
}

export namespace LevelEditorPanel {
  export function setEntityFields(
    panel: LevelEditorPanel,
    offset: number,
    atlas: Atlas,
    parser: IEntityParser
  ): void {
    EntityPickerParser.setActiveChild(
      panel.entityPicker,
      panel.entityPicker.activeChildIndex + offset
    )
    const child = EntityPickerParser.getActiveChild(panel.entityPicker)
    if (!child) return
    const entityLabel = child.type.replace(
      new RegExp(`^(${SCENERY_VALUE_PREFIX}|${CHAR_VALUE_PREFIX})`),
      ''
    )
    CheckboxParser.setText(
      panel.entityCheckbox,
      Layer.UI_PICKER_OFFSET,
      entityLabel,
      atlas,
      parser
    )
    setEntityStateFields(panel, 0, atlas, parser)
  }

  export function setEntityStateFields(
    {entityPicker, radioGroup, stateCheckbox}: LevelEditorPanel,
    offset: number,
    atlas: Atlas,
    parser: IEntityParser
  ): void {
    const child = EntityPickerParser.getActiveChild(entityPicker)
    if (!child) return
    EntityPickerParser.offsetActiveChildStateIndex(entityPicker, offset)
    CheckboxParser.setText(
      stateCheckbox,
      Layer.UI_PICKER_OFFSET,
      child.machine.state,
      atlas,
      parser
    )
    Entity.invalidateBounds(radioGroup)
  }
}
