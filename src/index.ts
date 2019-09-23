import {AssetLoader} from './loaders/AssetLoader'
import {Game} from './Game'
import {Settings} from './settings/Settings'
import {SchemaValidator} from './schemas/SchemaValidator'
import {Definition} from './schemas/Schema'
import {JSON} from './utils/jsonUtil/JSONUtil'
import * as foo from './foo.json'
;(async () => {
  const canvas = document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing.')

  console.log(SchemaValidator.validate(<JSON>(<any>foo), Definition.AnyEntity))

  const assets = await AssetLoader.load()
  const game = Game.make(window, canvas, assets, Settings.defaults)
  Game.start(game)
})()
