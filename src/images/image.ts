import {AnimationID} from './animation-id'
import {Animator} from './animator'
import {Atlas} from './atlas'
import {Layer} from './layer'
import {Rect} from '../math/rect'

export class ImageOptions {
  layer?: Layer
  position?: XY
  cel?: number
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
    {layer = Layer.DEFAULT, position = {x: 0, y: 0}, cel = 0}: ImageOptions = {}
  ): Image {
    return new Image(
      animationID,
      position.x,
      position.y,
      layer,
      new Animator(animations[animationID], cel)
    )
  }

  static moveBy(offset: XY, images: readonly Image[]): readonly Image[] {
    images.forEach(image => image.moveBy(offset))
    return images
  }

  static target(atlas: Atlas.Definition, images: readonly Image[]): Rect {
    return images.reduce(
      (union, image) => Rect.union(union, image.target(atlas)),
      images[0] ? images[0].target(atlas) : {x: 0, y: 0, w: 0, h: 0}
    )
  }

  constructor(
    // how i transition between animations? includin the AtlasAnimation here
    // would save a lot of lookup eveyrwhere else.
    private readonly _animationID: AnimationID,
    /** Width and height do not change on AtlasAnimation change. */
    public x: number,
    public y: number,
    private readonly _layer: Layer,
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
  }

  animation(atlas: Atlas.Definition): Atlas.Animation {
    return atlas.animations[this.animationID()]
  }

  source(atlas: Atlas.Definition): Atlas.Cel {
    return this.animation(atlas).cels[this.cel()]
  }

  target(atlas: Atlas.Definition): Rect {
    return {x: this.x, y: this.y, ...this.animation(atlas).size}
  }

  moveTo(target: XY): void {
    this.x = target.x
    this.y = target.y
  }

  moveBy(offset: XY): void {
    this.x += offset.x
    this.y += offset.y
  }

  layer(): Layer {
    return this._layer
  }
}
