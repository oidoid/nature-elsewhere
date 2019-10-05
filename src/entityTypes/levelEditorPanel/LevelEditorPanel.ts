import {Atlas} from 'aseprite-atlas'
import {Button} from '../Button'
import {Checkbox} from '../Checkbox'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {Entity} from '../../entity/Entity'
import {EntityID} from '../../entity/EntityID'
import {EntityParser} from '../../entity/EntityParser'
import {EntityPicker} from '../entityPicker/EntityPicker'
import {
  EntityType,
  SCENERY_VALUE_PREFIX,
  CHAR_VALUE_PREFIX
} from '../../entity/EntityType'
import {Layer} from '../../image/Layer'
import {Marquee} from '../Marquee'
import {UpdateState} from '../../entities/updaters/UpdateState'
import {UpdateStatus} from '../../entities/updaters/updateStatus/UpdateStatus'
import {XY} from '../../math/XY'
import {UpdatePredicate} from '../../entities/updaters/updatePredicate/UpdatePredicate'
import {CollisionType} from '../../collision/CollisionType'
import {WH} from '../../math/WH'
import {AtlasID} from '../../atlas/AtlasID'
import {LevelEditorPanelBackground} from './LevelEditorPanelBackground'
import {PlaneState} from '../Plane'
import {RadioCheckboxGroup} from '../RadioCheckboxGroup'
import {Text} from '../text/Text'
import {Group, GroupState} from '../Group'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {Image} from '../../image/Image'
import {
  FollowCam,
  FollowCamOrientation
} from '../../entities/updaters/types/followCam/FollowCam'
import {UpdaterType} from '../../entities/updaters/updaterType/UpdaterType'

export class LevelEditorPanel extends Entity implements FollowCam {
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
  readonly positionRelativeToCam: FollowCamOrientation
  readonly camMargin: WH

  constructor(atlas: Atlas, props?: Optional<Entity.Props, 'type'>) {
    super({
      type: EntityType.UI_LEVEL_EDITOR_PANEL,
      updatePredicate: UpdatePredicate.ALWAYS,
      collisionType: CollisionType.TYPE_UI,
      collisionPredicate: CollisionPredicate.CHILDREN,
      updaters: [UpdaterType.UI_FOLLOW_CAM],
      ...props
    })

    this.stateCheckbox = new Checkbox(atlas, {
      textMaxSize: new WH(34, 5),
      position: new XY(52, 20),
      imageID: AtlasID.PALETTE_BLACK
    })
    this.xCheckbox = new Checkbox(atlas, {
      text: '0',
      textLayer: Layer.UI_HI,
      position: new XY(46, 26),
      imageID: AtlasID.PALETTE_BLACK
    })
    this.yCheckbox = new Checkbox(atlas, {
      text: '0',
      textLayer: Layer.UI_HI,
      position: new XY(68, 26),
      imageID: AtlasID.PALETTE_BLACK
    })
    this.entityCheckbox = new Checkbox(atlas, {
      textMaxSize: new WH(32, 5),
      position: new XY(88, 2),
      imageID: AtlasID.PALETTE_BLACK
    })
    this.radioGroup = new RadioCheckboxGroup({
      children: [
        new Text(atlas, {
          text: 'st',
          textLayer: Layer.UI_HI,
          position: new XY(44, 20)
        }),
        this.stateCheckbox,
        new Text(atlas, {
          text: 'x',
          textLayer: Layer.UI_HI,
          position: new XY(42, 26)
        }),
        this.xCheckbox,
        new Text(atlas, {
          text: 'y',
          textLayer: Layer.UI_HI,
          position: new XY(64, 26)
        }),
        this.yCheckbox,
        this.entityCheckbox
      ]
    })
    this.decrementButton = new Button(atlas, {
      position: new XY(2, 22),
      children: [
        new Group({
          map: {
            [Entity.State.HIDDEN]: new ImageRect(),
            [GroupState.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
                  id: AtlasID.UI_BUTTON_DECREMENT,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this.incrementButton = new Button(atlas, {
      position: new XY(10, 22),
      children: [
        new Group({
          map: {
            [Entity.State.HIDDEN]: new ImageRect(),
            [GroupState.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
                  id: AtlasID.UI_BUTTON_INCREMENT,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this.destroyButton = new Button(atlas, {
      position: new XY(18, 22),
      children: [
        new Group({
          map: {
            [Entity.State.HIDDEN]: new ImageRect(),
            [GroupState.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
                  id: AtlasID.UI_BUTTON_DESTROY,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this.createButton = new Button(atlas, {
      position: new XY(26, 22),
      children: [
        new Group({
          map: {
            [Entity.State.HIDDEN]: new ImageRect(),
            [GroupState.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
                  id: AtlasID.UI_BUTTON_CREATE,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this.toggleGridButton = new Button(atlas, {
      position: new XY(34, 22),
      children: [
        new Group({
          map: {
            [Entity.State.HIDDEN]: new ImageRect(),
            [GroupState.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
                  id: AtlasID.UI_BUTTON_TOGGLE_GRID,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this.entityPicker = new EntityPicker(atlas, {position: new XY(89, 0)})
    this.children.push(
      this.decrementButton,
      this.incrementButton,
      this.destroyButton,
      this.createButton,
      this.toggleGridButton,
      this.entityPicker,
      this.radioGroup,
      new LevelEditorPanelBackground(atlas)
    )
    this.invalidateBounds()

    this.setEntityFields(0, atlas)
    this.elevate(Layer.UI_PICKER_OFFSET)

    this.positionRelativeToCam = FollowCamOrientation.SOUTH_EAST
    this.camMargin = new WH(0, 0)
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
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
      else if (this.entityCheckbox.checked) this.updateEntity(state, offset)
      else if (this.stateCheckbox.checked) this.updateEntityState(state, offset)
    }

    if (this.createButton.clicked) {
      const child = this.entityPicker.getActiveChild()
      if (child) {
        const position = {
          x: checkboxNumber(this.xCheckbox),
          y: checkboxNumber(this.yCheckbox)
        }
        let entity = EntityParser.parse(
            {
              type: child.type,
              state: child.machine.state,
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

  setEntityFields(offset: number, atlas: Atlas): void {
    this.entityPicker.setActiveChild(
      this.entityPicker.activeChildIndex + offset
    )
    const child = this.entityPicker.getActiveChild()
    if (!child) return
    const entityLabel = child.type.replace(
      new RegExp(`^(${SCENERY_VALUE_PREFIX}|${CHAR_VALUE_PREFIX})`),
      ''
    )
    this.entityCheckbox.setText(
      {
        textLayer: Layer.UI_PICKER_OFFSET,
        text: entityLabel
      },
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    this.setEntityStateFields(0, atlas)
  }

  setEntityStateFields(offset: number, atlas: Atlas): void {
    const child = this.entityPicker.getActiveChild()
    if (!child) return
    this.entityPicker.offsetActiveChildStateIndex(offset)
    this.stateCheckbox.setText(
      {
        textLayer: Layer.UI_PICKER_OFFSET,
        text: child.machine.state
      },
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    this.radioGroup.invalidateBounds()
  }

  updateEntity(state: UpdateState, offset: number): void {
    this.setEntityFields(offset, state.level.atlas)
  }

  updateEntityState(state: UpdateState, offset: number): void {
    this.setEntityStateFields(offset, state.level.atlas)
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

function toggleGrid(state: UpdateState): void {
  const grid = Entity.findAnyByID(state.level.parentEntities, EntityID.UI_GRID)
  if (!grid) throw new Error('Missing grid.')
  const toggle =
    grid.machine.state === Entity.State.HIDDEN
      ? PlaneState.GRID
      : Entity.State.HIDDEN
  grid.setState(toggle)
}

export enum LevelEditorPanelState {
  VISIBLE = 'visible'
}
