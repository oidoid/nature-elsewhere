import {Image} from '../image/Image'
import {InstanceBuffer} from './InstanceBuffer'
import {ShaderLayout} from '../renderer/ShaderLayout'
import {UpdateState} from '../updaters/UpdateState'
import {Entity} from '../entity/Entity'
import {Level} from '../levels/Level'

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
    let images = []

    if (state.level.player)
      images.push(...updateAndAnimate([state.level.player], state))

    Level.updateCamera(state)

    images.push(
      ...updateAndAnimate([state.level.cursor], state),
      ...updateAndAnimate(
        state.level.destination ? [state.level.destination] : [],
        state
      ),
      ...updateAndAnimate(state.level.hud, state),
      ...updateAndAnimate(state.level.planes, state),
      ...updateAndAnimate(Level.activeParentsNoPlayer(state.level), state)
    )
    images = images.sort((lhs, rhs) => lhs.compareElevation(rhs))

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
): Readonly<Image>[] {
  const images = []
  for (const entity of entities) {
    entity.update(state)
    images.push(...entity.animate(state))
  }
  return images
}
