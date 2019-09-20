import {Image} from '../images/image/image'
import {InstanceBuffer} from './instance-buffer'
import {ShaderLayout} from '../graphics/shaders/shader-layout/shader-layout'
import {UpdateState} from '../entities/updaters/update-state'
import {Entity} from '../entities/entity/entity'
import {Level} from '../levels/level/level'
import {EntityUtil} from '../entities/entity/entity-util'

export interface Store {
  readonly layout: ShaderLayout
  /** dat.byteLength may exceed bytes to be rendered. len is the only accurate
      number of instances. */
  dat: DataView
  len: number
}

export namespace Store {
  export function make(layout: ShaderLayout): Store {
    return {layout, dat: InstanceBuffer.make(0), len: 0}
  }

  export function update(store: Store, state: UpdateState): void {
    let images: Image[] = []

    if (state.level.player)
      images.push(...updateAndAnimate([state.level.player], state))

    Level.updateCamera(state.level)

    images.push(...updateAndAnimate([state.level.cursor], state))
    if (state.level.destination)
      images.push(...updateAndAnimate([state.level.destination], state))
    images.push(...updateAndAnimate(Level.activeParents(state.level), state))
    images = images.sort(Image.compareElevation)

    const size = InstanceBuffer.size(store.layout, images.length)
    if (store.dat.byteLength < size) store.dat = InstanceBuffer.make(size * 2)
    store.len = images.length

    images.forEach((image, i) =>
      InstanceBuffer.set(store.layout, state.level.atlas, store.dat, i, image)
    )
  }
}

function updateAndAnimate(
  entities: readonly Entity[],
  state: UpdateState
): Image[] {
  const images: Image[] = []
  for (const entity of entities) {
    EntityUtil.update(entity, state)
    images.push(...EntityUtil.animate(entity, state))
  }
  return images
}
