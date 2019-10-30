import {Atlas} from 'aseprite-atlas'
import {NinePatch} from './NinePatch'
import {NinePatchPropsConfig, PatchesConfig} from './NinePatchPropsConfig'
import {SpriteParser} from '../../sprite/SpriteParser'
import {WHParser} from '../../math/WHParser'

export namespace NinePatchParser {
  export function parseProps(
    atlas: Atlas,
    config: NinePatchPropsConfig
  ): NinePatch.Props {
    const props: Writable<NinePatch.Props> = {}
    if (config.size !== undefined) props.size = WHParser.parse(config.size)
    if (config.patches !== undefined)
      props.patches = parsePatches(atlas, config.patches)
    return props
  }
}

function parsePatches(
  atlas: Atlas,
  config: PatchesConfig
): NinePatch.PatchesProp {
  const patches: Writable<NinePatch.PatchesProp> = {}
  if (config.o !== undefined)
    patches[NinePatch.Patch.ORIGIN] = SpriteParser.parse(atlas, config.o)
  if (config.n !== undefined)
    patches[NinePatch.Patch.NORTH] = SpriteParser.parse(atlas, config.n)
  if (config.e !== undefined)
    patches[NinePatch.Patch.EAST] = SpriteParser.parse(atlas, config.e)
  if (config.s !== undefined)
    patches[NinePatch.Patch.SOUTH] = SpriteParser.parse(atlas, config.s)
  if (config.w !== undefined)
    patches[NinePatch.Patch.WEST] = SpriteParser.parse(atlas, config.w)
  if (config.ne !== undefined)
    patches[NinePatch.Patch.NORTH_EAST] = SpriteParser.parse(atlas, config.ne)
  if (config.se !== undefined)
    patches[NinePatch.Patch.SOUTH_EAST] = SpriteParser.parse(atlas, config.se)
  if (config.sw !== undefined)
    patches[NinePatch.Patch.SOUTH_WEST] = SpriteParser.parse(atlas, config.sw)
  if (config.nw !== undefined)
    patches[NinePatch.Patch.NORTH_WEST] = SpriteParser.parse(atlas, config.nw)
  return patches
}
