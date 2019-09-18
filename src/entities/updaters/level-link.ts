import {Updater} from './updater'
import {UpdateStatus} from './update-status'
import {UpdateState} from './update-state'
import {InputSource} from '../../inputs/input-source'
import {InputBit} from '../../inputs/input-bit'
import {LevelType} from '../../levels/level-type'
import {Entity} from '../entity'
import {Level} from '../../levels/level'
import {LevelTypeParser} from '../../levels/parsers/level-type-parser'

export interface LevelLink {
  readonly link: LevelType
}

export namespace LevelLink {
  export const parse: Updater.Parse = link => {
    if (!is(link)) throw new Error('Expected LevelLink.')
    const levelType = LevelTypeParser.parse(link.link)
    return {...link, link: levelType}
  }

  export const update: Updater.Update = (link, state) => {
    if (!is(link)) throw new Error('Expected LevelLink.')
    const collision = UpdateState.collisionWithCursor(state, link)
    if (!collision) return UpdateStatus.UNCHANGED

    const [set] = state.input.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]
    if (!pick || pick.bits !== InputBit.PICK) return UpdateStatus.UNCHANGED

    Level.advance(state.level, link.link)
    return UpdateStatus.UPDATED | UpdateStatus.TERMINATE
  }
}

function is(entity: Entity): entity is LevelLink & Entity {
  return 'link' in entity
}
