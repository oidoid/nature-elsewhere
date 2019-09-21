import {Button} from '../button/Button'
import {Checkbox} from '../checkbox/Checkbox'
import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'
import {EntityPicker} from '../entityPicker/EntityPicker'

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
  readonly removeButton: Button
  readonly addButton: Button
  readonly toggleGridButton: Button
}
