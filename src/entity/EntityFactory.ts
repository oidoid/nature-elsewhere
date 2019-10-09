import {Atlas} from 'aseprite-atlas'
import {Backpacker} from '../entities/Backpacker'
import {Bee} from '../entities/Bee'
import {Bunny} from '../entities/Bunny'
import {Bush} from '../entities/Bush'
import {Button} from '../entities/Button'
import {Cattails} from '../entities/Cattails'
import {Checkbox} from '../entities/Checkbox'
import {Cloud} from '../entities/Cloud'
import {Clover} from '../entities/Clover'
import {Conifer} from '../entities/Conifer'
import {Cursor} from '../entities/Cursor'
import {DateVersionHash} from '../entities/DateVersionHash'
import {DestinationMarker} from '../entities/DestinationMarker'
import {Entity} from './Entity'
import {EntityPicker} from '../entities/EntityPicker'
import {EntityType} from './EntityType'
import {Flag} from '../entities/Flag'
import {Fly} from '../entities/Fly'
import {Frog} from '../entities/Frog'
import {Grass} from '../entities/Grass'
import {Group} from '../entities/group/Group'
import {IsoGrass} from '../entities/IsoGrass'
import {LevelEditorMenu} from '../entities/LevelEditorMenu'
import {LevelEditorPanelBackground} from '../entities/levelEditorPanel/LevelEditorPanelBackground'
import {LevelEditorPanel} from '../entities/levelEditorPanel/LevelEditorPanel'
import {LevelEditorSandbox} from '../entities/LevelEditorSandbox'
import {Marquee} from '../entities/Marquee'
import {Mountain} from '../entities/Mountain'
import {Path} from '../entities/Path'
import {Plane} from '../entities/Plane'
import {Pond} from '../entities/Pond'
import {Pyramid} from '../entities/Pyramid'
import {RadioCheckboxGroup} from '../entities/RadioCheckboxGroup'
import {Snake} from '../entities/Snake'
import {Subshrub} from '../entities/Subshrub'
import {Text} from '../entities/text/Text'
import {Toolbar} from '../entities/Toolbar'
import {Tree} from '../entities/Tree'
import {LevelLink} from '../entities/levelLink/LevelLink'

export namespace EntityFactory {
  export function produce(
    atlas: Atlas,
    props: Entity.SubProps<any, any>
  ): Entity {
    switch (props.type) {
      case EntityType.BACKPACKER:
        return new Backpacker(atlas, props)
      case EntityType.BEE:
        return new Bee(atlas, props)
      case EntityType.BUNNY:
        return new Bunny(atlas, props)
      case EntityType.FLY:
        return new Fly(atlas, props)
      case EntityType.FROG:
        return new Frog(atlas, props)
      case EntityType.SNAKE:
        return new Snake(atlas, props)
      case EntityType.GROUP:
        return new Group(props)
      case EntityType.LEVEL_EDITOR_MENU:
        return new LevelEditorMenu(atlas, props)
      case EntityType.LEVEL_EDITOR_SANDBOX:
        return new LevelEditorSandbox(props)
      case EntityType.BUSH:
        return new Bush(atlas, props)
      case EntityType.CATTAILS:
        return new Cattails(atlas, props)
      case EntityType.CLOUD:
        return new Cloud(atlas, props)
      case EntityType.CLOVER:
        return new Clover(atlas, props)
      case EntityType.CONIFER:
        return new Conifer(atlas, props)
      case EntityType.FLAG:
        return new Flag(atlas, props)
      case EntityType.GRASS:
        return new Grass(atlas, props)
      case EntityType.ISO_GRASS:
        return new IsoGrass(atlas, props)
      case EntityType.MOUNTAIN:
        return new Mountain(atlas, props)
      case EntityType.PATH:
        return new Path(atlas, props)
      case EntityType.PLANE:
        return new Plane(atlas, props)
      case EntityType.POND:
        return new Pond(atlas, props)
      case EntityType.PYRAMID:
        return new Pyramid(atlas, props)
      case EntityType.SUBSHRUB:
        return new Subshrub(atlas, props)
      case EntityType.TREE:
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
      case EntityType.UI_LEVEL_LINK:
        return new LevelLink(atlas, props)
      case EntityType.UI_MARQUEE:
        return new Marquee(atlas, props)
      case EntityType.UI_RADIO_CHECKBOX_GROUP:
        return new RadioCheckboxGroup(props)
      case EntityType.UI_TEXT:
        return new Text(atlas, props)
      case EntityType.UI_TOOLBAR:
        return new Toolbar(atlas, props)
    }
    throw new Error(`Unknown type "${props.type}."`)
  }
}
