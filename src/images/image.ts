import {AnimationID} from './animation-id'
import * as Animator from './animator'
import {Atlas} from './atlas'
import {Layer} from './layer'
import {Rect} from '../math/rect'

export class ImageOptions {
  readonly layer?: Layer
  readonly position?: XY
  readonly period?: number
  readonly exposure?: number
}

/**
 * A projection from a source rectangle on an atlas to a target rectangle on a
 * rendered image. A target lesser than source will truncate. A target greater
 * than source will repeat. Scaling and offset are applied last. The source
 * rectangle is obtained from animationID via the AtlasDefinition and cel
 * index.
 */
export class Image {
  static new(
    animationID: AnimationID,
    {
      layer = Layer.DEFAULT,
      position = {x: 0, y: 0},
      period = 0,
      exposure = 0
    }: ImageOptions = {}
  ): Image {
    return new Image(animationID, position.x, position.y, layer, {
      period,
      exposure
    })
  }

  static target(atlas: Atlas.Definition, images: readonly Image[]): Rect {
    return images.reduce(
      (union, image) => Rect.union(union, image.target(atlas)),
      images[0] ? images[0].target(atlas) : {x: 0, y: 0, w: 0, h: 0}
    )
  }

  constructor(
    private readonly _animationID: AnimationID,
    public x: number,
    public y: number,
    private readonly _layer: Layer,
    private animator: Animator.State
  ) {}

  update(atlas: Atlas.Definition, milliseconds: number): void {
    this.animator = Animator.animate(
      this.animation(atlas),
      this.animator.period,
      this.animator.exposure + milliseconds
    )
  }

  animation(atlas: Atlas.Definition): Atlas.Animation {
    return atlas.animations[this._animationID]
  }

  source(atlas: Atlas.Definition): Atlas.Cel {
    const {cels} = this.animation(atlas)
    return cels[Animator.index(cels, this.animator.period)]
  }

  target(atlas: Atlas.Definition): Rect {
    return {x: this.x, y: this.y, ...this.animation(atlas).size}
  }

  moveBy(offset: XY): void {
    this.x += offset.x
    this.y += offset.y
  }

  layer(): Layer {
    return this._layer
  }
}
