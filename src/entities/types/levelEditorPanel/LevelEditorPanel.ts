import {Atlas} from 'aseprite-atlas'
import {Button} from '../button/Button'
import {Checkbox} from '../checkbox/Checkbox'
import {CollisionPredicate} from '../../../collision/CollisionPredicate'
import {Entity} from '../../../entity/Entity'
import {EntityID} from '../../../entity/EntityID'
import {EntityParser} from '../../../entity/EntityParser'
import {EntityPicker} from '../entityPicker/EntityPicker'
import {EntityPickerParser} from '../entityPicker/EntityPickerParser'
import {
  EntityType,
  SCENERY_VALUE_PREFIX,
  CHAR_VALUE_PREFIX
} from '../../../entity/EntityType'
import {Layer} from '../../../image/Layer'
import {Level} from '../../../levels/Level'
import {Marquee} from '../marquee/Marquee'
import {PlaneState} from '../PlaneState'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {XY} from '../../../math/XY'

export class LevelEditorPanel extends Entity {
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

  constructor({
    radioGroup,
    xCheckbox,
    yCheckbox,
    stateCheckbox,
    entityCheckbox,
    entityPicker,
    decrementButton,
    incrementButton,
    destroyButton,
    createButton,
    toggleGridButton,
    ...props
  }: LevelEditorPanel.Props) {
    super(props)
    this.radioGroup = radioGroup
    this.xCheckbox = xCheckbox
    this.yCheckbox = yCheckbox
    this.stateCheckbox = stateCheckbox
    this.entityCheckbox = entityCheckbox
    this.entityPicker = entityPicker
    this.decrementButton = decrementButton
    this.incrementButton = incrementButton
    this.destroyButton = destroyButton
    this.createButton = createButton
    this.toggleGridButton = toggleGridButton
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    if (Level.collisionWithCursor(state.level, this)) console.log('cursor')
    if (
      this.decrementButton.clicked ||
      this.decrementButton.longClicked ||
      this.incrementButton.clicked ||
      this.incrementButton.longClicked
    ) {
      const offset =
        this.decrementButton.clicked || this.decrementButton.longClicked
          ? -1
          : this.incrementButton.clicked || this.incrementButton.longClicked
          ? 1
          : 0
      if (this.xCheckbox.checked)
        updateNumberCheckbox(this.xCheckbox, state, offset)
      else if (this.yCheckbox.checked)
        updateNumberCheckbox(this.yCheckbox, state, offset)
      else if (this.entityCheckbox.checked) updateEntity(this, state, offset)
      else if (this.stateCheckbox.checked)
        updateEntityState(this, state, offset)
    }

    if (this.createButton.clicked) {
      const child = EntityPickerParser.getActiveChild(this.entityPicker)
      if (child) {
        const position = {
          x: checkboxNumber(this.xCheckbox),
          y: checkboxNumber(this.yCheckbox)
        }
        let entity = EntityParser.parse(
            {
              type: child.type,
              machine: {state: child.machine.state},
              position
            },
            state.level.atlas
          )
          // force collision to bounds for picking
        ;(<any>entity).collisionPredicate = CollisionPredicate.BOUNDS
        const sandbox = Entity.findAnyByID(
          state.level.parentEntities,
          EntityID.UI_LEVEL_EDITOR_SANDBOX
        )
        if (!sandbox) throw new Error('Missing sandbox.')

        sandbox.children.push(entity)
        sandbox.invalidateBounds()
        // [todo] set selection here
      }
    }
    if (this.toggleGridButton.clicked) toggleGrid(state)

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
      if (this.destroyButton.clicked) {
        marquee.selection = undefined
        marquee.machine.setState(Entity.State.HIDDEN)
        const index = sandbox.children.findIndex(entity =>
          selection.equal(entity)
        )
        sandbox.children.splice(index, 1)
      }
      if (
        this.decrementButton.clicked ||
        this.decrementButton.longClicked ||
        this.incrementButton.clicked ||
        this.incrementButton.longClicked
      ) {
        const position = new XY(
          checkboxNumber(this.xCheckbox),
          checkboxNumber(this.yCheckbox)
        )
        selection.moveTo(position)
        sandbox.invalidateBounds()
        marquee.moveTo(new XY(position.x - 1, position.y - 1))
      } else {
        updateNumberCheckbox(
          this.xCheckbox,
          state,
          selection.bounds.position.x - checkboxNumber(this.xCheckbox)
        )
        updateNumberCheckbox(
          this.yCheckbox,
          state,
          selection.bounds.position.y - checkboxNumber(this.yCheckbox)
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
  checkbox.setText(
    {
      type: EntityType.UI_TEXT,
      textLayer: Layer.UI_PICKER_OFFSET,
      text: num.toString()
    },
    Layer.UI_PICKER_OFFSET,
    state.level.atlas
  )
}

function checkboxNumber(checkbox: Checkbox) {
  const text = checkbox.getText()
  return Number.parseInt(text)
}

function updateEntity(
  panel: LevelEditorPanel,
  state: UpdateState,
  offset: number
): void {
  LevelEditorPanel.setEntityFields(panel, offset, state.level.atlas)
}

function updateEntityState(
  panel: LevelEditorPanel,
  state: UpdateState,
  offset: number
): void {
  LevelEditorPanel.setEntityStateFields(panel, offset, state.level.atlas)
}

function toggleGrid(state: UpdateState): void {
  const grid = Entity.findAnyByID(state.level.parentEntities, EntityID.UI_GRID)
  if (!grid) throw new Error('Missing grid.')
  const toggle =
    grid.machine.state === Entity.State.HIDDEN
      ? PlaneState.GRID
      : Entity.State.HIDDEN
  grid.setState(toggle)
}

export namespace LevelEditorPanel {
  export interface Props extends Entity.Props {
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

  export function setEntityFields(
    panel: LevelEditorPanel,
    offset: number,
    atlas: Atlas
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
    panel.entityCheckbox.setText(
      {
        type: EntityType.UI_TEXT,
        textLayer: Layer.UI_PICKER_OFFSET,
        text: entityLabel
      },
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    setEntityStateFields(panel, 0, atlas)
  }

  export function setEntityStateFields(
    {entityPicker, radioGroup, stateCheckbox}: LevelEditorPanel,
    offset: number,
    atlas: Atlas
  ): void {
    const child = EntityPickerParser.getActiveChild(entityPicker)
    if (!child) return
    EntityPickerParser.offsetActiveChildStateIndex(entityPicker, offset)
    stateCheckbox.setText(
      {
        type: EntityType.UI_TEXT,
        textLayer: Layer.UI_PICKER_OFFSET,
        text: child.machine.state
      },
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    radioGroup.invalidateBounds()
  }
}
