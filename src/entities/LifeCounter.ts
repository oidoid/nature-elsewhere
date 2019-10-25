import {Atlas, Integer} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {BackpackerIcon} from './BackpackerIcon'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {Text} from './text/Text'

export class LifeCounter extends Entity<
  LifeCounter.Variant,
  LifeCounter.State
> {
  constructor(atlas: Atlas, props?: LifeCounter.Props) {
    super({
      ...defaults,
      map: {
        [LifeCounter.State.NONE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.LIFE_COUNTER,
              layer: Layer.UI_MID
            })
          ]
        })
      },
      children: [
        new Text({
          x: 3,
          y: 2,
          text: (props?.lives ?? defaults.lives).toString(),
          textLayer: Layer.UI_HI
        }),
        new BackpackerIcon(atlas, {x: 7, y: 2})
      ],
      ...props
    })
  }

  get lives(): Integer {
    return Number.parseInt((<Text>this.children[Children.TEXT]).text)
  }

  set lives(lives: Integer) {
    ;(<Text>this.children[Children.TEXT]).text = lives.toString()
  }

  toJSON(): JSONValue {
    const diff = EntitySerializer.serialize(this, defaults)
    if (this.lives !== defaults.lives) diff.lives = this.lives
    return diff
  }
}

export namespace LifeCounter {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }

  export interface Props
    extends Entity.SubProps<LifeCounter.Variant, LifeCounter.State> {
    lives?: Integer
  }
}

enum Children {
  TEXT,
  ICON
}

const defaults = Object.freeze({
  type: EntityType.LIFE_COUNTER,
  variant: LifeCounter.Variant.NONE,
  state: LifeCounter.State.NONE,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.BOUNDS,
  lives: 1
})
