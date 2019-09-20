import {Updater} from '../../updaters/updater/updater'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {LevelType} from '../../../levels/level-type/level-type'
import {Entity} from '../../entity/entity'
import {Level} from '../../../levels/level/level'
import {LevelTypeParser} from '../../../levels/level-type/level-type-parser'

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
    const collision = Level.collisionWithCursor(state.level, link)
    if (!collision) return UpdateStatus.UNCHANGED

    const {pick} = state.inputs
    if (!pick || !pick.active) return UpdateStatus.UNCHANGED

    Level.advance(state.level, link.link)
    return UpdateStatus.UPDATED | UpdateStatus.TERMINATE
  }
}

function is(entity: Entity): entity is LevelLink & Entity {
  return 'link' in entity
}
