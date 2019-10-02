import {Text} from '../text/Text'

export class Checkbox extends Text {
  checked: boolean

  constructor({checked, ...props}: Checkbox.Props) {
    super(props)
    this.checked = checked || false
  }
}

export namespace Checkbox {
  export interface Props extends Text.Props {
    readonly checked?: boolean
  }
}
export enum CheckboxState {
  UNCHECKED = 'unchecked',
  CHECKED = 'checked'
}
