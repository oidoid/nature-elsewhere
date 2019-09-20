import {Entity} from '../entity/entity'
import {UpdateState} from './update-state'
import {UpdateStatus} from './update-status/update-status'

export type Update = (entity: Entity, state: UpdateState) => UpdateStatus
