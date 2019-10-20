type Writable<T> = {-readonly [K in keyof T]: T[K]}
type Maybe<T> = T | undefined
/** An integer in units of a thousandth of a pixel. */
type ValueOf<T> = T[keyof T]
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type NonOptional<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
