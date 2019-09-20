import {Updater} from './updater'

export type UpdaterConfig = Maybe<Updater | string>
export type UpdaterArrayConfig = Maybe<readonly UpdaterConfig[]>
