import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'
import {Layer} from '../../image/Layer'
import {XY} from '../../math/XY'
import {AtlasID} from '../../atlas/AtlasID'
import {Image} from '../../image/Image'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {CollisionType} from '../../collision/CollisionType'
import {UpdatePredicate} from '../../updaters/updatePredicate/UpdatePredicate'
import {Atlas} from 'aseprite-atlas'
import {WH} from '../../math/WH'

export class LevelEditorPanelBackground extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.UI_LEVEL_EDITOR_PANEL_BACKGROUND,
      collisionType: CollisionType.TYPE_UI,
      collisionPredicate: CollisionPredicate.IMAGES,
      updatePredicate: UpdatePredicate.ALWAYS,
      state: LevelEditorPanelBackgroundState.VISIBLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [LevelEditorPanelBackgroundState.VISIBLE]: new ImageRect({
          images: newBackgroundImages(atlas)
        })
      },
      ...props
    })
  }
}

export enum LevelEditorPanelBackgroundState {
  VISIBLE = 'visible'
}

function newBackgroundImages(atlas: Atlas): Image[] {
  return [
    {
      id: AtlasID.PALETTE_WHITE,
      position: new XY(1, 21),
      size: new WH(42, 11),
      layer: Layer.ABOVE_PLANE
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(0, 21),
      size: new WH(1, 11),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(1, 20),
      size: new WH(42, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.PALETTE_WHITE,
      position: new XY(43, 19),
      size: new WH(45, 13),
      layer: Layer.UI_LO
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(42, 19),
      size: new WH(1, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(43, 18),
      size: new WH(44, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.PALETTE_WHITE,
      position: new XY(87, 1),
      size: new WH(34, 31),
      layer: Layer.UI_LO
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(87, 1),
      size: new WH(1, 17),
      wrap: new XY(0, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(88, 0),
      size: new WH(32, 1),
      wrap: new XY(1, 0),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(120, 1),
      size: new WH(1, 1),
      layer: Layer.UI_MID
    }
  ].map((props: Image.Props) => new Image(atlas, props))
}
