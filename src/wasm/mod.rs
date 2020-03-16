pub mod event_listener;
pub mod fetch;
pub mod frame_listener;
pub mod frame_looper;

use web_sys::{Document, Element, Performance, Window};

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

pub fn expect_id(document: &Document, id: &str) -> Element {
  document
    .get_element_by_id(id)
    .expect(&format!("Element with ID \"{}\" missing.", id))
}

pub fn expect_performance(window: &Window) -> Performance {
  window
    .performance()
    .expect("Missing High Resolution Time (Performance) in Window.")
}
