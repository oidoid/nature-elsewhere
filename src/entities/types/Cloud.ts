import {Entity} from '../../entity/Entity'

export class Cloud extends Entity {}

export enum CloudState {
  NONE = 'none',
  DRIZZLE = 'drizzle',
  SHOWER = 'shower',
  DOWNPOUR = 'downpour'
}
