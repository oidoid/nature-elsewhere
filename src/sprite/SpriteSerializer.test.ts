import {AtlasID} from '../atlas/AtlasID'
import {Sprite} from './Sprite'
import {SpriteComposition} from './SpriteComposition'
import {SpriteConfig} from './SpriteConfig'
import {SpriteSerializer} from './SpriteSerializer'
import {Layer} from './Layer'
import {Rect} from '../math/Rect'
import {XY} from '../math/XY'

type Test = [string, Sprite, SpriteConfig]

test.each(<Test[]>[
  ['all defaults', new Sprite({id: AtlasID.FLOWER}), {id: AtlasID.FLOWER}],
  [
    'all nondefaults',
    new Sprite({
      id: AtlasID.APPLE_TREE,
      constituentID: AtlasID.PIG,
      composition: SpriteComposition.SOURCE_IN,
      bounds: Rect.make(1, 2, 3, 4),
      layer: Layer.PLANE,
      scale: new XY(5, 6),
      animator: {period: 7, exposure: 8},
      wrap: new XY(9, 10),
      wrapVelocity: new XY(11, 12)
    }),
    {
      id: AtlasID.APPLE_TREE,
      constituentID: AtlasID.PIG,
      composition: SpriteComposition.SOURCE_IN,
      x: 1,
      y: 2,
      w: 3,
      h: 4,
      layer: Layer[Layer.PLANE],
      sx: 5,
      sy: 6,
      period: 7,
      exposure: 8,
      wx: 9,
      wy: 10,
      wvx: 11,
      wvy: 12
    }
  ]
])('%# serialize %p => %p', (_case, sprite, expected) =>
  expect(SpriteSerializer.serialize(sprite)).toStrictEqual(expected)
)
