import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {LevelDefault} from './level-default'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {Limits} from '../math/limits'
import {MemFont} from '../text/mem-font'
import {Palette, Tone} from '../images/palette'
import {Store} from '../store/store'
import {Text} from '../text/text'
import {Viewport} from '../graphics/viewport'

const rowHeight: number = MemFont.lineHeight + MemFont.leading

export class TitleLevel implements Level {
  private readonly _store: Store
  private readonly _footer: ImageGroup
  constructor(shaderLayout: ShaderLayout, atlas: Atlas.Definition) {
    this._store = new Store(shaderLayout, atlas)

    this._footer = new ImageGroup(
      Text.toImages(
        atlas,
        `${process.env.date}  v${process.env.version} (${process.env.hash})`
      )
    )
    this._footer.setPalette(Palette.GREYS + Tone.HALF)

    this._store.addImages(
      Image.new(atlas, AnimationID.PIXEL, {
        palette: Palette.YELLOWS,
        preScale: Limits.MAX_XY
      }),
      ...this._footer.images()
    )
  }

  scale(canvas: WH): number {
    return Viewport.scale(canvas, LevelDefault.minScreenSize, 0)
  }

  update(then: number, now: number, _canvas: Rect, cam: Rect): LevelUpdate {
    this._footer.moveTo({x: cam.x + 1, y: cam.y + cam.h - rowHeight})
    return {nextLevel: this, ...this._store.update(now - then, cam)}
  }
}
