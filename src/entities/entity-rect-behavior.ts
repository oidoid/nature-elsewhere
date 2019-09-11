import {EntityRect} from './entity-rect'
import {Entity} from './entity'
import {Atlas} from '../atlas/atlas'
import {Rect} from '../math/rect'
import {Level} from '../levels/level'
import {Recorder} from '../inputs/recorder'
import {InputSource} from '../inputs/input-source'
import {UIEditorLabelButton} from './ui-editor-label-button'
import {ImageRect} from '../images/image-rect'
import {InputBit} from '../inputs/input-bit'

export const EntityRectBehavior = Object.freeze({
  NONE(
    val: EntityRect,
    entities: (Entity | EntityRect)[],
    atlas: Atlas,
    cam: Rect,
    level: Level,
    milliseconds: number,
    recorder: Recorder
  ): void {
    EntityRect.filterUpdate(
      val.entities,
      entities,
      atlas,
      cam,
      level,
      milliseconds,
      recorder
    )
  },
  PICK_ONE(
    val: EntityRect,
    entities: (Entity | EntityRect)[],
    atlas: Atlas,
    cam: Rect,
    level: Level,
    milliseconds: number,
    recorder: Recorder
  ): void {
    const cursor = EntityRect.find(entities, 'cursor')
    const [set] = recorder.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]

    // Only UIEditorLabel children are permitted

    for (const ent of val.entities) {
      if (!UIEditorLabelButton.is(ent)) {
        EntityRect.filterUpdate(
          [ent],
          entities,
          atlas,
          cam,
          level,
          milliseconds,
          recorder
        )
        continue
      }
      const {x, y} = ent.states[ent.state]

      // get the old image. update takes effect next frame.
      // ret = [...ret, ...ent.states[ent.state].images]
      if (
        pick &&
        Recorder.triggered(recorder, InputBit.PICK) &&
        cursor &&
        Rect.intersects(ent.states[ent.state], cursor.states[cursor.state])
      ) {
        const selected: Maybe<Entity> = (<any>val).selected
        if (selected && selected !== ent) {
          const {x, y} = selected.states[selected.state]
          selected.state = 'deselected'
          selected.states[selected.state] = ImageRect.moveTo(
            selected.states[selected.state],
            {x, y}
          )
        }
        ent.state = ent.state === 'selected' ? 'deselected' : 'selected'
        ;(<any>val).selected = ent.state === 'selected' ? ent : undefined
      }
      ent.states[ent.state] = ImageRect.moveTo(ent.states[ent.state], {x, y})
    }
  },
  FOLLOW_CAM_SE(
    val: EntityRect,
    entities: (Entity | EntityRect)[],
    atlas: Atlas,
    cam: Rect,
    level: Level,
    milliseconds: number,
    recorder: Recorder
  ): void {
    // update the children first so that the origin for the previous frame's
    // input doesn't change?
    EntityRect.filterUpdate(
      val.entities,
      entities,
      atlas,
      cam,
      level,
      milliseconds,
      recorder
    )
    ;({x: val.x, y: val.y, w: val.w, h: val.h} = EntityRect.moveTo(val, {
      x: cam.x + cam.w - val.w,
      y: cam.y + cam.h - val.h
    }))
  }
})

export namespace EntityRectBehavior {
  export type Key = keyof typeof EntityRectBehavior
}
