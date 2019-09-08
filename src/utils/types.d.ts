type Mutable<T> = {-readonly [K in keyof T]: T[K]}
type Maybe<T> = T | undefined
