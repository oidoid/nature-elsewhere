pub mod event_listener;
pub mod fetch;
pub mod frame_listener;
pub mod frame_looper;

use web_sys::{Document, Element, Performance, Window};

pub fn get_element_by_id(
  document: &Document,
  id: &str,
) -> Result<Element, String> {
  document.get_element_by_id(id).ok_or(format!("Element #\"{}\" missing.", id))
}

pub fn expect_performance(window: &Window) -> Performance {
  window
    .performance()
    .expect("Missing High Resolution Time (Performance) in Window.")
}
