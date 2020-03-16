use super::frame_listener::FrameListener;
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::Window;

/// A FrameListener wrapper that re-requests on each frame.
#[derive(Clone)]
pub struct FrameLooper {
  window: Window,
  /// A mutable reference to a FrameListener. The reference is shared between
  /// the call to start() and then the looping closure.
  frame_listener: Rc<RefCell<FrameListener>>,
}

impl FrameLooper {
  pub fn new(window: Window) -> Self {
    Self {
      window: window.clone(),
      frame_listener: Rc::new(RefCell::new(FrameListener::new(window, |_| ()))),
    }
  }

  pub fn start<T: 'static + FnMut(f64, f64)>(&self, mut on_loop: T) {
    if self.is_looping() {
      return;
    }

    // Clone the reference for the closure.
    let frame_listener = self.frame_listener.clone();
    let mut then = super::expect_performance(&self.window).now();
    let fnc = move |now: f64| {
      on_loop(then, now);
      then = now;

      if frame_listener.borrow().is_issued() {
        frame_listener.borrow_mut().request();
      }
    };

    // Dereference the FrameListener reference and replace its contents.
    *self.frame_listener.borrow_mut() =
      FrameListener::new(self.window.clone(), fnc);

    self.frame_listener.borrow_mut().request();
  }

  pub fn is_looping(&self) -> bool {
    self.frame_listener.borrow().is_issued()
  }

  pub fn stop(&mut self) {
    self.frame_listener.borrow_mut().cancel();
  }
}
