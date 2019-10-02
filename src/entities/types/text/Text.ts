import {Entity} from '../../../entity/Entity'
import {Layer} from '../../../image/Layer'
import {Limits} from '../../../math/Limits'
import {WH} from '../../../math/WH'
import {XY} from '../../../math/XY'

export class Text extends Entity {
  text: string
  readonly textLayer: Layer.Key
  readonly textScale: XY
  readonly textMaxSize: WH

  constructor({text, textLayer, textScale, textMaxSize, ...props}: Text.Props) {
    super(props)
    this.text = text || ''
    this.textLayer = textLayer || 'DEFAULT'
    this.textScale = textScale || new XY(1, 1)
    this.textMaxSize = textMaxSize || new WH(Limits.maxShort, Limits.maxShort)
  }
}

export namespace Text {
  export interface Props extends Entity.Props {
    readonly text?: string
    readonly textLayer?: Layer.Key
    readonly textScale?: XY
    readonly textMaxSize?: WH
  }
}
