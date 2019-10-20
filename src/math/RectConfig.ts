import {WHConfig} from './WHConfig'
import {XYConfig} from './XYConfig'

export type RectConfig = Maybe<Readonly<{position?: XYConfig; size?: WHConfig}>>
