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
use crate::wasm::util::expect_document;
use num::traits::cast::ToPrimitive;
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::{console, Document, Event, HtmlCanvasElement, Window};

#[derive(Clone)]
pub struct RendererStateMachine {
  window: Window,
  document: Document,
  canvas: HtmlCanvasElement,
  assets: Rc<Assets>,
  renderer: Rc<RefCell<Renderer>>,
  looper: WindowAnimationFrameLooper,
  listeners: Rc<RefCell<Vec<EventListener>>>,
  now: Rc<RefCell<f64>>,
}

impl RendererStateMachine {
  pub fn new(
    window: Window,
    canvas: HtmlCanvasElement,
    assets: Assets,
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
      document: expect_document(&window),
      assets: Rc::new(assets),
      canvas,
      renderer,
      looper: WindowAnimationFrameLooper::new(window),
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
    // that the game appears ready. Theoretically, a zero time should mean
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
    let elapsed = (now - then).to_f32().unwrap_or(0.);
    console::log_3(&then.into(), &now.into(), &elapsed.into());
    let canvas_wh = viewport::canvas_wh(&self.document);
    let scale = viewport::scale(&canvas_wh, &WH16 { w: 128, h: 128 }, 0);
    let cam_wh = viewport::cam_wh(&canvas_wh, scale);
    let bytes = [
      Sprite::new(
        R16::cast_wh(80, 150, 11, 13),
        R16::cast_wh(80, 150, 11, 13),
        SpriteComposition::Source,
        R16::cast_wh(32, 32, 11, 13),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: 1, y: 1 },
      ),
      Sprite::new(
        R16::cast_wh(80, 240, 16, 16),
        R16::cast_wh(80, 240, 16, 16),
        SpriteComposition::Source,
        R16::cast_wh(32, 32, 160, 160),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: 0, y: 0 },
      ),
      // Sprite::new(
      //   R16::cast_wh(64, 240, 16, 16),
      //   R16::cast_wh(64, 240, 16, 16),
      //   SpriteComposition::SourceIn,
      //   R16::cast_wh(32, 32, 60, 60),
      //   XY16 { x: 1, y: 1 },
      //   XY16 { x: 0, y: 0 },
      //   XY16 { x: -64, y: -48 },
      // ),
      Sprite::new(
        R16::cast_wh(48, 240, 32, 16),
        R16::cast_wh(16, 240, 32, 16),
        SpriteComposition::SourceIn,
        R16::cast_wh(48, 48, 32, 16),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: -64, y: 32 },
      ),
      Sprite::new(
        R16::cast_wh(48, 240, 24, 16),
        R16::cast_wh(16, 240, 24, 16),
        SpriteComposition::SourceIn,
        R16::cast_wh(55, 40, 24, 16),
        XY16 { x: 1, y: 1 },
        XY16 { x: -64, y: 32 },
        XY16 { x: -64, y: 32 },
      ),
    ];
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
