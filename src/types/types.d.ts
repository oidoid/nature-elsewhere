type Mutable<T> = {-readonly [P in keyof T]: T[P]}
type ValueOf<T> = T[keyof T]
type Equals<T> = (lhs: T, rhs: T) => boolean
