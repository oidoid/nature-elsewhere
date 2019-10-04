import {Backpacker} from '../entities/types/backpacker/Backpacker'
import {Button} from '../entities/types/Button'
import {Cloud} from '../entities/types/Cloud'
import {Cursor} from '../entities/types/cursor/Cursor'
import {DestinationMarker} from '../entities/types/destinationMarker/DestinationMarker'
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
        return new Backpacker(props)
      case EntityType.IMAGE:
        return ImageEntityParser.parse(config, props, atlas)
      case EntityType.SCENERY_CLOUD:
        return new Cloud(props)
      case EntityType.UI_BUTTON:
        return new Button(atlas, props)
      case EntityType.UI_CHECKBOX:
        return CheckboxParser.parse(<TextConfig>config, props, atlas)
      case EntityType.UI_CURSOR:
        return new Cursor(atlas, props)
      case EntityType.UI_DATE_VERSION_HASH:
        return new DateVersionHash(atlas, props)
      case EntityType.UI_DESTINATION_MARKER:
        return new DestinationMarker(props)
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
      default:
        return new Entity(props)
    }
  }
}
