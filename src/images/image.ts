import {AtlasDefinition} from './atlas-definition'
import {AnimationID} from './animation-id'
import {Palette} from './palette'

/**
 * A projection from a source rectangle on an atlas to a target rectangle on a
 * rendered image. A target lesser than source will truncate. A target greater
 * than source will repeat. Scaling and offset are applied last. The source
 * rectangle is obtained from animationID via the AtlasDefinition and cel
 * index.
 */
export class Image {
  // preScale is multiplied by target dimensions to repeat source.
  static new(
    {animations}: AtlasDefinition,
    animationID: AnimationID,
    layer: number,
    position: XY,
    {
      scale = {x: 1, y: 1},
      offset = {x: 0, y: 0},
      palette = Palette.DEFAULT,
      cel = 0,
      maskAnimationID = animationID,
      maskCel = 0,
      preScale = {x: 1, y: 1},
      wh = animations[maskAnimationID].size
    }: {
      maskAnimationID?: AnimationID
      maskCel?: number
      scale?: XY
      offset?: XY
      palette?: Palette
      cel?: number
      preScale?: XY
      wh?: WH
    } = {}
  ) {
    const target = {...position, w: wh.w * preScale.x, h: wh.h * preScale.y}
    return new Image(
      animationID,
      cel,
      target,
      maskAnimationID,
      maskCel,
      offset,
      scale,
      palette,
      layer
    )
  }

  constructor(
    private readonly _animationID: AnimationID,
    private readonly _cel: number,
    private readonly _target: Mutable<XY> & WH,
    private readonly _maskAnimationID: AnimationID,
    private readonly _maskCel: number,
    private readonly _offset: Mutable<XY>,
    private readonly _scale: XY,
    private readonly _palette: Palette,
    private readonly _layer: number
  ) {}

  // For the renderer. In general, it should be unnecessary to obtain
  // information from the atlas except to obtain the cel to render or collision
  // data.
  animationID(): AnimationID {
    return this._animationID
  }

  cel(): number {
    return this._cel
  }

  target(): Rect {
    return this._target
  }

  moveTo(target: XY): void {
    this._target.x = target.x
    this._target.y = target.y
  }

  centerOn(target: Rect): void {
    this._target.x = target.x + target.w / 2 - this._target.w / 2
    this._target.y = target.y + target.h / 2 - this._target.h / 2
  }

  maskAnimationID(): AnimationID {
    return this._maskAnimationID
  }

  maskCel(): number {
    return this._maskCel
  }

  offset(): XY {
    return this._offset
  }

  addOffset({x, y}: XY): void {
    this._offset.x += x
    this._offset.y += y
  }

  scale(): XY {
    return this._scale
  }

  palette(): Palette {
    return this._palette
  }

  layer(): number {
    return this._layer
  }
}
