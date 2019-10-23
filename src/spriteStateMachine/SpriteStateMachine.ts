import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../sprite/Layer'
import {ReadonlyRect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from './SpriteRect'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {XY} from '../math/XY'

export type SpriteStateMap<State extends string = string> = Readonly<
  Record<State, SpriteRect>
>

/** Reconciles SpriteRect mutations on transition. I.e., applies SpriteRect
    changes to the current state and, whenever a transition is made, applies any
    differences from the preceding state to the next. */
export class SpriteStateMachine<State extends string = string> {
  private _state: State
  private readonly _map: SpriteStateMap<State>

  constructor(props: SpriteStateMachine.Props<State>) {
    this._state = props.state
    this._map = props.map
    this._validateState(props.state)
  }

  get state(): State {
    return this._state
  }

  get states(): State[] {
    return <State[]>Object.keys(this._map)
  }

  transition(state: State): UpdateStatus {
    if (this.state === state) return UpdateStatus.UNCHANGED
    this._validateState(state)
    const {origin, scale, constituentID, elevation} = this._spriteRect
    this._state = state
    this._spriteRect.moveTo(origin)
    this.resetAnimation()
    this.scaleTo(scale)
    this.setConstituentID(constituentID)
    this.elevateTo(elevation)
    return UpdateStatus.UPDATED
  }

  get bounds(): ReadonlyRect {
    return this._spriteRect.bounds
  }

  /** See SpriteRect._origin. */
  get origin(): Readonly<XY> {
    return this._spriteRect.origin
  }

  set origin(origin: Readonly<XY>) {
    this._spriteRect.origin = origin
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this._spriteRect.moveTo(to)
  }

  moveBy(by: Readonly<XY>): UpdateStatus {
    return this._spriteRect.moveBy(by)
  }

  get scale(): Readonly<XY> {
    return this._spriteRect.scale
  }

  scaleTo(to: Readonly<XY>): UpdateStatus {
    Sprite.validateScale(to)
    return this._spriteRect.scaleTo(to)
  }

  scaleBy(by: Readonly<XY>): UpdateStatus {
    Sprite.validateScale(by)
    return this._spriteRect.scaleBy(by)
  }

  get constituentID(): Maybe<AtlasID> {
    return this._spriteRect.constituentID
  }

  setConstituentID(id: Maybe<AtlasID>): UpdateStatus {
    return this._spriteRect.setConstituentID(id)
  }

  get elevation(): Layer {
    return this._spriteRect.elevation
  }

  elevateTo(to: Layer): UpdateStatus {
    return this._spriteRect.elevateTo(to)
  }

  elevateBy(by: Layer): UpdateStatus {
    return this._spriteRect.elevateBy(by)
  }

  get sprites(): readonly Readonly<Sprite>[] {
    return this._spriteRect.sprites
  }

  addSprites(...sprites: readonly Sprite[]): void {
    this._spriteRect.add(...sprites)
    this.invalidate()
  }

  replaceSprites(state: State, ...sprites: readonly Sprite[]): void {
    this._map[state].replace(...sprites)
    this.invalidate()
  }

  intersects(bounds: ReadonlyRect): Readonly<Sprite>[] {
    return this._spriteRect.intersects(bounds)
  }

  invalidate(): void {
    this._spriteRect.invalidate()
  }

  resetAnimation(): void {
    this._spriteRect.resetAnimation()
  }

  get _spriteRect(): SpriteRect {
    return this._map[this.state]
  }

  private _validateState(state: State): void {
    if (!this.states.includes(state))
      throw new Error(`Unknown state "${state}".`)
  }
}

export namespace SpriteStateMachine {
  export interface Props<State extends string> {
    state: State
    map: Record<State, SpriteRect>
  }
}
