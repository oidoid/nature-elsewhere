import {ObjectUtil} from '../utils/object-util'

export namespace Defaults {
  export const minScreenSize: WH = ObjectUtil.freeze({w: 100, h: 100})
}
