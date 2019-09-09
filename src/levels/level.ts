import {Entity} from '../entities/entity'
import {EntityConfig} from '../entities/entity-config'
import {WH} from '../math/wh'

/** Entities within a bounds. */
export interface Level extends Omit<Level.Config, 'entities'> {
  readonly entities: readonly Entity[]
}

export namespace Level {
  export interface Config extends WH {
    readonly id: string
    readonly minSize: WH
    readonly entities: readonly EntityConfig[]
  }
}
