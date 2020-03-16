#[macro_use]
extern crate failure;
#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate serde;

#[macro_use]
mod utils;
mod assets;
mod atlas;
mod ecs;
mod game;
mod graphics;
mod inputs;
mod math;
mod settings;
mod sprites;
mod text;
mod wasm;

use assets::Assets;
use game::Game;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};

#[wasm_bindgen(start)]
pub async fn main_wasm() -> Result<(), JsValue> {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  let window = web_sys::window().ok_or("Missing Window.")?;
  let document = window.document().ok_or("Missing Document.")?;
  let canvas = document
    .get_element_by_id("game_canvas")
    .ok_or("Missing #game_canvas.")?
    .dyn_into()?;
  let assets = Assets::load(&window, &document).await?;
  let mut game = Game::new(window, document, canvas, assets);
  game.start();
  Ok(())
}
