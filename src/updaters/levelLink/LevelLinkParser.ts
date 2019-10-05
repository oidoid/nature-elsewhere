import {Entity} from '../../entity/Entity'
import {LevelTypeParser} from '../../levels/LevelTypeParser'
import {LevelLink} from './LevelLink'

export namespace LevelLinkParser {
  export function parse(link: Entity): Entity {
    if (!LevelLink.is(link)) throw new Error('Expected LevelLink.')
    const levelType = LevelTypeParser.parse(link.link)
    ;(<any>link).levelType = levelType
    return link
  }
}
