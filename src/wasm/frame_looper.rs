use super::frame_listener::FrameListener;
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::Window;

/// A FrameListener wrapper that re-requests on each frame.
#[derive(Clone)]
pub struct FrameLooper {
  window: Window,
  /// A mutable reference to a FrameListener. The reference is shared between
  /// the call to start() and then the looping closure. Cloning frame_listener's
  /// reference directly or the entire FrameLooper structure causes its state to
  /// be shared between held references.
  ///
  /// The FrameListener is initialized with an empty callback. It's possible to
  /// interact with this state via is_looping() and stop() but there's nothing
  /// surprising about it. The FrameListener is fully replaced on every call to
  /// start() in order to reinitialize its on_loop variable for the sake of the
  /// client which would have to hold a reference to Self with a FrameListener
  /// Option instead of simply a FrameListener since the callback creates a
  /// circular reference at constructor time if FrameListener property is used.
  frame_listener: Rc<RefCell<FrameListener>>,
}

impl FrameLooper {
  pub fn new(window: Window) -> Self {
    Self {
      window: window.clone(),
      frame_listener: Rc::new(RefCell::new(FrameListener::new(window, |_| ()))),
    }
  }

  pub fn start<T: 'static + FnMut(f64)>(&self, mut on_loop: T) {
    if self.is_looping() {
      return;
    }

    // Clone the reference for the closure.
    let frame_listener = self.frame_listener.clone();
    let fnc = move |time: f64| {
      on_loop(time);

      if frame_listener.borrow().is_issued() {
        // Not canceled in on_loop(). Request another frame.
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
