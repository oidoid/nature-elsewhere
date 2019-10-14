import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../../atlas/AtlasID'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {CollisionType} from '../../collision/CollisionType'
import {Entity} from '../../entity/Entity'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {Image} from '../../image/Image'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {JSONValue} from '../../utils/JSON'
import {Layer} from '../../image/Layer'
import {ObjectUtil} from '../../utils/ObjectUtil'
import {UpdatePredicate} from '../../updaters/updatePredicate/UpdatePredicate'
import {WH} from '../../math/WH'
import {XY} from '../../math/XY'

export class LevelEditorPanelBackground extends Entity<
  LevelEditorPanelBackground.Variant,
  LevelEditorPanelBackground.State
> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<
      LevelEditorPanelBackground.Variant,
      LevelEditorPanelBackground.State
    >
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [LevelEditorPanelBackground.State.VISIBLE]: new ImageRect({
          images: newBackgroundImages(atlas)
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace LevelEditorPanelBackground {
  export enum Variant {
    NONE = 'none'
  }
  export enum State {
    VISIBLE = 'visible'
  }
}

function newBackgroundImages(atlas: Atlas): Image[] {
  return [
    {
      id: AtlasID.PALETTE_WHITE,
      position: new XY(1, 21),
      size: new WH(50, 11),
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
      size: new WH(50, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.PALETTE_WHITE,
      position: new XY(51, 13),
      size: new WH(45, 19),
      layer: Layer.UI_LO
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(50, 13),
      size: new WH(1, 7),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(51, 12),
      size: new WH(44, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.PALETTE_WHITE,
      position: new XY(95, 1),
      size: new WH(34, 31),
      layer: Layer.UI_LO
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(95, 1),
      size: new WH(1, 11),
      wrap: new XY(0, 1),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(96, 0),
      size: new WH(32, 1),
      wrap: new XY(1, 0),
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      position: new XY(128, 1),
      size: new WH(1, 1),
      layer: Layer.UI_MID
    }
  ].map((props: Image.Props) => new Image(atlas, props))
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_LEVEL_EDITOR_PANEL_BACKGROUND,
  variant: LevelEditorPanelBackground.Variant.NONE,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.IMAGES,
  updatePredicate: UpdatePredicate.ALWAYS,
  state: LevelEditorPanelBackground.State.VISIBLE
})
