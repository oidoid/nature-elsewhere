import {AnimationID} from './animation-id'
import {Animator} from './animator'
import {Atlas} from './atlas'
import {Palette} from './palette'
import {Rect} from '../math/rect'

export class ImageOptions {
  palette?: Palette
  layer?: number
  position?: XY
  maskAnimationID?: AnimationID
  maskCel?: number
  maskOffset?: XY
  maskOffsetRate?: XY
  scale?: XY
  offset?: XY
  offsetRate?: XY
  cel?: number
  preScale?: XY
  wh?: WH
}

/**
 * A projection from a source rectangle on an atlas to a target rectangle on a
 * rendered image. A target lesser than source will truncate. A target greater
 * than source will repeat. Scaling and offset are applied last. The source
 * rectangle is obtained from animationID via the AtlasDefinition and cel
 * index.
 */
export class Image {
  // withDefaults
  static newBind(
    atlas: Atlas.Definition,
    animationID: AnimationID,
    defaults: ImageOptions = {}
  ) {
    return (options: ImageOptions) =>
      Image.new(atlas, animationID, {...defaults, ...options})
  }
  // preScale is multiplied by target dimensions to repeat source.
  static new(
    {animations}: Atlas.Definition,
    animationID: AnimationID,
    {
      palette = Palette.GREYS,
      layer = 0,
      position = {x: 0, y: 0},
      scale = {x: 1, y: 1},
      offset = {x: 0, y: 0},
      offsetRate = {x: 0, y: 0},
      cel = 0,
      maskAnimationID = animationID,
      maskCel = 0,
      maskOffset = offset,
      maskOffsetRate = offsetRate,
      preScale = {x: 1, y: 1},
      wh = animations[maskAnimationID].size
    }: ImageOptions = {}
  ): Image {
    const target = {
      ...position,
      w: wh.w * preScale.x * scale.x,
      h: wh.h * preScale.y * scale.y
    }
    return new Image(
      animationID,
      target,
      maskAnimationID,
      maskCel,
      maskOffset,
      maskOffsetRate,
      offset,
      offsetRate,
      scale,
      palette,
      layer,
      new Animator(animations[animationID], cel)
    )
  }

  static moveBy(offset: XY, images: readonly Image[]): readonly Image[] {
    images.forEach(image => image.moveBy(offset))
    return images
  }

  static target(images: readonly Image[]): Rect {
    return images.reduce(
      (union, image) => Rect.union(union, image.target()),
      images[0] ? images[0].target() : {x: 0, y: 0, w: 0, h: 0}
    )
  }

  static setPalette(palette: Palette, images: readonly Image[]): void {
    images.forEach(image => image.setPalette(palette))
  }

  constructor(
    // how i transition between animations? includin the AtlasAnimation here
    // would save a lot of lookup eveyrwhere else.
    private readonly _animationID: AnimationID,
    /** Width and height do not change on AtlasAnimation change. */
    private readonly _target: Mutable<XY> & WH,
    private readonly _maskAnimationID: AnimationID,
    private readonly _maskCel: number,
    private readonly _maskOffset: Mutable<XY>,
    private readonly _maskOffsetRate: XY,
    /** The current offset in pixels. */
    private readonly _offset: Mutable<XY>,
    /** The offset speed in pixels per millisecond. */
    private readonly _offsetRate: XY,
    private readonly _scale: XY,
    private _palette: Palette,
    private readonly _layer: number,
    private readonly _animator: Animator
  ) {}

  // For the renderer. In general, it should be unnecessary to obtain
  // information from the atlas except to obtain the cel to render or collision
  // data.
  animationID(): AnimationID {
    return this._animationID
  }

  cel(): number {
    return this._animator.celIndex()
  }

  update(milliseconds: number): void {
    this._animator.step(milliseconds)
    this._offset.x += milliseconds * this._offsetRate.x
    this._offset.y += milliseconds * this._offsetRate.y
    this._maskOffset.x += milliseconds * this._maskOffsetRate.x
    this._maskOffset.y += milliseconds * this._maskOffsetRate.y
  }

  target(): Rect {
    return this._target
  }

  moveTo(target: XY): void {
    this._target.x = target.x
    this._target.y = target.y
  }

  moveBy(offset: XY): void {
    this._target.x += offset.x
    this._target.y += offset.y
  }

  maskAnimationID(): AnimationID {
    return this._maskAnimationID
  }

  maskCel(): number {
    return this._maskCel
  }

  maskOffset(): XY {
    return this._maskOffset
  }

  maskOffsetRate(): XY {
    return this._maskOffsetRate
  }

  offset(): XY {
    return this._offset
  }

  scale(): XY {
    return this._scale
  }

  palette(): Palette {
    return this._palette
  }

  setPalette(palette: Palette): void {
    this._palette = palette
  }

  layer(): number {
    return this._layer
  }
}
