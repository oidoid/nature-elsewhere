import {Entity} from '../../../entity/Entity'

export class EntityPicker extends Entity {
  activeChildIndex: number
  constructor(props: Entity.Props) {
    super(props)
    this.activeChildIndex = 0
  }
}
