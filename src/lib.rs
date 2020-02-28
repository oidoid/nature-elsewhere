#[macro_use]
extern crate failure;
#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate serde;
#[macro_use]
extern crate specs;
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
mod text;
mod wasm;

use assets::Assets;
use game::Game;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast};
use web_sys::{Document, HtmlCanvasElement, Window};

#[wasm_bindgen(start)]
pub fn main_wasm() {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  let window = expect_window();
  let document = expect_document(&window);
  let canvas = expect_canvas(&document);
  let mut game = Game::new(window, canvas, Assets::load());
  game.start();
}

fn expect_window() -> Window {
  web_sys::window().expect("Missing Window.")
}

fn expect_document(win: &Window) -> Document {
  win.document().expect("Missing Document.")
}

fn expect_canvas(document: &Document) -> HtmlCanvasElement {
  document
    .query_selector("canvas")
    .expect("Query failed.")
    .expect("Canvas missing.")
    .dyn_into()
    .expect("HtmlCanvasElement expected.")
}
