use wasm_bindgen::closure::Closure;
use wasm_bindgen::JsCast;
use web_sys::Window;

pub struct FrameListener {
  win: Window,
  /// Some when a request is outstanding, None otherwise.
  frame_id: Option<i32>,
  closure: Closure<dyn FnMut(f64)>,
}

impl FrameListener {
  pub fn new<T>(win: Window, listener: T) -> Self
  where
    T: 'static + FnMut(f64),
  {
    let listener: Box<dyn FnMut(_)> = Box::new(listener);
    let closure = Closure::wrap(listener);
    let frame_id =
      win.request_animation_frame(closure.as_ref().unchecked_ref()).ok();
    Self { win, frame_id, closure }
  }

  pub fn pending(&self) -> bool {
    self.frame_id.is_some()
  }

  pub fn cancel_animation_frame(&mut self) {
    if let Some(frame_id) = self.frame_id {
      self.win.cancel_animation_frame(frame_id).expect(&format!(
        "FrameListener not removed for request ID {}.",
        frame_id
      ));
      self.frame_id = None;
    }
  }
}

impl Drop for FrameListener {
  fn drop(&mut self) {
    self.cancel_animation_frame()
  }
}
