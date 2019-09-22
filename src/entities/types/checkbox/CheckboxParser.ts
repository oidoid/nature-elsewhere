import {EntityType} from '../../entityType/EntityType'
import {Entity} from '../../entity/Entity'
import {Atlas} from '../../../atlas/atlas/Atlas'
import {Checkbox} from './Checkbox'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {TextConfig} from '../text/TextConfig'
import {EntityUtil} from '../../entity/EntityUtil'
import {Image} from '../../../images/image/Image'
import * as memFont from '../../../text/textLayout/memFont.json'
import {ImageRect} from '../../../images/imageRect/ImageRect'
import {ImageParser} from '../../../images/image/ImageParser'
import {ImageConfig} from '../../../images/image/ImageConfig'
import {WH} from '../../../math/wh/WH'
import {AtlasID} from '../../../atlas/atlasID/AtlasID'
import {CheckboxState} from './CheckboxState'
import {IEntityParser} from '../../RecursiveEntityParser'

export namespace CheckboxParser {
  export function parse(
    checkbox: Entity,
    atlas: Atlas,
    parser: IEntityParser
  ): Checkbox {
    if (!EntityTypeUtil.assert<Checkbox>(checkbox, EntityType.UI_CHECKBOX))
      throw new Error()
    setText(checkbox, checkbox.text, atlas, parser)
    if (!('checked' in checkbox)) (<Checkbox>checkbox).checked = false
    return <Checkbox>checkbox
  }

  export function setText(
    checkbox: Checkbox,
    text: string,
    atlas: Atlas,
    parser: IEntityParser
  ): void {
    checkbox.text = text
    const config: TextConfig = {
      type: EntityType.UI_TEXT,
      text: text,
      textLayer: checkbox.textLayer,
      textScale: checkbox.textScale,
      textMaxSize: checkbox.textMaxSize,
      position: {x: checkbox.bounds.x, y: checkbox.bounds.y}
    }
    const child = parser(config, atlas)
    checkbox.children[0] = child
    setBackground(checkbox, atlas)
    EntityUtil.invalidateBounds(checkbox)
  }
}

function setBackground(checkbox: Checkbox, atlas: Atlas): void {
  const text = checkbox.children[0]
  for (const state of [CheckboxState.UNCHECKED, CheckboxState.CHECKED]) {
    const size = {
      w: text.bounds.w,
      // Do not shrink when a descender is not present.
      h: Math.max(text.bounds.h, memFont.lineHeight - memFont.leadingPadding)
    }
    checkbox.machine.map[state].images.length = 0
    const images = newBackgroundImages(state, atlas, size)
    images.forEach(image => ImageRect.add(checkbox.machine.map[state], image))
    checkbox.machine.map[state].bounds.x = 0
    checkbox.machine.map[state].bounds.y = 0
    ImageRect.moveTo(checkbox.machine.map[state], {
      x: text.bounds.x,
      y: checkbox.bounds.y
    })
  }
}

function newBackgroundImages(
  state: CheckboxState,
  atlas: Atlas,
  {w, h}: WH
): Image[] {
  const id = backgroundID[state]
  const layer = 'UI_MID'
  const background: ImageConfig = {id, bounds: {w, h}, layer}
  const border: ImageConfig = {
    id,
    bounds: {x: -1, y: 1, w: w + 2, h: h - 2},
    layer
  }
  return [
    ImageParser.parse(background, atlas),
    ImageParser.parse(border, atlas)
  ]
}
const backgroundID: Readonly<Record<CheckboxState, AtlasID>> = Object.freeze({
  [CheckboxState.UNCHECKED]: AtlasID.PALETTE_PALE_GREEN,
  [CheckboxState.CHECKED]: AtlasID.PALETTE_LIGHT_GREEN
})
