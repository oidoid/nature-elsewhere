import {CollisionPredicate} from '../../../collision/CollisionPredicate'
import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'
import {Layer} from '../../../image/Layer'
import {XY} from '../../../math/XY'
import {Rect} from '../../../math/Rect'
import {AtlasID} from '../../../atlas/AtlasID'
import {Image} from '../../../image/Image'
import {ImageStateMachine} from '../../../imageStateMachine/ImageStateMachine'
import {ImageRect} from '../../../imageStateMachine/ImageRect'
import {CollisionType} from '../../../collision/CollisionType'
import {UpdatePredicate} from '../../updaters/updatePredicate/UpdatePredicate'

export class LevelEditorPanelBackground extends Entity {
  constructor(props?: Entity.Props) {
    super({
      type: EntityType.UI_LEVEL_EDITOR_PANEL_BACKGROUND,
      collisionType: CollisionType.TYPE_UI,
      collisionPredicate: CollisionPredicate.IMAGES,
      updatePredicate: UpdatePredicate.ALWAYS,
      machine: new ImageStateMachine({
        state: LevelEditorPanelBackgroundState.VISIBLE,
        map: {
          [Entity.State.HIDDEN]: new ImageRect(),
          [LevelEditorPanelBackgroundState.VISIBLE]: new ImageRect({
            images: newBackgroundImages()
          })
        }
      }),
      ...props
    })
  }
}

export enum LevelEditorPanelBackgroundState {
  VISIBLE = 'visible'
}

function newBackgroundImages(): Image[] {
  return [
    {
      id: AtlasID.PALETTE_WHITE,
      bounds: Rect.make(1, 21, 42, 11),
      layer: Layer.ABOVE_PLANE
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      bounds: Rect.make(0, 21, 1, 11),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      bounds: Rect.make(1, 20, 42, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.PALETTE_WHITE,
      bounds: Rect.make(43, 19, 45, 13),
      layer: Layer.UI_LO
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      bounds: Rect.make(42, 19, 1, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      bounds: Rect.make(43, 18, 44, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.PALETTE_WHITE,
      bounds: Rect.make(87, 1, 34, 31),
      layer: Layer.UI_LO
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      bounds: Rect.make(87, 1, 1, 17),
      wrap: new XY(0, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      bounds: Rect.make(88, 0, 32, 1),
      wrap: new XY(1, 0),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      bounds: Rect.make(120, 1, 1, 1),
      layer: Layer.UI_MID
    }
  ].map(props => new Image(props))
}
