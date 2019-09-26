import {Entity} from '../../entity/Entity'
import {UpdateState} from './UpdateState'
import {UpdateStatus} from './updateStatus/UpdateStatus'

export type Update = (entity: Entity, state: UpdateState) => UpdateStatus
