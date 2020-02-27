use super::anim_looper::AnimLooper;
use super::renderer::Renderer;
use super::shader_layout::ShaderLayout;
use super::viewport;
use crate::math::rect::{Rect, R16};
use crate::math::wh::WH16;
use crate::math::xy::XY16;
use crate::utils::Millis;
use crate::wasm::event_listener::{AddEventListener, EventListener};
use image::{DynamicImage, GenericImageView};
use num::traits::cast::ToPrimitive;
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::{console, Document, Event, HtmlCanvasElement, Window};

#[derive(Serialize)]
struct Instance {
  pub src: R16,
  pub constituent: R16,
  pub composition: u8,
  pad: u8,
  pub dst: R16,
  pub scale: XY16,
  pub wrap_xy: XY16,
  pub wrap_velocity_xy: XY16,
}

impl Instance {
  pub fn new(
    src: R16,
    constituent: R16,
    composition: u8,
    dst: R16,
    scale: XY16,
    wrap_xy: XY16,
    wrap_velocity_xy: XY16,
  ) -> Self {
    Instance {
      src,
      constituent,
      composition,
      pad: 0,
      dst,
      scale,
      wrap_xy,
      wrap_velocity_xy,
    }
  }
}

#[derive(Clone)]
pub struct RendererStateMachine {
  shader_layout: Rc<ShaderLayout>,
  vert_glsl: Rc<String>,
  frag_glsl: Rc<String>,
  atlas_img: Rc<DynamicImage>,
  win: Window,
  doc: Document,
  canvas: HtmlCanvasElement,
  renderer: Rc<RefCell<Renderer>>,
  looper: AnimLooper,
  listeners: Rc<RefCell<Vec<EventListener>>>,
  now: Rc<RefCell<f64>>,
}

impl RendererStateMachine {
  pub fn new(
    shader_layout: ShaderLayout,
    vert_glsl: String,
    frag_glsl: String,
    atlas_img: DynamicImage,
    win: Window,
    canvas: HtmlCanvasElement,
  ) -> Self {
    let renderer = Rc::new(RefCell::new(Renderer::new(
      &shader_layout,
      &vert_glsl,
      &frag_glsl,
      &atlas_img,
      canvas.clone(),
    )));
    Self {
      shader_layout: Rc::new(shader_layout),
      vert_glsl: Rc::new(vert_glsl),
      frag_glsl: Rc::new(frag_glsl),
      atlas_img: Rc::new(atlas_img),
      doc: win.document().expect("Document missing."),
      win: win.clone(),
      canvas,
      renderer,
      looper: AnimLooper::new(win),
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
      let vert_glsl: &String = std::borrow::Borrow::borrow(&self.vert_glsl);
      let frag_glsl: &String = std::borrow::Borrow::borrow(&self.frag_glsl);
      let atlas_img = std::borrow::Borrow::borrow(&self.atlas_img);
      *self.renderer.borrow_mut() = Renderer::new(
        std::borrow::Borrow::borrow(&self.shader_layout),
        vert_glsl,
        frag_glsl,
        atlas_img,
        self.canvas.clone(),
      );
      self.resume();
    } else if ev.type_() == "focus" {
      self.resume();
    } else {
      self.pause()
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
    let bytes = Instance::new(
      R16::cast_wh(80, 150, 11, 13),
      R16::cast_wh(80, 150, 11, 13),
      0,
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
