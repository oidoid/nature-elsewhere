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
  return (<const>[
    {
      id: 'PALETTE_WHITE',
      position: new XY(1, 21),
      w: 55,
      h: 11,
      layer: Layer.ABOVE_PLANE
    },
    {
      id: 'UI_CHECKERBOARD_BLUE_GREY',
      position: new XY(0, 21),
      w: 1,
      h: 11,
      layer: Layer.UI_MID
    },
    {
      id: 'UI_CHECKERBOARD_BLUE_GREY',
      position: new XY(1, 20),
      w: 55,
      h: 1,
      layer: Layer.UI_MID
    },
    {
      id: 'PALETTE_WHITE',
      position: new XY(56, 13),
      w: 50,
      h: 19,
      layer: Layer.UI_LO
    },
    {
      id: 'UI_CHECKERBOARD_BLUE_GREY',
      position: new XY(55, 13),
      w: 1,
      h: 7,
      layer: Layer.UI_MID
    },
    {
      id: 'UI_CHECKERBOARD_BLUE_GREY',
      position: new XY(56, 12),
      w: 44,
      h: 1,
      layer: Layer.UI_MID
    },
    {
      id: 'PALETTE_WHITE',
      position: new XY(100, 1),
      w: 34,
      h: 31,
      layer: Layer.UI_LO
    },
    {
      id: 'UI_CHECKERBOARD_BLUE_GREY',
      position: new XY(100, 1),
      w: 1,
      h: 11,
      wrap: new XY(0, 1),
      layer: Layer.UI_MID
    },
    {
      id: 'UI_CHECKERBOARD_BLUE_GREY',
      position: new XY(101, 0),
      w: 32,
      h: 1,
      wrap: new XY(1, 0),
      layer: Layer.UI_MID
    },
    {
      id: 'UI_CHECKERBOARD_BLUE_GREY',
      position: new XY(133, 1),
      w: 1,
      h: 1,
      layer: Layer.UI_MID
    }
  ]).map(props => new Image(atlas, {...props, id: AtlasID[props.id]}))
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_LEVEL_EDITOR_PANEL_BACKGROUND,
  variant: LevelEditorPanelBackground.Variant.NONE,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.IMAGES,
  updatePredicate: UpdatePredicate.ALWAYS,
  state: LevelEditorPanelBackground.State.VISIBLE
})
