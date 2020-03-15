use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::closure::Closure;
use wasm_bindgen::JsCast;
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

/// Wraps a repeating Window.request_animation_frame() request. Return true from
/// on_frame() to continue, false to break.
pub fn req_anim_loop<T>(window: Window, mut on_frame: T)
where
  T: 'static + FnMut(f64, f64) -> bool,
{
  // A shared mutable reference to an optional closure. The closure is None
  // initially to avoid a circular reference at declaration which is forbidden
  // by the borrow checker. The reference is then cloned to properly initialize
  // the shared value once the the function has been declared.
  let closure_rc0: Rc<RefCell<Option<Closure<dyn FnMut(f64)>>>> =
    Rc::new(RefCell::new(None));
  let closure_rc1 = closure_rc0.clone();

  let window_clone = window.clone();
  let mut then = None;

  *closure_rc0.borrow_mut() = Some(Closure::wrap(Box::new(move |now: f64| {
    if on_frame(then.unwrap_or(now), now) {
      then = Some(now);
      req_frame(&window, &closure_rc1);
    }
  })));
  req_frame(&window_clone, &closure_rc0);
}

fn req_frame(
  window: &Window,
  closure: &Rc<RefCell<Option<Closure<dyn FnMut(f64)>>>>,
) {
  window
    .request_animation_frame(
      closure
        .borrow()
        .as_ref()
        .expect("Closure unavailable.")
        .as_ref()
        .unchecked_ref(),
    )
    .expect("Animation frame request failed.");
}

pub fn request_animation_frame<T>(
  window: &Window,
  listener: T,
) -> Result<i32, wasm_bindgen::JsValue>
where
  T: 'static + FnMut(f64),
{
  let listener: Box<dyn FnMut(_)> = Box::new(listener);
  window
    .request_animation_frame(Closure::wrap(listener).as_ref().unchecked_ref())
}
