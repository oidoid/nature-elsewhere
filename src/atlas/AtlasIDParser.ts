import {AtlasID} from './AtlasID'

export type AtlasIDConfig = AtlasID | string

export namespace AtlasIDParser {
  export function parse(config: AtlasIDConfig): AtlasID {
    if (Object.values(AtlasID).includes(<AtlasID>config)) return <AtlasID>config
    throw new Error(`Unknown AtlasID "${config}".`)
  }
}
