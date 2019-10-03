import {Backpacker} from '../entities/types/backpacker/Backpacker'
import {Button} from '../entities/types/button/Button'
import {Checkbox} from '../entities/types/checkbox/Checkbox'
import {Cloud} from '../entities/types/Cloud'
import {Cursor} from '../entities/types/cursor/Cursor'
import {DateVersionHash} from '../entities/types/dateVersionHash/DateVersionHash'
import {DestinationMarker} from '../entities/types/destinationMarker/DestinationMarker'
import {Entity} from './Entity'
import {EntityPicker} from '../entities/types/entityPicker/EntityPicker'
import {EntityType} from './EntityType'
import {ImageEntity} from '../entities/types/imageEntity/ImageEntity'
import {LevelEditorPanel} from '../entities/types/levelEditorPanel/LevelEditorPanel'
import {Marquee} from '../entities/types/marquee/Marquee'
import {Text} from '../entities/types/text/Text'

export namespace EntityFactory {
  export function produce(type: EntityType, props: Entity.Props): Entity {
    switch (type) {
      case EntityType.CHAR_BACKPACKER:
        return new Backpacker(props)
      case EntityType.IMAGE:
        return new ImageEntity(props)
      case EntityType.SCENERY_CLOUD:
        return new Cloud(props)
      case EntityType.UI_BUTTON:
        return new Button(props)
      case EntityType.UI_CHECKBOX:
        return new Checkbox(props)
      case EntityType.UI_CURSOR:
        return new Cursor(props)
      case EntityType.UI_DATE_VERSION_HASH:
        return new DateVersionHash(props)
      case EntityType.UI_DESTINATION_MARKER:
        return new DestinationMarker(props)
      case EntityType.UI_ENTITY_PICKER:
        return new EntityPicker(props)
      case EntityType.UI_LEVEL_EDITOR_PANEL:
        return new LevelEditorPanel(<LevelEditorPanel.Props>props)
      case EntityType.UI_MARQUEE:
        return new Marquee(props)
      case EntityType.UI_TEXT:
        return new Text(<Text.Props>props)
      default:
        return new Entity(props)
    }
  }
}
