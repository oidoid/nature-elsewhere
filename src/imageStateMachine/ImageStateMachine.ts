import {ImageRect} from './ImageRect'
import {UpdateStatus} from '../entities/updaters/updateStatus/UpdateStatus'
import {Layer} from '../image/Layer'
import {XY} from '../math/XY'
import {AtlasID} from '../atlas/AtlasID'
import {Entity} from '../entity/Entity'
import {ImageStateMap} from './ImageStateMap'

// origin in level XY
// would be nice to make all changes at once instead of walking th eimages multiple itmes.
export interface ImageStateMachine {
  state: Entity.State | string
  map: Readonly<Record<Entity.State | string, ImageRect>>
}

export namespace ImageStateMachine {
  export function make(scale?: XY): ImageStateMachine {
    return {state: Entity.State.HIDDEN, map: ImageStateMap.make(scale)}
  }

  export function setImageID(
    machine: ImageStateMachine,
    id: AtlasID
  ): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    for (const rect of Object.values(machine.map))
      status |= ImageRect.setImageID(rect, id)
    return status
  }

  export function imageRect(machine: ImageStateMachine): ImageRect {
    return machine.map[machine.state]
  }

  export function setState(
    machine: ImageStateMachine,
    state: Entity.State | string
  ): UpdateStatus {
    if (machine.state === state) return UpdateStatus.UNCHANGED
    const {bounds, scale} = machine.map[machine.state]
    machine.state = state
    ImageRect.moveTo(machine.map[machine.state], bounds.position)
    resetAnimation(machine)
    setScale(machine, scale)
    return UpdateStatus.UPDATED
  }

  export function setScale(machine: ImageStateMachine, scale: XY): void {
    ImageRect.scaleTo(machine.map[machine.state], scale)
  }

  /** Raise or lower all images for all states. */
  export function elevate(machine: ImageStateMachine, offset: Layer): void {
    for (const state in machine.map)
      ImageRect.elevate(machine.map[state], offset)
  }

  export function resetAnimation(machine: ImageStateMachine): void {
    for (const {animator} of machine.map[machine.state].images) {
      animator.period = 0
      animator.exposure = 0
    }
  }
}
