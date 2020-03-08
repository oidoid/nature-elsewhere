use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::closure::Closure;
use wasm_bindgen::JsCast;
use web_sys::Window;

/// Wraps a repeating Window.request_animation_frame() request. Clone is
/// provided to enable references across closures.
#[derive(Clone)]
pub struct WindowAnimationFrameLooper {
  win: Window,

  /// A mutable reference to a frame request ID. Some when an outstanding frame
  /// is requested, None when stopped. When AnimLooper is cloned, the underlying
  /// data is shared allowing the clone to read or mutate the ID.
  frame_id: Rc<RefCell<Option<i32>>>,
}

impl WindowAnimationFrameLooper {
  pub fn new(win: Window) -> Self {
    Self { win, frame_id: Rc::new(RefCell::new(None)) }
  }

  pub fn start<T>(&self, mut on_loop: T)
  where
    T: 'static + FnMut(f64, f64),
  {
    if self.is_looping() {
      return;
    }

    // Give the clone of self to the closure.
    let clone = self.clone();
    let mut then = None;

    // A shared mutable reference to an optional closure. The closure is None
    // initially to avoid a circular reference at declaration which is forbidden
    // by the borrow checker. The reference is then cloned to properly
    // initialize the shared value once the the function has been declared.
    let closure_rc0 = Rc::new(RefCell::new(None));
    let closure_rc1 = closure_rc0.clone();
    let fnc = Box::new(move |now: f64| {
      on_loop(then.unwrap_or(now), now);
      then = Some(now);
      if clone.is_looping() {
        let frame_id = clone.req_frame(&closure_rc0).ok();
        *(*clone.frame_id).borrow_mut() = frame_id;
      } else {
        // Drop.
        let _ = closure_rc0.borrow_mut().take();
      }
    });
    *closure_rc1.borrow_mut() = Some(Closure::wrap(fnc));

    let frame_id = self.req_frame(&closure_rc1).ok();
    *(*self.frame_id).borrow_mut() = frame_id;
  }

  pub fn is_looping(&self) -> bool {
    (*self.frame_id).borrow().is_some()
  }

  pub fn stop(&mut self) {
    if let Some(frame_id) = *(*self.frame_id).borrow() {
      self.win.cancel_animation_frame(frame_id).unwrap_or(());
    } // Else already stopped.
    *(*self.frame_id).borrow_mut() = None;
  }

  fn req_frame(
    &self,
    closure: &Rc<RefCell<Option<Closure<dyn FnMut(f64)>>>>,
  ) -> Result<i32, wasm_bindgen::JsValue> {
    self.win.request_animation_frame(
      closure
        .borrow()
        .as_ref()
        .expect("Closure unavailable.")
        .as_ref()
        .unchecked_ref(),
    )
  }
}
