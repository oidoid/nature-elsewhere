type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type ValueOf<T> = T[keyof T]
type Mutable<T> = {-readonly [K in keyof T]: T[K]}
type Never<T, V> = T extends V ? never : T
