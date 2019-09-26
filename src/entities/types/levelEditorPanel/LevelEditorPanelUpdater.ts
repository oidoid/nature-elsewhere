import {EntityID} from '../../../entity/EntityID'
import {EntityType} from '../../../entity/EntityType'
import {PlaneState} from '../PlaneState'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Update} from '../../updaters/Update'
import {LevelEditorPanel} from './LevelEditorPanel'

import {EntityParser} from '../../../entity/EntityParser'
import {UpdateState} from '../../updaters/UpdateState'
import {CheckboxParser} from '../checkbox/CheckboxParser'
import {Checkbox} from '../checkbox/Checkbox'
import {EntityPickerParser} from '../entityPicker/EntityPickerParser'

import {Layer} from '../../../images/Layer'
import {Marquee} from '../marquee/Marquee'
import {Entity} from '../../../entity/Entity'
import {Level} from '../../../levels/Level'

export namespace LevelEditorPanelUpdater {
  export const update: Update = (panel, state) => {
    if (
      !Entity.assert<LevelEditorPanel>(panel, EntityType.UI_LEVEL_EDITOR_PANEL)
    )
      throw new Error()

    let status = UpdateStatus.UNCHANGED
    if (Level.collisionWithCursor(state.level, panel)) console.log('cursor')
    if (
      panel.decrementButton.clicked ||
      panel.decrementButton.longClicked ||
      panel.incrementButton.clicked ||
      panel.incrementButton.longClicked
    ) {
      const offset =
        panel.decrementButton.clicked || panel.decrementButton.longClicked
          ? -1
          : panel.incrementButton.clicked || panel.incrementButton.longClicked
          ? 1
          : 0
      if (panel.xCheckbox.checked)
        updateNumberCheckbox(panel.xCheckbox, state, offset)
      else if (panel.yCheckbox.checked)
        updateNumberCheckbox(panel.yCheckbox, state, offset)
      else if (panel.entityCheckbox.checked) updateEntity(panel, state, offset)
      else if (panel.stateCheckbox.checked)
        updateEntityState(panel, state, offset)
    }

    if (panel.createButton.clicked) {
      const child = EntityPickerParser.getActiveChild(panel.entityPicker)
      if (child) {
        const position = {
          x: checkboxNumber(panel.xCheckbox),
          y: checkboxNumber(panel.yCheckbox)
        }
        const entity = EntityParser.parse(
          {
            type: child.type,
            machine: {state: child.machine.state},
            position
          },
          state.level.atlas
        )
        const sandbox = Entity.findAnyByID(
          state.level.parentEntities,
          EntityID.UI_LEVEL_EDITOR_SANDBOX
        )
        if (!sandbox) throw new Error('Missing sandbox.')

        sandbox.children.push(entity)
        Entity.invalidateBounds(sandbox)
        // [todo] set selection here
      }
    }
    if (panel.toggleGridButton.clicked) toggleGrid(state)

    const marquee = <Maybe<Marquee>>(
      Entity.findAnyByID(state.level.parentEntities, EntityID.UI_MARQUEE)
    )
    if (
      marquee &&
      marquee.selection &&
      marquee.machine.state !== Entity.State.HIDDEN
    ) {
      const selection = Entity.findAnyBySpawnID(
        state.level.parentEntities,
        marquee.selection
      )
      if (!selection) throw new Error('Missing selection.')
      const sandbox = Entity.findAnyByID(
        state.level.parentEntities,
        EntityID.UI_LEVEL_EDITOR_SANDBOX
      )
      if (!sandbox) throw new Error('Missing sandbox.')
      if (panel.destroyButton.clicked) {
        marquee.selection = undefined
        marquee.machine.state = Entity.State.HIDDEN
        const index = sandbox.children.findIndex(entity =>
          Entity.equal(entity, selection)
        )
        sandbox.children.splice(index, 1)
      }
      if (
        panel.decrementButton.clicked ||
        panel.decrementButton.longClicked ||
        panel.incrementButton.clicked ||
        panel.incrementButton.longClicked
      ) {
        const position = {
          x: checkboxNumber(panel.xCheckbox),
          y: checkboxNumber(panel.yCheckbox)
        }
        Entity.moveTo(selection, position)
        Entity.invalidateBounds(sandbox)
        Entity.moveTo(marquee, {x: position.x - 1, y: position.y - 1})
      } else {
        updateNumberCheckbox(
          panel.xCheckbox,
          state,
          selection.bounds.position.x - checkboxNumber(panel.xCheckbox)
        )
        updateNumberCheckbox(
          panel.yCheckbox,
          state,
          selection.bounds.position.y - checkboxNumber(panel.yCheckbox)
        )
      }
    }

    return status | UpdateStatus.UPDATED
  }
}

function updateNumberCheckbox(
  checkbox: Checkbox,
  state: UpdateState,
  offset: number
): void {
  const num = checkboxNumber(checkbox) + offset
  CheckboxParser.setText(
    checkbox,
    Layer.UI_PICKER_OFFSET,
    num.toString(),
    state.level.atlas,
    EntityParser.parse
  )
}

function checkboxNumber(checkbox: Checkbox) {
  const text = checkbox.text
  return Number.parseInt(text)
}

function updateEntity(
  panel: LevelEditorPanel,
  state: UpdateState,
  offset: number
): void {
  LevelEditorPanel.setEntityFields(
    panel,
    offset,
    state.level.atlas,
    EntityParser.parse
  )
}

function updateEntityState(
  panel: LevelEditorPanel,
  state: UpdateState,
  offset: number
): void {
  LevelEditorPanel.setEntityStateFields(
    panel,
    offset,
    state.level.atlas,
    EntityParser.parse
  )
}

function toggleGrid(state: UpdateState): void {
  const grid = Entity.findAnyByID(state.level.parentEntities, EntityID.UI_GRID)
  if (!grid) throw new Error('Missing grid.')
  const toggle =
    grid.machine.state === Entity.State.HIDDEN
      ? PlaneState.GRID
      : Entity.State.HIDDEN
  Entity.setState(grid, toggle)
}
