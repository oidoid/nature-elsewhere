import {Backpacker} from '../entityTypes/Backpacker'
import {Button} from '../entityTypes/Button'
import {Cloud} from '../entityTypes/Cloud'
import {Cursor} from '../entityTypes/Cursor'
import {DestinationMarker} from '../entityTypes/DestinationMarker'
import {Entity} from './Entity'
import {EntityType} from './EntityType'
import {LevelEditorPanel} from '../entityTypes/levelEditorPanel/LevelEditorPanel'
import {Marquee} from '../entityTypes/Marquee'
import {Atlas} from 'aseprite-atlas'
import {LevelEditorPanelBackground} from '../entityTypes/levelEditorPanel/LevelEditorPanelBackground'
import {DateVersionHash} from '../entityTypes/DateVersionHash'
import {Bee} from '../entityTypes/Bee'
import {Flag} from '../entityTypes/Flag'
import {Conifer} from '../entityTypes/Conifer'
import {Subshrub} from '../entityTypes/Subshrub'
import {Bush} from '../entityTypes/Bush'
import {Pond} from '../entityTypes/Pond'
import {Grass} from '../entityTypes/Grass'
import {Path} from '../entityTypes/Path'
import {Cattails} from '../entityTypes/Cattails'
import {Clover} from '../entityTypes/Clover'
import {Tree} from '../entityTypes/Tree'
import {IsoGrass} from '../entityTypes/IsoGrass'
import {Mountain} from '../entityTypes/Mountain'
import {Pyramid} from '../entityTypes/Pyramid'
import {Plane} from '../entityTypes/Plane'
import {Bunny} from '../entityTypes/Bunny'
import {Frog} from '../entityTypes/Frog'
import {Fly} from '../entityTypes/Fly'
import {Snake} from '../entityTypes/Snake'
import {Toolbar} from '../entityTypes/Toolbar'
import {RadioCheckboxGroup} from '../entityTypes/RadioCheckboxGroup'
import {Group} from '../entityTypes/Group'
import {EntityPicker} from '../entityTypes/entityPicker/EntityPicker'
import {Checkbox} from '../entityTypes/Checkbox'
import {Text} from '../entityTypes/text/Text'

export namespace EntityFactory {
  export function produce(atlas: Atlas, props: Entity.Props): Entity {
    switch (props.type) {
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
      case EntityType.GROUP:
        return new Group(props)
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
        return new Checkbox(atlas, props)
      case EntityType.UI_CURSOR:
        return new Cursor(atlas, props)
      case EntityType.UI_DATE_VERSION_HASH:
        return new DateVersionHash(atlas, props)
      case EntityType.UI_DESTINATION_MARKER:
        return new DestinationMarker(atlas, props)
      case EntityType.UI_ENTITY_PICKER:
        return new EntityPicker(atlas, props)
      case EntityType.UI_LEVEL_EDITOR_PANEL:
        return new LevelEditorPanel(atlas, props)
      case EntityType.UI_LEVEL_EDITOR_PANEL_BACKGROUND:
        return new LevelEditorPanelBackground(atlas, props)
      case EntityType.UI_MARQUEE:
        return new Marquee(atlas, props)
      case EntityType.UI_RADIO_CHECKBOX_GROUP:
        return new RadioCheckboxGroup(props)
      case EntityType.UI_TEXT:
        return new Text(atlas, props)
      case EntityType.UI_TOOLBAR:
        return new Toolbar(atlas, props)
    }
  }
}
