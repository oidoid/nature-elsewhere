// import {Atlas} from '../atlas/atlas'
// import {Entity} from './entity'
// import {EntityConfigs} from './entity-configs'
// import {EntityConfig} from './entity-config'
// import {EntityParser} from './entity-parser'
// import {ValueUtil} from '../utils/value-util'
// import {EntityRect} from './entity-rect'

// export interface UIEntityPicker extends Entity{//Rect {
//   readonly id: 'uiEntityPicker'
// }
// type t = UIEntityPicker

// export namespace UIEntityPicker {
//   export const make = (atlas: Atlas, entity: Entity | t): t => {
//     if (!isUIEntityPickerConfig(entity))
//       throw new Error(`Unknown ID "${entity.id}".`)
//     const entities = Object.values(EntityConfigs)
//       .filter(ValueUtil.is)
//       .filter(val => !isUIEntityPickerConfig(val))
//       .map(val => EntityParser.parse(atlas, val))
//     return {...entity, entities}
//   }
// }

// export interface Text extends Entity {
//   readonly text: string
// }

// const isUIEntityPickerConfig = (val: Entity | EntityConfig): val is t =>
//   val.id === 'uiEntityPicker'
