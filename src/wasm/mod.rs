pub mod event_listener;
pub mod fetch;
pub mod frame_listener;
pub mod frame_looper;

use wasm_bindgen::JsCast;
use web_sys::{Document, Performance, Window};

pub fn get_element_by_id<T: JsCast>(
  document: &Document,
  id: &str,
) -> Result<T, String> {
  document
    .get_element_by_id(id)
    .ok_or(format!("Element #\"{}\" missing.", id))?
    .dyn_into()
    .map_err(|element| {
      format!("Element cast from tag {} failed.", element.tag_name())
    })
}

pub fn expect_performance(window: &Window) -> Performance {
  window
    .performance()
    .expect("Missing High Resolution Time (Performance) in Window.")
}
