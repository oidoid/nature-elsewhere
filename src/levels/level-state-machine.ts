import {Atlas} from '../atlas/atlas/atlas'
import {Level} from './level/level'
import {ShaderLayout} from '../graphics/shaders/shader-layout/shader-layout'
import {Store} from '../store/store'
import {LevelParser} from './level/level-parser'
import {LevelTypeConfigMap} from './level-type-config/level-type-config-map'
import {UpdateState} from '../entities/updaters/update-state'

export interface LevelStateMachine {
  readonly level?: Level
  readonly store: Store
}

export namespace LevelStateMachine {
  export function make(layout: ShaderLayout, atlas: Atlas): LevelStateMachine {
    if (!LevelTypeConfigMap.uiTitle) throw new Error('Missing level.')
    const level = LevelParser.parse(LevelTypeConfigMap.uiTitle, atlas)
    return {level, store: Store.make(layout, atlas)}
  }

  export function update(
    machine: LevelStateMachine,
    state: UpdateState
  ): LevelStateMachine {
    const store = Store.update(machine.store, state)
    const level = updateLevel(machine)
    return {store, level}
  }
}

function updateLevel(machine: LevelStateMachine): Maybe<Level> {
  if (!machine.level) return
  if (machine.level.advance === Level.Advance.UNCHANGED) return machine.level
  if (machine.level.advance === Level.Advance.PREV) {
    const config =
      machine.level.prevLevel && LevelTypeConfigMap[machine.level.prevLevel]
    const level = config
      ? LevelParser.parse(config, machine.level.atlas)
      : undefined
    console.log(level)
    return level
  }
  const config =
    machine.level.nextLevel && LevelTypeConfigMap[machine.level.nextLevel]
  const level = config
    ? LevelParser.parse(config, machine.level.atlas)
    : undefined
  console.log(level)
  return level
}
