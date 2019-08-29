type ValueOf<T> = T[keyof T]
type Mutable<T> = {-readonly [K in keyof T]: T[K]}
