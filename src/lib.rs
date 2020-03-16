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
use web_sys::{Document, HtmlCanvasElement};

#[wasm_bindgen(start)]
pub async fn main_wasm() -> Result<(), JsValue> {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  let window = wasm::expect_window();
  let document = wasm::expect_document(&window);
  let canvas = expect_canvas(&document);
  let mut game =
    Game::new(window.clone(), canvas, Assets::load(&window).await?);
  game.start();
  Ok(())
}

fn expect_canvas(document: &Document) -> HtmlCanvasElement {
  wasm::expect_id(document, "game_canvas")
    .dyn_into()
    .expect("HtmlCanvasElement expected.")
}
