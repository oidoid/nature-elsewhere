#[macro_use]
extern crate failure;
#[macro_use]
extern crate serde;
#[macro_use]
extern crate specs;
#[macro_use]
mod utils;

mod atlas;
mod ecs;
mod game;
mod graphics;
mod math;
mod wasm;

use game::Game;
use graphics::shader_layout::ShaderLayout;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast};

#[wasm_bindgen(start)]
pub fn main_wasm() {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  let shader_layout =
    ShaderLayout::parse(include_str!("graphics/shader_layout.json"));
  let vert_glsl = include_str!("graphics/vert.glsl");
  let frag_glsl = include_str!("graphics/frag.glsl");

  let win = web_sys::window().expect("Missing Window.");
  let canvas = win
    .document()
    .expect("Missing Document.")
    .query_selector("canvas")
    .expect("Query failed.")
    .expect("Canvas missing.")
    .dyn_into()
    .expect("HtmlCanvasElement expected.");

  let atlas_img = image::load_from_memory(include_bytes!("atlas/atlas.png"))
    .expect("Image loading failed.");

  let mut game = Game::new(
    shader_layout,
    vert_glsl.to_string(),
    frag_glsl.to_string(),
    win,
    canvas,
    atlas_img,
  );
  game.start();
}
