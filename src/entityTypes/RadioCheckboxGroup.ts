import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {CollisionType} from '../collision/CollisionType'
import {UpdatePredicate} from '../entities/updaters/updatePredicate/UpdatePredicate'
import {CollisionPredicate} from '../collision/CollisionPredicate'

export class RadioCheckboxGroup extends Entity {
  constructor(props?: Entity.Props) {
    super({
      type: EntityType.UI_RADIO_CHECKBOX_GROUP,
      updatePredicate: UpdatePredicate.ALWAYS,
      collisionPredicate: CollisionPredicate.CHILDREN,
      collisionType: CollisionType.TYPE_UI,
      ...props
    })
  }
}
