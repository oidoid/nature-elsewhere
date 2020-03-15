pub mod event_listener;
pub mod frame_listener;

use web_sys::{Document, Element, Window};

pub fn expect_window() -> Window {
  web_sys::window().expect("Missing Window.")
}

pub fn expect_document(window: &Window) -> Document {
  window.document().expect("Missing Document.")
}

pub fn expect_selector(document: &Document, selector: &str) -> Element {
  document
    .query_selector(selector)
    .expect("Query selector failed.")
    .expect(&format!("Element with selector \"{}\" missing.", selector))
}
