type ValueOf<T> = T[keyof T]
type Mutable<T> = {-readonly [K in keyof T]: T[K]}

type Reversible<T> = Record<keyof T, keyof any & ValueOf<T>>
type Reverse<T> = Record<keyof any & ValueOf<T>, keyof T>
