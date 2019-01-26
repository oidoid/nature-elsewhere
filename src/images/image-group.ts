import {Palette} from './palette'

export interface ImageGroup {
  // but scaling, relative offset, size, etc all have to be calculated for any kind of cpu side calc
  target?: XY
  palette?: Palette
  images: Image[]
}
