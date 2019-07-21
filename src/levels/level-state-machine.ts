import * as Atlas from '../atlas/atlas'
import {Level} from './level'
import * as LevelParser from './level-parser'
import {ShaderLayout} from '../graphics/shaders/shader-layout'
import * as Store from '../store/store'
import * as titleLevelConfig from './level-configs/title-level-config.json'

export interface State {
  readonly level?: Level
  readonly store: Store.State
  update(state: State, cam: Rect, time: number): State
}

export function make(layout: ShaderLayout, atlas: Atlas.State): State {
  const level = LevelParser.parse(atlas, titleLevelConfig)
  return {level, store: Store.make(layout, atlas), update}
}

export function update(state: State, cam: Rect, time: number): State {
  if (!state.level) return state
  const store = Store.update(state.store, cam, state.level.entities, time)
  return {level: state.level, store, update}
}
