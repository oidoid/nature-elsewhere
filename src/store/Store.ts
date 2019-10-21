import {Entity} from '../entity/Entity'
import {InstanceBuffer} from './InstanceBuffer'
import {Level} from '../levels/Level'
import {ShaderLayout} from '../renderer/ShaderLayout'
import {Sprite} from '../sprite/Sprite'
import {UpdateState} from '../updaters/UpdateState'

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
    let sprites = []

    if (state.level.player)
      sprites.push(...updateAndAnimate([state.level.player], state))

    Level.updateCamera(state)

    sprites.push(
      ...updateAndAnimate([state.level.cursor], state),
      ...updateAndAnimate(
        state.level.destination ? [state.level.destination] : [],
        state
      ),
      ...updateAndAnimate(state.level.hud, state),
      ...updateAndAnimate(state.level.planes, state),
      ...updateAndAnimate(
        state.level.sandbox ? [state.level.sandbox] : [],
        state
      ),
      ...updateAndAnimate(Level.activeParentsNoPlayer(state.level), state)
    )
    sprites = sprites.sort((lhs, rhs) => lhs.compareElevation(rhs))

    const size = InstanceBuffer.size(store.layout, sprites.length)
    if (store.dat.byteLength < size) store.dat = InstanceBuffer.make(size * 2)
    store.len = sprites.length

    sprites.forEach((sprite, i) =>
      InstanceBuffer.set(store.layout, state.level.atlas, store.dat, i, sprite)
    )
  }
}

function updateAndAnimate(
  entities: readonly Entity[],
  state: UpdateState
): Readonly<Sprite>[] {
  const sprites = []
  for (const entity of entities) {
    entity.update(state)
    sprites.push(...entity.animate(state))
  }
  return sprites
}
