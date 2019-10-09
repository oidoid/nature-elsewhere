type Writable<T> = {-readonly [K in keyof T]: T[K]}
type Maybe<T> = T | undefined
type Milliseconds = number
/** An integer. */
type Int = number
/** An integer in units of a thousandth of a pixel. */
type DecamillipixelInt = Int
type ValueOf<T> = T[keyof T]
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type NonOptional<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

type Primitive = undefined | null | boolean | string | number | Function

// https://github.com/microsoft/TypeScript/issues/13923
type Immutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<U>
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<K, V>
  : Readonly<T>

type DeepImmutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? DeepImmutableMap<K, V>
  : DeepImmutableObject<T>

interface DeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> {}
interface DeepImmutableMap<K, V>
  extends ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> {}
type DeepImmutableObject<T> = {
  readonly [K in keyof T]: DeepImmutable<T[K]>
}
