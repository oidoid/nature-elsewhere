import {Atlas} from '../atlas/atlas'
import {Level} from './level'
import {LevelParser} from './level-parser'
import {Rect} from '../math/rect'
import {ShaderLayout} from '../graphics/shaders/shader-layout'
import {Store} from '../store/store'
import * as titleLevelConfig from '../assets/levels/field.json'

export interface LevelStateMachine {
  readonly level?: Level
  readonly store: Store
  update(state: LevelStateMachine, cam: Rect, time: number): LevelStateMachine
}

export namespace LevelStateMachine {
  export function make(layout: ShaderLayout, atlas: Atlas): LevelStateMachine {
    const level = LevelParser.parse(atlas, titleLevelConfig)
    return {level, store: Store.make(layout, atlas), update}
  }

  export function update(
    state: LevelStateMachine,
    cam: Rect,
    time: number
  ): LevelStateMachine {
    if (!state.level) return state
    const store = Store.update(state.store, cam, state.level.entities, time)
    return {level: state.level, store, update}
  }
}
