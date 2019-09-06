type Mutable<T> = {-readonly [K in keyof T]: T[K]}
type $<T> = T | undefined
