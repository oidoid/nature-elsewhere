import {EntityState} from '../../entity-state/entity-state'
import {EntityType} from '../../entity-type/entity-type'
import {Updater} from '../../updaters/updater/updater'
import {UpdateState} from '../../updaters/update-state'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {InputSource} from '../../../inputs/input-source/input-source'
import {InputBit} from '../../../inputs/input-bit/input-bit'
import {Entity} from '../../entity/entity'
import {AtlasID} from '../../../atlas/atlas-id/atlas-id'
import {Atlas} from '../../../atlas/atlas/atlas'
import {Image} from '../../../images/image/image'
import * as memFont from '../../../assets/mem-font.json'
import {ImageRect} from '../../../images/image-rect/image-rect'
import {Recorder} from '../../../inputs/recorder/recorder'
import {ImageParser} from '../../../images/image/image-parser'
import {EntityParser} from '../../entity/entity-parser'
import {Text} from '../text/text'
import {TextConfig} from '../text/text-config'
import {ImageConfig} from '../../../images/image/image-config'
import {WH} from '../../../math/wh/wh'

export interface Checkbox extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_CHECKBOX
  state: EntityState | Checkbox.State
  checked: boolean
}

export namespace Checkbox {
  export enum State {
    UNCHECKED = 'unchecked',
    CHECKED = 'checked'
  }
  export const backgroundID: Readonly<
    Record<Checkbox.State, AtlasID>
  > = Object.freeze({
    [Checkbox.State.UNCHECKED]: AtlasID.PALETTE_PALE_GREEN,
    [Checkbox.State.CHECKED]: AtlasID.PALETTE_LIGHT_GREEN
  })

  export function parse(checkbox: Entity, atlas: Atlas): Checkbox {
    if (!EntityType.assert<Checkbox>(checkbox, EntityType.UI_CHECKBOX))
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
    Entity.invalidateBounds(checkbox)
  }

  function setBackground(checkbox: Checkbox, atlas: Atlas): void {
    const text = checkbox.children[0]
    for (const state of [Checkbox.State.UNCHECKED, Checkbox.State.CHECKED]) {
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

  export const update: Updater.Update = (checkbox, state) => {
    if (!EntityType.assert<Checkbox>(checkbox, EntityType.UI_CHECKBOX))
      throw new Error()
    const collision = UpdateState.collisionWithCursor(state, checkbox)
    if (!collision) return UpdateStatus.UNCHANGED

    const [set] = state.input.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]
    if (!pick || !Recorder.triggered(state.input, InputBit.PICK))
      return UpdateStatus.UNCHANGED

    const toggle =
      checkbox.state === State.UNCHECKED ? State.CHECKED : State.UNCHECKED
    checkbox.checked = toggle === State.CHECKED
    return Entity.setState(checkbox, toggle) | UpdateStatus.TERMINATE
  }
}

function newBackgroundImages(
  state: Checkbox.State,
  atlas: Atlas,
  {w, h}: WH
): Image[] {
  const id = Checkbox.backgroundID[state]
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
