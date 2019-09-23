import {IEntityParser} from '../../RecursiveEntityParser'
import {Atlas} from '../../../atlas/atlas/Atlas'
import {EntityPickerParser} from '../entityPicker/EntityPickerParser'
import {LevelEditorPanel} from './LevelEditorPanel'
import {CheckboxParser} from '../checkbox/CheckboxParser'
import {EntityUtil} from '../../entity/EntityUtil'

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
    const entityLabel = child.type.replace(/^(scenery|char)/, '')
    CheckboxParser.setText(panel.entityCheckbox, entityLabel, atlas, parser)
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
    CheckboxParser.setText(stateCheckbox, child.machine.state, atlas, parser)
    EntityUtil.invalidateBounds(radioGroup)
  }
}