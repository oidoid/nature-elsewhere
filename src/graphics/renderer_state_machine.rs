use super::renderer::Renderer;
use super::viewport;
use super::window_animation_frame_looper::WindowAnimationFrameLooper;
use crate::assets::Assets;
use crate::math::rect::{Rect, R16};
use crate::math::wh::WH16;
use crate::math::xy::XY16;
use crate::sprites::sprite::Sprite;
use crate::sprites::sprite_composition::SpriteComposition;
use crate::wasm::event_listener::{AddEventListener, EventListener};
use num::traits::cast::ToPrimitive;
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::{console, Document, Event, HtmlCanvasElement, Window};

#[derive(Clone)]
pub struct RendererStateMachine {
  win: Window,
  doc: Document,
  canvas: HtmlCanvasElement,
  assets: Rc<Assets>,
  renderer: Rc<RefCell<Renderer>>,
  looper: WindowAnimationFrameLooper,
  listeners: Rc<RefCell<Vec<EventListener>>>,
  now: Rc<RefCell<f64>>,
}

impl RendererStateMachine {
  pub fn new(win: Window, canvas: HtmlCanvasElement, assets: Assets) -> Self {
    let renderer = Rc::new(RefCell::new(Renderer::new(
      &assets.shader_layout,
      &assets.vert_glsl,
      &assets.frag_glsl,
      &assets.atlas_img,
      canvas.clone(),
    )));
    Self {
      doc: win.document().expect("Document missing."),
      win: win.clone(),
      assets: Rc::new(assets),
      canvas,
      renderer,
      looper: WindowAnimationFrameLooper::new(win),
      listeners: Rc::new(RefCell::new(Vec::new())),
      now: Rc::new(RefCell::new(0.)),
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
    // This isn't great but go ahead and one run loop regardless of focus so
    // that the game appears ready. Theoretically, a zero time should meean
    // nothing changes but not everything is fully loop independent like input
    // sampling.
    let now = *self.now.borrow();
    self.on_loop(now, now);

    if self.is_focused() {
      let looper = self.looper.clone();
      let rc = Rc::new(RefCell::new(self.clone()));
      looper.start(move |then, now| rc.borrow_mut().on_loop(then, now));
    }
  }

  fn is_focused(&self) -> bool {
    self.doc.has_focus().unwrap_or(false)
  }

  fn pause(&mut self) {
    self.looper.stop();
  }

  fn on_event(&mut self, ev: Event) {
    if ev.type_() == "webglcontextrestored" {
      let assets: &Assets = std::borrow::Borrow::borrow(&self.assets);
      *self.renderer.borrow_mut() = Renderer::new(
        &assets.shader_layout,
        &assets.vert_glsl,
        &assets.frag_glsl,
        &assets.atlas_img,
        self.canvas.clone(),
      );
      self.resume();
    } else if ev.type_() == "focus" {
      self.resume();
    } else {
      self.pause();
    }
    ev.prevent_default();
  }

  fn on_loop(&mut self, then: f64, now: f64) {
    *self.now.borrow_mut() = now;
    let elapsed = (now - then).to_f32().unwrap_or(0.);
    console::log_3(&then.into(), &now.into(), &elapsed.into());
    let canvas_wh = viewport::canvas_wh(&self.doc);
    let scale = viewport::scale(&canvas_wh, &WH16 { w: 128, h: 128 }, 0);
    let cam_wh = viewport::cam_wh(&canvas_wh, scale);
    let bytes = Sprite::new(
      R16::cast_wh(80, 150, 11, 13),
      R16::cast_wh(80, 150, 11, 13),
      SpriteComposition::Source,
      R16::cast_wh(32, 32, 11, 13),
      XY16 { x: 1, y: 1 },
      XY16 { x: 0, y: 0 },
      XY16 { x: 0, y: 0 },
    );
    let bytes = bincode::config().native_endian().serialize(&bytes).unwrap();

    self.renderer.borrow_mut().render(
      now.to_i32().unwrap(), // https://github.com/rust-lang/rust/issues/10184
      &canvas_wh,
      scale,
      &Rect::cast(0, 0, cam_wh.w, cam_wh.h),
      &bytes,
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
      rc.borrow()
        .win
        .add_event_listener(event, move |ev| rc1.borrow_mut().on_event(ev)),
    );
  }

  fn add_canvas_on_event_listener(rc: &Rc<RefCell<Self>>, event: &'static str) {
    let rc1 = rc.clone();
    rc.borrow().listeners.borrow_mut().push(
      rc.borrow()
        .canvas
        .add_event_listener(event, move |ev| rc1.borrow_mut().on_event(ev)),
    );
  }
}
