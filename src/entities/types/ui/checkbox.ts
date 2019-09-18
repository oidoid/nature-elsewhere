import {Text} from './text'
import {EntityState} from '../../entity-state'
import {EntityType} from '../entity-type'
import {Updater} from '../../updaters/updater'
import {UpdateState} from '../../updaters/update-state'
import {UpdateStatus} from '../../updaters/update-status'
import {InputSource} from '../../../inputs/input-source'
import {InputBit} from '../../../inputs/input-bit'
import {Entity} from '../../entity'
import {AnimationID} from '../../../atlas/animation-id'
import {Atlas} from '../../../atlas/atlas'
import {Image} from '../../../images/image'
import {ImageParser} from '../../../images/parsers/image-parser'
import * as memFont from '../../../assets/mem-font.json'
import {ImageRect} from '../../../images/image-rect'
import {Recorder} from '../../../inputs/recorder'
import {EntityParser} from '../../parsers/entity-parser'
import {Rect} from '../../../math/rect'

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
    Record<Checkbox.State, AnimationID>
  > = Object.freeze({
    [Checkbox.State.UNCHECKED]: AnimationID.PALETTE_PALE_GREEN,
    [Checkbox.State.CHECKED]: AnimationID.PALETTE_LIGHT_GREEN
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
    const config: Text.Config = {
      type: EntityType.UI_TEXT,
      text: text,
      textLayer: checkbox.textLayer,
      textScale: checkbox.textScale,
      textMaxSize: checkbox.textMaxSize,
      position: {x: checkbox.bounds.x + 1, y: checkbox.bounds.y}
    }
    const child = EntityParser.parse(config, atlas)
    checkbox.children[0] = child
    setBackground(checkbox, atlas)
    Entity.invalidateBounds(checkbox)
  }

  function setBackground(checkbox: Checkbox, atlas: Atlas): void {
    const text = checkbox.children[0]
    for (const state of [Checkbox.State.UNCHECKED, Checkbox.State.CHECKED]) {
      const bounds = {
        x: text.bounds.x - 1,
        y: text.bounds.y,
        w: text.bounds.w,
        // Do not shrink when a descender is not present.
        h: Math.max(text.bounds.h, memFont.lineHeight - memFont.leadingPadding)
      }
      checkbox.imageStates[state].images.length = 0
      const images = newBackgroundImages(state, atlas, bounds)
      images.forEach(image => ImageRect.add(checkbox.imageStates[state], image))
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
  {x, y, w, h}: Rect
): Image[] {
  const id = Checkbox.backgroundID[state]
  const layer = 'UI_MID'
  const background = {id, bounds: {x: x + 1, y, w, h}, layer}
  const border = {id, bounds: {x, y: y + 1, w: w + 2, h: h - 2}, layer}
  return [
    ImageParser.parse(background, atlas),
    ImageParser.parse(border, atlas)
  ]
}
