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

  states(): State[] {
    return <State[]>Object.keys(this._map)
  }

  sprites(): readonly Readonly<Sprite>[] {
    return this._spriteRect().sprites
  }

  invalidate(): void {
    this._spriteRect().invalidate()
  }

  bounds(): ReadonlyRect {
    return this._spriteRect().bounds
  }

  /** See SpriteRect._origin. */
  origin(): Readonly<XY> {
    return this._spriteRect().origin
  }

  moveBy(by: Readonly<XY>): UpdateStatus {
    return this._spriteRect().moveBy(by)
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this._spriteRect().moveTo(to)
  }

  addSprites(...sprites: readonly Sprite[]): void {
    this._spriteRect().add(...sprites)
  }

  setConstituentID(id?: AtlasID): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    for (const state in this._map)
      status |= this._map[state].setConstituentID(id)
    return status
  }

  transition(state: State): UpdateStatus {
    if (this.state === state) return UpdateStatus.UNCHANGED
    this._validateState(state)
    const {origin, scale} = this._spriteRect()
    this._state = state
    this._spriteRect().moveTo(origin)
    this.resetAnimation()
    this.scaleTo(scale)
    return UpdateStatus.UPDATED
  }

  replaceSprites(state: State, ...sprites: readonly Sprite[]): UpdateStatus {
    this._map[state].replace(...sprites)
    return UpdateStatus.UPDATED
  }

  getScale(): Readonly<XY> {
    return this._spriteRect().scale
  }

  constituentID(): Maybe<AtlasID> {
    return this._spriteRect().constituentID
  }

  intersects(bounds: ReadonlyRect): Readonly<Sprite>[] {
    return this._spriteRect().intersects(bounds)
  }

  scaleTo(to: Readonly<XY>): UpdateStatus {
    if (!to.x || !to.y)
      throw new Error(`Scale must be nonzero (x=${to.x}, y=${to.y}).`)
    return this._spriteRect().scaleTo(to)
  }

  /** Raise or lower all sprites for all states. */
  elevate(offset: Layer): void {
    for (const state in this._map) this._map[state].elevate(offset)
  }

  /** Reset the animations of all sprites in the current state. */
  resetAnimation(): void {
    for (const sprite of this.sprites()) sprite.resetAnimation()
  }

  private _spriteRect(): SpriteRect {
    return this._map[this.state]
  }

  private _validateState(state: State): void {
    if (!this.states().includes(state))
      throw new Error(`Unknown state "${state}".`)
  }
}

export namespace SpriteStateMachine {
  export interface Props<State extends string> {
    state: State
    map: Record<State, SpriteRect>
  }
}
