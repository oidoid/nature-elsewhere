import {Atlas} from '../images/atlas'
import {GL} from './gl-util'
import {Image} from '../images/image'
import {NumberUtil} from '../utils/number-util'
import {ObjectUtil} from '../utils/object-util'

// All variables passed from JavaScript are integral derived by truncation. When
// passing an independent variable, implicit truncation by converting to shader
// inputs is acceptable. However, when deriving a variable from another
// variable, the first must be truncated independently to avoid possible jitter.
//
// For example, consider deriving camera position at an offset from the player's
// position. The player may be at 0.1 and the camera at an offset of 100.9. The
// rendered player's position is implicitly truncated to 0. Depending on
// calculation choice, the rendered camera's position may be:
//
//   Formula                    Result  Player pixel  Camera pixel  Distance  Notes
//   0.1 + 100.9             =   101.0             0           101       101  No truncation.
//   Math.trunc(0.1) + 100.9 =   100.9             0           100       100  Truncate before player input.
//   Math.trunc(0.1 + 100.9) =   101.0             0           101       101  Truncate after player input.
//
// Now when the player's position has increased to 1.0 and the rendered position
// is 1, one pixel forward. The rendered distance between the camera and the
// player should be constant and not change regardless of where the player is.
//
//   1.0 + 100.9             =   101.9             1           101       100  No truncation.
//   Math.trunc(1.0) + 100.9 =   101.9             1           101       100  Truncate before player input.
//   Math.trunc(1.0 + 100.9) =   101.0             1           101       100  Truncate after player input.
//
// As shown above, when truncation is not performed or it occurs afterwards
// on the sum, rounding errors can cause the rendered distance between the
// the camera and the position to vary under different inputs instead of
// remaining at a constant offset from the player. This causes a jarring jitter
// effect.
//
// Because truncation is always implied, any intermediate truncation is
// strongly preferred to rounding, flooring, or ceiling. Consider:
//
//   Math.trunc(0.1) + 100.9 =   100.9             0           100       100  Truncate.
//   Math.round(0.1) + 100.9 =   100.9             0           100       100  Round.
//   Math.floor(0.1) + 100.9 =   100.9             0           100       100  Floor.
//   Math.ceil(0.1)  + 100.9 =   101.9             0           101       101  Ceil.
//
// Now that the player has moved to 0.5:
//
//   Math.trunc(0.5) + 100.9 =   100.9             0           100       100  Truncate.
//   Math.round(0.5) + 100.9 =   101.9             0           101       101  Round.
//   Math.floor(0.5) + 100.9 =   100.9             0           100       100  Floor.
//   Math.ceil(0.5)  + 100.9 =   101.9             0           101       101  Ceil.
//
// Now that the player has moved to 1.0:
//
//   Math.trunc(1.0) + 100.9 =   101.9             1           101       100  Truncate.
//   Math.round(1.0) + 100.9 =   101.9             1           101       100  Round.
//   Math.floor(1.0) + 100.9 =   101.9             1           101       100  Floor.
//   Math.ceil(1.0)  + 100.9 =   101.9             1           101       100  Ceil.
//
// Now that the player has moved to -0.5:
//
//   Math.trunc(-0.5) + 100.9 =  100.9             0           100       100  Truncate.
//   Math.round(-0.5) + 100.9 =  100.9             0           100       100  Round.
//   Math.floor(-0.5) + 100.9 =   99.9             0            99        99  Floor.
//   Math.ceil(-0.5)  + 100.9 =  100.9             0           100       100  Ceil.

export namespace Shader {
  export enum Variable {
    // Uniforms
    ATLAS = 'atlas',
    ATLAS_SIZE = 'atlasSize',
    PALETTE = 'palette',
    PALETTE_SIZE = 'paletteSize',
    PROJECTION = 'projection',

    // Per vertex attributes
    UV = 'uv',

    // Per instance attributes
    SOURCE = 'source',
    TARGET = 'target',
    OFFSET = 'offset',
    SCALE = 'scale',
    MASK_SOURCE = 'maskSource',
    MASK_OFFSET = 'maskOffset',
    PALETTE_INDEX = 'paletteIndex'
  }

  export interface AttributeLayout {
    readonly perVertex: DivisorLayout
    readonly perInstance: DivisorLayout
  }

  export interface DivisorLayout {
    readonly length: number
    readonly stride: number
    readonly divisor: number
    readonly attributes: ReadonlyArray<Attribute>
  }

  export interface Attribute {
    readonly type: number
    readonly name: Shader.Variable
    readonly length: number
    readonly offset: number
  }

  type PartialAttribute = Omit<Attribute, 'offset'>

  const littleEndian: boolean =
    new Int8Array(new Int16Array([1]).buffer)[0] === 1

  const U8: number = GL.UNSIGNED_BYTE
  const I8: number = GL.BYTE
  const I16: number = GL.SHORT
  const sizeOfType: Readonly<Record<number, number>> = ObjectUtil.freeze({
    [U8]: 1,
    [I8]: 1,
    [I16]: 2
  })

  export const layout: AttributeLayout = ObjectUtil.freeze({
    perVertex: newDivisorLayout(0, {name: Variable.UV, type: I16, length: 2}),
    perInstance: newDivisorLayout(
      1,
      {name: Variable.SOURCE, type: I16, length: 4},
      {name: Variable.TARGET, type: I16, length: 4},
      {name: Variable.OFFSET, type: I8, length: 2},
      {name: Variable.SCALE, type: I16, length: 2},
      {name: Variable.MASK_SOURCE, type: I16, length: 4},
      {name: Variable.MASK_OFFSET, type: I8, length: 2},
      {name: Variable.PALETTE_INDEX, type: U8, length: 1}
    )
  })

  function newDivisorLayout(
    divisor: number,
    ...partialAttributes: PartialAttribute[]
  ): DivisorLayout {
    const attributes = partialAttributes.reduce(reducePartialAttribute, [])
    const maxSize = attributes.reduce(
      (max, {type}) => Math.max(sizeOfType[type], max),
      0
    )
    return {
      length: attributes.reduce((sum, {length}) => sum + length, 0),
      stride: NumberUtil.roundMultiple(
        maxSize,
        nextOffset(attributes[attributes.length - 1])
      ),
      divisor,
      attributes
    }
  }

  function reducePartialAttribute(
    attributes: ReadonlyArray<Attribute>,
    {type, name, length}: PartialAttribute,
    index: number
  ): ReadonlyArray<Attribute> {
    return attributes.concat({
      type,
      name,
      length,
      offset: index ? nextOffset(attributes[index - 1]) : 0
    })
  }

  function nextOffset(attribute: Attribute): number {
    return attribute.offset + sizeOfType[attribute.type] * attribute.length
  }

  export function newInstanceBuffer(length: number): DataView {
    return new DataView(new ArrayBuffer(layout.perInstance.stride * length))
  }

  export function packInstance(
    {animations}: Atlas.Definition,
    dataView: DataView,
    index: number,
    image: Image
  ): void {
    const animation = animations[image.animationID()]
    const maskAnimation = animations[image.maskAnimationID()]
    const i = index * layout.perInstance.stride
    dataView.setInt16(
      i + 0,
      animation.cels[image.cel()].position.x,
      littleEndian
    )
    dataView.setInt16(
      i + 2,
      animation.cels[image.cel()].position.y,
      littleEndian
    )
    dataView.setInt16(i + 4, animation.size.w, littleEndian)
    dataView.setInt16(i + 6, animation.size.h, littleEndian)
    dataView.setInt16(i + 8, image.target().x, littleEndian)
    dataView.setInt16(i + 10, image.target().y, littleEndian)
    dataView.setInt16(i + 12, image.target().w, littleEndian)
    dataView.setInt16(i + 14, image.target().h, littleEndian)
    dataView.setInt8(i + 16, image.offset().x)
    dataView.setInt8(i + 17, image.offset().y)
    dataView.setInt16(i + 18, image.scale().x, littleEndian)
    dataView.setInt16(i + 20, image.scale().y, littleEndian)
    dataView.setInt16(
      i + 22,
      maskAnimation.cels[image.maskCel()].position.x,
      littleEndian
    )
    dataView.setInt16(
      i + 24,
      maskAnimation.cels[image.maskCel()].position.y,
      littleEndian
    )
    dataView.setInt16(i + 26, maskAnimation.size.w, littleEndian)
    dataView.setInt16(i + 28, maskAnimation.size.h, littleEndian)
    dataView.setInt8(i + 30, image.maskOffset().x)
    dataView.setInt8(i + 31, image.maskOffset().y)
    dataView.setUint8(i + 32, image.palette())
  }
}
