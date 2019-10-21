import {AtlasID} from '../../atlas/AtlasID'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {CollisionType} from '../../collision/CollisionType'
import {Entity} from '../../entity/Entity'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {JSONValue} from '../../utils/JSON'
import {Layer} from '../../sprite/Layer'
import {Sprite} from '../../sprite/Sprite'
import {SpriteRect} from '../../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../../updaters/UpdatePredicate'

export class LevelEditorPanelBackground extends Entity<
  LevelEditorPanelBackground.Variant,
  LevelEditorPanelBackground.State
> {
  constructor(
    props?: Entity.SubProps<
      LevelEditorPanelBackground.Variant,
      LevelEditorPanelBackground.State
    >
  ) {
    super({
      ...defaults,
      map: {
        [LevelEditorPanelBackground.State.VISIBLE]: new SpriteRect({
          sprites: newBackgroundSprites()
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

function newBackgroundSprites(): Sprite[] {
  return [
    {
      id: AtlasID.PALETTE_WHITE,
      x: 1,
      y: 21,
      w: 55,
      h: 11,
      layer: Layer.ABOVE_PLANE
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      y: 21,
      w: 1,
      h: 11,
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      x: 1,
      y: 20,
      w: 55,
      h: 1,
      layer: Layer.UI_MID
    },
    {id: AtlasID.PALETTE_WHITE, x: 56, y: 13, w: 50, h: 19, layer: Layer.UI_LO},
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      x: 55,
      y: 13,
      w: 1,
      h: 7,
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      x: 56,
      y: 12,
      w: 44,
      h: 1,
      layer: Layer.UI_MID
    },
    {id: AtlasID.PALETTE_WHITE, x: 100, y: 1, w: 34, h: 31, layer: Layer.UI_LO},
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      x: 100,
      y: 1,
      w: 1,
      h: 11,
      wy: 1,
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      x: 101,
      w: 32,
      h: 1,
      wx: 1,
      layer: Layer.UI_MID
    },
    {
      id: AtlasID.UI_CHECKERBOARD_BLUE_GREY,
      x: 133,
      y: 1,
      w: 1,
      h: 1,
      layer: Layer.UI_MID
    }
  ].map(props => new Sprite(props))
}

const defaults = Object.freeze({
  type: EntityType.UI_LEVEL_EDITOR_PANEL_BACKGROUND,
  variant: LevelEditorPanelBackground.Variant.NONE,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.SPRITES,
  updatePredicate: UpdatePredicate.ALWAYS,
  state: LevelEditorPanelBackground.State.VISIBLE
})
