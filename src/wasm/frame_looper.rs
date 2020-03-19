use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::closure::Closure;
use wasm_bindgen::JsCast;
use web_sys::Window;

pub struct FrameLooper {
  window: Window,
  /// None if the request was never issued, was canceled, or failed. Some if the
  /// request is outstanding or complete. A shared mutable reference is used to
  /// allow frame_id to be used from within the looping closure.
  frame_id: Rc<RefCell<Option<i32>>>,
}

impl FrameLooper {
  pub fn new(window: Window) -> Self {
    Self { window, frame_id: Rc::new(RefCell::new(None)) }
  }

  pub fn start<T: 'static + FnMut(f64)>(&mut self, mut on_loop: T) {
    if self.is_looping() {
      return;
    }

    let window = self.window.clone();
    let frame_id = self.frame_id.clone();

    // A mutable Closure reference. The Closure is shared by references between
    // the initial request in start() and the looping closure. This could be
    // defined at construction time but that's harder for some client usages.
    // Specifically, an on_loop() that has a Self reference when the Self also
    // holds a reference to FrameLooper, creating a circular dependency.
    let closure_rc0 = Rc::new(RefCell::new(None));
    let closure_rc1 = closure_rc0.clone();
    let fnc = move |time| {
      on_loop(time);
      if frame_id.borrow().is_some() {
        // Not canceled in on_loop(). Request another frame.
        *frame_id.borrow_mut() = request(
          &window,
          closure_rc1.borrow().as_ref().expect("Inner closure unavailable."),
        );
      }
    };
    *closure_rc0.borrow_mut() = Some(Closure::wrap(Box::new(fnc)));

    *self.frame_id.borrow_mut() = request(
      &self.window,
      closure_rc0.borrow().as_ref().expect("Outer closure unavailable."),
    );
  }

  /// Returns true if request is outstanding or complete. Returns false when
  /// request was never issued, was canceled, or failed.
  pub fn is_looping(&self) -> bool {
    self.frame_id.borrow().is_some()
  }

  pub fn stop(&mut self) {
    if let Some(frame_id) = *self.frame_id.borrow() {
      self.window.cancel_animation_frame(frame_id).ok();
    }
    *self.frame_id.borrow_mut() = None;
  }
}

impl Drop for FrameLooper {
  fn drop(&mut self) {
    self.stop();
  }
}

fn request(window: &Window, closure: &Closure<dyn FnMut(f64)>) -> Option<i32> {
  window.request_animation_frame(closure.as_ref().unchecked_ref()).ok()
}
