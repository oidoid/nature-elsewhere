import {EntityType} from '../../entity-type/entity-type'
import {Entity} from '../../entity/entity'
import {Atlas} from '../../../atlas/atlas/atlas'
import {Checkbox} from './checkbox'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {TextConfig} from '../text/text-config'
import {EntityParser} from '../../entity/entity-parser'
import {EntityUtil} from '../../entity/entity-util'
import {Image} from '../../../images/image/image'
import * as memFont from '../../../text/text-layout/mem-font.json'
import {ImageRect} from '../../../images/image-rect/image-rect'
import {ImageParser} from '../../../images/image/image-parser'
import {ImageConfig} from '../../../images/image/image-config'
import {WH} from '../../../math/wh/wh'
import {AtlasID} from '../../../atlas/atlas-id/atlas-id'
import {CheckboxState} from './checkbox-state'

export namespace CheckboxParser {
  export function parse(checkbox: Entity, atlas: Atlas): Checkbox {
    if (!EntityTypeUtil.assert<Checkbox>(checkbox, EntityType.UI_CHECKBOX))
      throw new Error()
    setText(checkbox, checkbox.text, atlas)
    if (!('checked' in checkbox)) (<Checkbox>checkbox).checked = false
    return <Checkbox>checkbox
  }

  export function setText(
    checkbox: Checkbox,
    text: string,
    atlas: Atlas
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
    const child = EntityParser.parse(config, atlas)
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
    checkbox.imageStates[state].images.length = 0
    const images = newBackgroundImages(state, atlas, size)
    images.forEach(image => ImageRect.add(checkbox.imageStates[state], image))
    checkbox.imageStates[state].bounds.x = 0
    checkbox.imageStates[state].bounds.y = 0
    ImageRect.moveTo(checkbox.imageStates[state], {
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
