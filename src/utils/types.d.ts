type Mutable<T> = {-readonly [K in keyof T]: T[K]}
type Maybe<T> = T | undefined
type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>
}
