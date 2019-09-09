import {Atlas} from '../atlas/atlas'
import {Level} from './level'
import {LevelConfigs} from './level-configs'
import {LevelParser} from './level-parser'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {ShaderLayout} from '../graphics/shaders/shader-layout'
import {Store} from '../store/store'

export interface LevelStateMachine {
  readonly level?: Level
  readonly store: Store
}
type t = LevelStateMachine

export namespace LevelStateMachine {
  export const make = (layout: ShaderLayout, atlas: Atlas): t => {
    const level = LevelParser.parse(atlas, LevelConfigs.title)
    return {level, store: Store.make(layout, atlas)}
  }

  export const update = (
    val: t,
    cam: Rect,
    time: number,
    recorder: Recorder
  ): LevelStateMachine => {
    if (!val.level) return val
    const store = Store.update(
      val.store,
      cam,
      val.level.entities,
      val.level,
      time,
      recorder
    )
    return {level: val.level, store}
  }
}
