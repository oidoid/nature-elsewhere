import {AtlasDefinition} from './atlas-definition'
import {AnimationID} from './animation-id'
import {Palette} from './palette'

declare global {
  /**
   * A projection from a source rectangle on an atlas to a target rectangle on a
   * rendered image. A target lesser than source will truncate. A target greater
   * than source will repeat. Scaling and offset are applied last. The source
   * rectangle is obtained from animationID via the AtlasDefinition and cel
   * index.
   */
  interface Image {
    // For the renderer. In general, it should be unnecessary to obtain
    // information from the atlas except to obtain the cel to render or
    // collision data.
    readonly animationID: AnimationID
    readonly cel: number
    readonly target: Mutable<XY> & WH
    readonly maskAnimationID: AnimationID
    readonly maskCel: number
    readonly offset: Mutable<XY>
    readonly scale: XY
    readonly palette: Palette
    readonly drawOrder: number
  }
}

// prescale is multipled by target dimensions to repeat source.
export function newImage(
  {animations}: AtlasDefinition,
  animationID: AnimationID,
  drawOrder: number,
  position: XY,
  {
    scale = {x: 1, y: 1},
    offset = {x: 0, y: 0},
    palette = Palette.DEFAULT,
    cel = 0,
    maskAnimationID = AnimationID.PALETTE_BLACK,
    maskCel = 0,
    prescale = {x: 1, y: 1},
    wh = animations[animationID].size
  }: {
    maskAnimationID?: AnimationID
    maskCel?: number
    scale?: XY
    offset?: XY
    palette?: Palette
    cel?: number
    prescale?: XY
    wh?: WH
  } = {}
): Image {
  const target = {...position, w: wh.w * prescale.x, h: wh.h * prescale.y}
  return {
    animationID,
    cel,
    target,
    maskAnimationID,
    maskCel,
    scale,
    offset,
    palette,
    drawOrder
  }
}
