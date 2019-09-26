import {IEntityParser} from '../../RecursiveEntityParser'
import {Atlas} from '../../../atlas/atlas/Atlas'
import {EntityPickerParser} from '../entityPicker/EntityPickerParser'
import {LevelEditorPanel} from './LevelEditorPanel'
import {CheckboxParser} from '../checkbox/CheckboxParser'
import {
  SCENERY_VALUE_PREFIX,
  CHAR_VALUE_PREFIX
} from '../../entityType/EntityType'
import {Layer} from '../../../images/layer/Layer'
import {Entity} from '../../entity/Entity'

export namespace LevelEditorPanelUtil {
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
