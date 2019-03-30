import * as strings from '../../assets/strings.json'
import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {BorderBox} from './border-box'
import {Image} from '../../images/image'
import {Palette} from '../../images/palette'
import {Panel} from './panel'
import {Text} from '../../text/text'

export namespace ControllerMappingPanel {
  export function create(
    atlas: Atlas.Definition,
    layer: number,
    target: XY
  ): readonly Image[] {
    return Image.moveBy(target, [
      ...Panel.create(
        atlas,
        strings['ui/settings/controller-mapping/title'],
        layer,
        {...target, w: 137, h: 69}
      ),
      Image.new(atlas, AnimationID.UI_CONTROLLER_MAPPING_SOURCE_KEYBOARD, {
        layer: layer + 1,
        position: {x: 32, y: 7}
      }),
      ...Image.moveBy(
        {x: 32 + 17 + 2, y: 7 + 2},
        Text.toImages(
          atlas,
          strings['ui/settings/controller-mapping/source/keyboard'],
          {layer: layer + 1}
        )
      ),
      Image.new(atlas, AnimationID.UI_CONTROLLER_MAPPING_SOURCE_GAMEPAD, {
        layer: layer + 1,
        position: {x: 85, y: 7}
      }),
      ...Image.moveBy(
        {x: 85 + 14 + 2, y: 7 + 2},
        Text.toImages(
          atlas,
          strings['ui/settings/controller-mapping/source/gamepad'],
          {layer: layer + 1}
        )
      ),
      ...Image.moveBy(
        {x: 5, y: 18},
        newControllerMappingInputRow(
          atlas,
          AnimationID.UI_CONTROLLER_MAPPING_INPUT_UP,
          layer + 1,
          strings['ui/settings/controller-mapping/input/up']
        )
      ),
      ...Image.moveBy(
        {x: 5, y: 28},
        newControllerMappingInputRow(
          atlas,
          AnimationID.UI_CONTROLLER_MAPPING_INPUT_RIGHT,
          layer + 1,
          strings['ui/settings/controller-mapping/input/right']
        )
      ),
      ...Image.moveBy(
        {x: 5, y: 38},
        newControllerMappingInputRow(
          atlas,
          AnimationID.UI_CONTROLLER_MAPPING_INPUT_DOWN,
          layer + 1,
          strings['ui/settings/controller-mapping/input/down']
        )
      ),
      ...Image.moveBy(
        {x: 5, y: 48},
        newControllerMappingInputRow(
          atlas,
          AnimationID.UI_CONTROLLER_MAPPING_INPUT_LEFT,
          layer + 1,
          strings['ui/settings/controller-mapping/input/left']
        )
      ),
      ...Image.moveBy(
        {x: 5, y: 58},
        newControllerMappingInputRow(
          atlas,
          AnimationID.UI_CONTROLLER_MAPPING_INPUT_MENU,
          layer + 1,
          'Menu'
        )
      )
    ])
  }

  function newControllerMappingInputRow(
    atlas: Atlas.Definition,
    animationID: AnimationID,
    layer: number,
    title: string
  ): readonly Image[] {
    return [
      Image.new(atlas, animationID, {layer}),
      ...Image.moveBy({x: 8, y: 2}, Text.toImages(atlas, title, {layer})),
      ...Image.moveBy(
        {x: 27, y: 0},
        BorderBox.create(
          atlas,
          Palette.YELLOWS,
          BorderBox.Border.SOLID,
          Palette.GREYS,
          layer,
          {w: 47, h: 6}
        )
      ),
      ...Image.moveBy(
        {x: 80, y: 0},
        BorderBox.create(
          atlas,
          Palette.YELLOWS,
          BorderBox.Border.SOLID,
          Palette.GREYS,
          layer,
          {w: 47, h: 6}
        )
      )
    ]
  }
}
