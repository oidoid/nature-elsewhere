import {EntityType} from '../../entityType/EntityType'
import {Entity} from '../../entity/Entity'
import {Atlas} from '../../../atlas/atlas/Atlas'
import {Checkbox} from './Checkbox'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {TextConfig} from '../text/TextConfig'

import {Image} from '../../../images/image/Image'
import {ImageRect} from '../../../images/imageRect/ImageRect'
import {ImageParser} from '../../../images/image/ImageParser'
import {ImageConfig} from '../../../images/image/ImageConfig'
import {WH} from '../../../math/wh/WH'
import {AtlasID} from '../../../atlas/atlasID/AtlasID'
import {CheckboxState} from './CheckboxState'
import {IEntityParser} from '../../RecursiveEntityParser'
import {Layer} from '../../../images/layer/Layer'

export namespace CheckboxParser {
  export function parse(
    checkbox: Entity,
    atlas: Atlas,
    parser: IEntityParser
  ): Checkbox {
    if (!EntityTypeUtil.assert<Checkbox>(checkbox, EntityType.UI_CHECKBOX))
      throw new Error()
    setText(checkbox, 0, checkbox.text, atlas, parser)
    if (!('checked' in checkbox)) (<Checkbox>checkbox).checked = false
    return <Checkbox>checkbox
  }

  export function setText(
    checkbox: Checkbox,
    layer: Layer,
    text: string,
    atlas: Atlas,
    parser: IEntityParser
  ): void {
    checkbox.text = text
    const config: TextConfig = {
      type: EntityType.UI_TEXT,
      text: text,
      textLayer: checkbox.textLayer,
      textScale: {...checkbox.textScale},
      textMaxSize: {...checkbox.textMaxSize},
      position: {
        x: checkbox.bounds.position.x + 1,
        y: checkbox.bounds.position.y
      },
      imageID: Entity.imageRect(checkbox).imageID
    }
    const child = parser(config, atlas)
    Entity.elevate(child, layer)
    checkbox.children[0] = child
    setBackground(checkbox, layer, atlas)
    Entity.invalidateBounds(checkbox)
  }
}

function setBackground(checkbox: Checkbox, layer: Layer, atlas: Atlas): void {
  const text = checkbox.children[0]
  for (const state of [CheckboxState.UNCHECKED, CheckboxState.CHECKED]) {
    const size = {w: text.bounds.size.w, h: text.bounds.size.h}
    checkbox.machine.map[state].images.length = 0
    const images = newBackgroundImages(state, layer, atlas, size)
    for (const image of images)
      ImageRect.add(checkbox.machine.map[state], image)
    ImageRect.moveTo(checkbox.machine.map[state], {
      x: text.bounds.position.x - 1,
      y: checkbox.bounds.position.y
    })
  }
}

function newBackgroundImages(
  state: CheckboxState,
  layerOffset: Layer,
  atlas: Atlas,
  {w, h}: WH
): Image[] {
  const id = backgroundID[state]
  const layer = 'UI_MID'
  const background: ImageConfig = {
    id,
    bounds: {position: {x: 1}, size: {w, h}},
    layer
  }
  const border: ImageConfig = {
    id,
    bounds: {position: {y: 1}, size: {w: w + 2, h: h - 2}},
    layer
  }
  const backgroundImage = ImageParser.parse(background, atlas)
  const borderImage = ImageParser.parse(border, atlas)
  Image.elevate(backgroundImage, layerOffset)
  Image.elevate(borderImage, layerOffset)
  return [backgroundImage, borderImage]
}
const backgroundID: Readonly<Record<CheckboxState, AtlasID>> = Object.freeze({
  [CheckboxState.UNCHECKED]: AtlasID.PALETTE_PALE_GREEN,
  [CheckboxState.CHECKED]: AtlasID.PALETTE_LIGHT_GREEN
})
