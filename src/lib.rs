#[macro_use]
extern crate serde_derive;
#[macro_use]
mod utils;

mod game;
mod graphics;
mod image_loader;
mod math;
use game::Game;
use image::GenericImageView;
use wasm_bindgen::{
  prelude::{wasm_bindgen, JsValue},
  JsCast,
};
use web_sys::{console, HtmlCanvasElement};

#[wasm_bindgen(start)]
pub fn main_wasm() {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  let canvas = web_sys::window()
    .unwrap()
    .document()
    .unwrap()
    .query_selector("canvas")
    .unwrap()
    .unwrap()
    .dyn_into::<HtmlCanvasElement>()
    .unwrap();

  let atlas_image = image_loader::load(include_bytes!("atlas/atlas.png"));
  let (width, height) = atlas_image.dimensions();
  console::log_2(&JsValue::from(width), &JsValue::from(height));

  let game = Game::new(canvas, atlas_image);
}
