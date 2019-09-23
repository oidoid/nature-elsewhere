import {UpdaterParser} from '../../UpdaterParser'
import {LevelTypeParser} from '../../../../levels/levelType/LevelTypeParser'
import {LevelLink} from './LevelLink'

export namespace LevelLinkParser {
  export const parse: UpdaterParser = link => {
    if (!LevelLink.is(link)) throw new Error('Expected LevelLink.')
    const levelType = LevelTypeParser.parse(link.link)
    return {...link, link: levelType}
  }
}
