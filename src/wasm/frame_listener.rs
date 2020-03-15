use wasm_bindgen::closure::Closure;
use wasm_bindgen::JsCast;
use web_sys::Window;

pub struct FrameListener {
  window: Window,
  /// Some when a request is outstanding, None otherwise.
  frame_id: Option<i32>,
  closure: Closure<dyn FnMut(f64)>,
}

impl FrameListener {
  pub fn new<T: 'static + FnMut(f64)>(window: Window, listener: T) -> Self {
    let listener: Box<dyn FnMut(_)> = Box::new(listener);
    Self { window, frame_id: None, closure: Closure::wrap(listener) }
  }

  pub fn start(&mut self) {
    self.frame_id = self
      .window
      .request_animation_frame(self.closure.as_ref().unchecked_ref())
      .ok();
  }

  pub fn pending(&self) -> bool {
    self.frame_id.is_some()
  }

  pub fn cancel_animation_frame(&mut self) {
    if let Some(frame_id) = self.frame_id {
      self.window.cancel_animation_frame(frame_id).unwrap_or(());
    }
    self.frame_id = None;
  }
}

impl Drop for FrameListener {
  fn drop(&mut self) {
    self.cancel_animation_frame()
  }
}
