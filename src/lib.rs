use wasm_bindgen::prelude::{wasm_bindgen, JsValue};
use web_sys::console;

#[wasm_bindgen(start)]
pub fn main_wasm() {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();

  console::log_1(&JsValue::from_str("Hello world5!"));
}
