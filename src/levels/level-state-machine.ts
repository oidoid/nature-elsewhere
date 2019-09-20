import {Atlas} from '../atlas/atlas/atlas'
import {Level} from './level/level'
import {ShaderLayout} from '../graphics/shaders/shader-layout/shader-layout'
import {Store} from '../store/store'
import {LevelParser} from './level/level-parser'
import {LevelConfigMap} from './level-configs/level-config-map'
import {UpdateState} from '../entities/updaters/update-state'

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
