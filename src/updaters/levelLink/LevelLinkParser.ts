import {LevelTypeParser} from '../../levels/LevelTypeParser'
import {LevelLink} from './LevelLink'
import {EntityConfig} from '../../entity/EntityParser'

export namespace LevelLinkParser {
  export function parse(config: EntityConfig): LevelLink {
    const link = 'link' in config ? config['link'] : undefined
    if (!link) throw new Error('Missing link in LevelLinkConfig.')
    return {link: LevelTypeParser.parse(link)}
  }
}
