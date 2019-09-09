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
  export const make = (layout: ShaderLayout, atlas: Atlas): t => ({
    level: LevelParser.parse(atlas, LevelConfigs.fields),
    store: Store.make(layout, atlas)
  })

  export const update = (
    {level, store}: t,
    cam: Rect,
    time: number,
    recorder: Recorder
  ): LevelStateMachine => ({
    level,
    store: level
      ? Store.update(store, cam, level.entities, level, time, recorder)
      : store
  })
}
