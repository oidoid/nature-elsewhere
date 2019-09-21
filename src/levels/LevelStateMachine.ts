import {Atlas} from '../atlas/atlas/Atlas'
import {Level} from './level/Level'
import {ShaderLayout} from '../graphics/shaders/shaderLayout/ShaderLayout'
import {Store} from '../store/Store'
import {LevelParser} from './level/LevelParser'
import {LevelConfigMap} from './levelConfigs/LevelConfigMap'
import {UpdateState} from '../entities/updaters/UpdateState'

export interface LevelStateMachine {
  level?: Level
  readonly store: Store
}

export namespace LevelStateMachine {
  export function make(layout: ShaderLayout, atlas: Atlas): LevelStateMachine {
    if (!LevelConfigMap.uiTitle) throw new Error('Missing level.')
    const level = LevelParser.parse(LevelConfigMap.uiTitle, atlas)
    return {level, store: Store.make(layout)}
  }

  export function update(machine: LevelStateMachine, state: UpdateState): void {
    Store.update(machine.store, state)
    updateLevel(machine)
  }
}

function updateLevel(machine: LevelStateMachine): void {
  if (!machine.level) return

  if (machine.level.advance === Level.Advance.UNCHANGED) return

  if (machine.level.advance === Level.Advance.PREV) {
    const config =
      machine.level.prevLevel && LevelConfigMap[machine.level.prevLevel]
    machine.level = config
      ? LevelParser.parse(config, machine.level.atlas)
      : undefined
    return
  }

  const config =
    machine.level.nextLevel && LevelConfigMap[machine.level.nextLevel]
  machine.level = config
    ? LevelParser.parse(config, machine.level.atlas)
    : undefined
}
