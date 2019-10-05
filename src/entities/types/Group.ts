import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'

export class Group extends Entity {
  constructor(props?: Entity.Props) {
    super({type: EntityType.GROUP, ...props})
  }
}
