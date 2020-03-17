#[cfg(test)]
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
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[wasm_bindgen(start)]
pub async fn main_wasm() -> Result<(), JsValue> {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  let window = web_sys::window().ok_or("Window missing.")?;
  let document = window.document().ok_or("Document missing.")?;
  let canvas = wasm::get_element_by_id(&document, "game_canvas")?;
  let assets = Assets::load(&window, &document).await?;
  let mut game = Game::new(window, document, canvas, assets);
  game.start();

  Ok(())
}
