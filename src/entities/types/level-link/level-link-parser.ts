import {UpdaterParser} from '../../updaters/updater-parser'
import {LevelTypeParser} from '../../../levels/level-type/level-type-parser'
import {LevelLink} from './level-link'

export namespace LevelLinkParser {
  export const parse: UpdaterParser = link => {
    if (!LevelLink.is(link)) throw new Error('Expected LevelLink.')
    const levelType = LevelTypeParser.parse(link.link)
    return {...link, link: levelType}
  }
}
