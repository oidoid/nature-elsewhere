type Writable<T> = {-readonly [K in keyof T]: T[K]}
type Maybe<T> = T | undefined
type Milliseconds = number
/** An integer. */
type Int = number
/** An integer in units of a thousandth of a pixel. */
type DecamillipixelInt = Int
type ValueOf<T> = T[keyof T]
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
