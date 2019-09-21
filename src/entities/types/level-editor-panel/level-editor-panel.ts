import {Button} from '../button/button'
import {Checkbox} from '../checkbox/checkbox'
import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {EntityPicker} from '../entity-picker/entity-picker'

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
