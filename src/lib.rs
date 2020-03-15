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
use wasm_bindgen::{prelude::wasm_bindgen, JsCast};
use web_sys::{Document, HtmlCanvasElement};

#[wasm_bindgen(start)]
pub fn main_wasm() {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  let window = wasm::util::expect_window();
  let document = wasm::util::expect_document(&window);
  let canvas = expect_canvas(&document);
  let mut game = Game::new(window, canvas, Assets::load());
  game.start();
}

fn expect_canvas(document: &Document) -> HtmlCanvasElement {
  wasm::util::expect_selector(document, "canvas")
    .dyn_into()
    .expect("HtmlCanvasElement expected.")
}
