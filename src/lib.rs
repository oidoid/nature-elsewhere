mod image_loader;
use wasm_bindgen::prelude::wasm_bindgen;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(start)]
pub fn main_wasm() {
  use image::GenericImageView;
  use wasm_bindgen::prelude::JsValue;
  use wasm_bindgen::JsCast;

  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  let image = image_loader::load(include_bytes!("atlas/atlas.png"));
  let (width, height) = image.dimensions();
  web_sys::console::log_2(&JsValue::from(width), &JsValue::from(height));

  let canvas = web_sys::window()
    .unwrap()
    .document()
    .unwrap()
    .query_selector("canvas")
    .unwrap()
    .unwrap()
    .dyn_into::<web_sys::HtmlCanvasElement>()
    .unwrap();

  let gl = canvas
    .get_context("webgl")
    .unwrap()
    .unwrap()
    .dyn_into::<web_sys::WebGlRenderingContext>()
    .unwrap();

  let gl = glow::Context::from_webgl1_context(gl);
}
