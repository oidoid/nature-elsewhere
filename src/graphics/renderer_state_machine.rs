use super::renderer::Renderer;
use crate::assets::Assets;
use crate::math::Millis;
use crate::wasm;
use crate::wasm::event_listener::{AddEventListener, EventListener};
use crate::wasm::frame_looper::FrameLooper;
use std::cell::RefCell;
use std::ops::DerefMut;
use std::rc::Rc;
use web_sys::{Document, Event, HtmlCanvasElement, Window};

#[derive(Clone)]
pub struct RendererStateMachine {
  window: Window,
  document: Document,
  canvas: HtmlCanvasElement,
  assets: Rc<Assets>,
  renderer: Rc<RefCell<Renderer>>,
  looper: FrameLooper,
  listeners: Rc<RefCell<Vec<EventListener>>>,
  now: Rc<RefCell<Millis>>,
  /// Total game time elapsed.
  time: Rc<RefCell<Millis>>,
  on_loop_callback: Rc<RefCell<dyn FnMut(&mut Renderer, f64, f64, f64)>>,
}

impl RendererStateMachine {
  pub fn new<T: 'static + FnMut(&mut Renderer, f64, f64, f64)>(
    window: Window,
    document: Document,
    canvas: HtmlCanvasElement,
    assets: Assets,
    on_loop: T,
  ) -> Self {
    let renderer = Rc::new(RefCell::new(Renderer::new(
      &assets.shader_layout,
      &assets.vertex_glsl,
      &assets.fragment_glsl,
      &assets.atlas_image,
      canvas.clone(),
    )));
    Self {
      window: window.clone(),
      document,
      assets: Rc::new(assets),
      canvas,
      renderer,
      now: Rc::new(RefCell::new(wasm::expect_performance(&window).now())),
      looper: FrameLooper::new(window),
      listeners: Rc::new(RefCell::new(Vec::new())),
      time: Rc::new(RefCell::new(0.)),
      on_loop_callback: Rc::new(RefCell::new(on_loop)),
    }
  }

  pub fn start(&mut self) {
    if !self.listeners.borrow().is_empty() {
      return;
    }
    self.register();
    self.resume();
  }

  pub fn stop(&mut self) {
    if self.listeners.borrow().is_empty() {
      return;
    }
    self.pause();
    self.deregister();
  }

  fn resume(&mut self) {
    if self.renderer.borrow().is_context_lost() {
      return;
    }
    // Run one loop regardless of focus so that the game appears. A zero time
    // delta should mostly cause no updates but not everything is fully loop
    // independent like input sampling.
    let now = *self.now.borrow();
    self.on_loop(now, now);

    if self.is_focused() {
      let rc = Rc::new(RefCell::new(self.clone()));
      self.looper.start(move |then, now| rc.borrow_mut().on_loop(then, now));
    }
  }

  fn is_focused(&self) -> bool {
    self.document.has_focus().unwrap_or(false)
  }

  fn pause(&mut self) {
    self.looper.stop();
  }

  fn on_event(&mut self, event: Event) {
    if event.type_() == "webglcontextrestored" {
      let assets: &Assets = std::borrow::Borrow::borrow(&self.assets);
      *self.renderer.borrow_mut() = Renderer::new(
        &assets.shader_layout,
        &assets.vertex_glsl,
        &assets.fragment_glsl,
        &assets.atlas_image,
        self.canvas.clone(),
      );
      self.resume();
    } else if event.type_() == "focus" {
      self.resume();
    } else {
      self.pause();
    }
    event.prevent_default();
  }

  fn on_loop(&mut self, then: f64, now: f64) {
    *self.now.borrow_mut() = now;
    let time = *self.time.borrow() + now - then;
    *self.time.borrow_mut() = time;
    self.on_loop_callback.borrow_mut().deref_mut()(
      self.renderer.borrow_mut().deref_mut(),
      time,
      then,
      now,
    );
  }

  fn register(&mut self) {
    if !self.listeners.borrow().is_empty() {
      return;
    }

    let rc = Rc::new(RefCell::new(self.clone()));
    Self::add_win_on_event_listener(&rc, "focus");
    Self::add_win_on_event_listener(&rc, "blur");
    Self::add_canvas_on_event_listener(&rc, "webglcontextrestored");
    Self::add_canvas_on_event_listener(&rc, "webglcontextlost");
  }

  fn deregister(&mut self) {
    // EventListener.drop() will invoke EventTarget.remove_event_listener().
    self.listeners.borrow_mut().clear();
  }

  fn add_win_on_event_listener(rc: &Rc<RefCell<Self>>, event: &'static str) {
    let rc1 = rc.clone();
    rc.borrow().listeners.borrow_mut().push(
      rc.borrow().window.add_event_listener(event, move |event| {
        rc1.borrow_mut().on_event(event)
      }),
    );
  }

  fn add_canvas_on_event_listener(rc: &Rc<RefCell<Self>>, event: &'static str) {
    let rc1 = rc.clone();
    rc.borrow().listeners.borrow_mut().push(
      rc.borrow().canvas.add_event_listener(event, move |event| {
        rc1.borrow_mut().on_event(event)
      }),
    );
  }
}
