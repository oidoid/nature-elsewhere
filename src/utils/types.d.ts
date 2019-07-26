type ValueOf<T> = T[keyof T]
type Mutable<T> = {-readonly [K in keyof T]: T[K]}
type Never<T, V> = T extends V ? never : T

type Reversible<T> = Record<keyof T, keyof any & ValueOf<T>>
type Reverse<T> = Record<keyof any & ValueOf<T>, keyof T>
