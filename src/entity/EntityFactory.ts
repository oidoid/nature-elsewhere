import {Backpacker} from '../entities/types/Backpacker'
import {Button} from '../entities/types/Button'
import {Cloud} from '../entities/types/Cloud'
import {Cursor} from '../entities/types/Cursor'
import {DestinationMarker} from '../entities/types/DestinationMarker'
import {Entity} from './Entity'
import {EntityType} from './EntityType'
import {LevelEditorPanel} from '../entities/types/levelEditorPanel/LevelEditorPanel'
import {Marquee} from '../entities/types/marquee/Marquee'
import {ImageEntityParser} from '../entities/types/imageEntity/ImageEntityParser'
import {EntityConfig} from './EntityParser'
import {Atlas} from 'aseprite-atlas'
import {TextParser, TextConfig} from '../entities/types/text/TextParser'
import {CheckboxParser} from '../entities/types/checkbox/CheckboxParser'
import {EntityPickerParser} from '../entities/types/entityPicker/EntityPickerParser'
import {IEntityParser} from '../entities/RecursiveEntityParser'
import {LevelEditorPanelBackground} from '../entities/types/levelEditorPanel/LevelEditorPanelBackground'
import {DateVersionHash} from '../entities/types/DateVersionHash'
import {Bee} from '../entities/types/Bee'
import {Flag} from '../entities/types/Flag'
import {Conifer} from '../entities/types/Conifer'
import {Subshrub} from '../entities/types/Subshrub'
import {Bush} from '../entities/types/Bush'
import {Pond} from '../entities/types/Pond'
import {Grass} from '../entities/types/Grass'
import {Path} from '../entities/types/Path'
import {Cattails} from '../entities/types/Cattails'
import {Clover} from '../entities/types/Clover'
import {Tree} from '../entities/types/Tree'
import {IsoGrass} from '../entities/types/IsoGrass'
import {Mountain} from '../entities/types/Mountain'
import {Pyramid} from '../entities/types/Pyramid'
import {Plane} from '../entities/types/Plane'
import {Bunny} from '../entities/types/Bunny'
import {Frog} from '../entities/types/Frog'
import {Fly} from '../entities/types/Fly'
import {Snake} from '../entities/types/Snake'
import {Toolbar} from '../entities/types/Toolbar'

export namespace EntityFactory {
  export function produce(
    config: EntityConfig,
    type: EntityType,
    props: Entity.Props,
    atlas: Atlas,
    parser: IEntityParser
  ): Entity {
    switch (type) {
      case EntityType.CHAR_BACKPACKER:
        return new Backpacker(atlas, props)
      case EntityType.CHAR_BEE:
        return new Bee(atlas, props)
      case EntityType.CHAR_BUNNY:
        return new Bunny(atlas, props)
      case EntityType.CHAR_FLY:
        return new Fly(atlas, props)
      case EntityType.CHAR_FROG:
        return new Frog(atlas, props)
      case EntityType.CHAR_SNAKE:
        return new Snake(atlas, props)
      case EntityType.IMAGE:
        return ImageEntityParser.parse(config, props, atlas)
      case EntityType.SCENERY_BUSH:
        return new Bush(atlas, props)
      case EntityType.SCENERY_CATTAILS:
        return new Cattails(atlas, props)
      case EntityType.SCENERY_CLOVER:
        return new Clover(atlas, props)
      case EntityType.SCENERY_CLOUD:
        return new Cloud(atlas, props)
      case EntityType.SCENERY_CONIFER:
        return new Conifer(atlas, props)
      case EntityType.SCENERY_FLAG:
        return new Flag(atlas, props)
      case EntityType.SCENERY_GRASS:
        return new Grass(atlas, props)
      case EntityType.SCENERY_ISO_GRASS:
        return new IsoGrass(atlas, props)
      case EntityType.SCENERY_MOUNTAIN:
        return new Mountain(atlas, props)
      case EntityType.SCENERY_PATH:
        return new Path(atlas, props)
      case EntityType.SCENERY_PLANE:
        return new Plane(atlas, props)
      case EntityType.SCENERY_POND:
        return new Pond(atlas, props)
      case EntityType.SCENERY_PYRAMID:
        return new Pyramid(atlas, props)
      case EntityType.SCENERY_SUBSHRUB:
        return new Subshrub(atlas, props)
      case EntityType.SCENERY_TREE:
        return new Tree(atlas, props)
      case EntityType.UI_BUTTON:
        return new Button(atlas, props)
      case EntityType.UI_CHECKBOX:
        return CheckboxParser.parse(<TextConfig>config, props, atlas)
      case EntityType.UI_CURSOR:
        return new Cursor(atlas, props)
      case EntityType.UI_DATE_VERSION_HASH:
        return new DateVersionHash(atlas, props)
      case EntityType.UI_DESTINATION_MARKER:
        return new DestinationMarker(atlas, props)
      case EntityType.UI_ENTITY_PICKER:
        return EntityPickerParser.parse(props, atlas, parser)
      case EntityType.UI_LEVEL_EDITOR_PANEL:
        return new LevelEditorPanel(atlas, <LevelEditorPanel.Props>props)
      case EntityType.UI_LEVEL_EDITOR_PANEL_BACKGROUND:
        return new LevelEditorPanelBackground(atlas, props)
      case EntityType.UI_MARQUEE:
        return new Marquee(props)
      case EntityType.UI_TEXT:
        return TextParser.parse(<TextConfig>config, props, atlas)
      case EntityType.UI_TOOLBAR:
        return new Toolbar(atlas, props)
      default:
        return new Entity(props)
    }
  }
}
