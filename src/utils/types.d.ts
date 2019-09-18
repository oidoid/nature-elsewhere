type Writable<T> = {-readonly [K in keyof T]: T[K]}
type Maybe<T> = T | undefined
type Milliseconds = number
/** An integer. */
type Int = number
/** An integer in units of a thousandth of a pixel. */
type MillipixelInt = Int
