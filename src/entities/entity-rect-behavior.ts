import {EntityRect} from './entity-rect'
import {Entity} from './entity'
import {Atlas} from '../atlas/atlas'
import {Rect} from '../math/rect'
import {Level} from '../levels/level'
import {Recorder} from '../inputs/recorder'
import {Image} from '../images/image'
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

    let ret: Image[] = []
    for (const ent of val.entities) {
      if (!UIEditorLabelButton.is(ent)) {
        ret = [...ret]
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

      // console.log(x, y, pick ? pick.xy.x : undefined, pick?  pick.xy.y:undefined)
      // get the old image. update takes effect next frame.
      // ret = [...ret, ...ent.states[ent.state].images]
      // console.log(cursor && cursor.states[cursor.state], pick && pick.xy)
      if (
        pick &&
        Recorder.triggered(recorder, InputBit.PICK) &&
        cursor &&
        Rect.intersects(
          ent.states[ent.state],
          cursor.states[
            cursor.state
          ] /*{
          x: pick.xy.x,
          y: pick.xy.y,
          w: cursor.states[cursor.state].w,
          h: cursor.states[cursor.state].h
        }*/
        )
      ) {
        // console.log('intersect')
        const selected: Maybe<Entity> = (<any>val).selected
        if (selected && selected !== ent) {
          const fanyc = selected.states[selected.state]
          selected.state = 'deselected'
          selected.states[selected.state] = ImageRect.moveTo(
            selected.states[selected.state],
            fanyc
          )
        }
        ent.state = ent.state === 'selected' ? 'deselected' : 'selected'
        ;(<any>val).selected = ent.state === 'selected' ? ent : undefined
      }
      ent.states[ent.state] = ImageRect.moveTo(ent.states[ent.state], {x, y})

      ret = [...ret, ...ent.states[ent.state].images]
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
    // the problem is that this generates a list of images. this list of iamges
    // contains hte previous button images. since the state changes in the
    // update, the camera hcange in EntityRect.moveTo doesn't apply until the subsequent update
    // update the children first so that the origin for the previous frame's
    // input doesn't change?
    const ret = EntityRect.filterUpdate(
        val.entities,
        entities,
        atlas,
        cam,
        level,
        milliseconds,
        recorder
      )

      // this is now a double render pass instead of single recursive pass.
    ;({x: val.x, y: val.y, w: val.w, h: val.h} = EntityRect.moveTo(val, {
      x: cam.x + cam.w - val.w,
      y: cam.y + cam.h - val.h
    }))

    return ret
  }
})

export namespace EntityRectBehavior {
  export type Key = keyof typeof EntityRectBehavior
}
