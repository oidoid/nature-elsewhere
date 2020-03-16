use super::assets::Assets;
use super::ecs::bounds::Bounds;
use super::ecs::entity_operator::EntityOperator;
use super::graphics::renderer_state_machine::RendererStateMachine;
use crate::graphics::renderer::Renderer;
use crate::graphics::viewport;
use crate::inputs::input_poller::InputPoller;
use crate::math::rect::{Rect, R16};
use crate::math::wh::WH16;
use crate::math::xy::XY16;
use crate::math::Millis;
use crate::sprites::sprite::Sprite;
use crate::sprites::sprite_composition::SpriteComposition;
use crate::wasm;
use crate::wasm::event_listener::{AddEventListener, EventListener};
use crate::wasm::frame_looper::FrameLooper;
use num::traits::cast::ToPrimitive;
use specs::DispatcherBuilder;
use specs::Join;
use specs::{
  Builder, ReadExpect, ReadStorage, RunNow, System, World, WorldExt,
};
use std::cell::RefCell;
use std::convert::AsMut;
use std::ops::DerefMut;
use std::rc::Rc;
use web_sys::{console, Document, HtmlCanvasElement, Window};

#[derive(Default)]
struct DurationResource(f64);

struct RenderSystem;

impl<'a> System<'a> for RenderSystem {
  type SystemData = (ReadExpect<'a, DurationResource>, ReadStorage<'a, Bounds>);

  fn run(&mut self, data: Self::SystemData) {
    let (duration, bounds) = data;
    let duration = duration.0;
    for (bounds) in (&bounds).join() {
      console::log_1(&format!("Hello {:?} {}", &bounds, duration).into());
    }
  }
}

#[derive(Clone)]
pub struct Game {
  window: Window,
  document: Document,
  canvas: HtmlCanvasElement,
  world: Rc<RefCell<World>>,
  renderer_state_machine: Rc<RefCell<Option<RendererStateMachine>>>,
  input_poller: Rc<RefCell<InputPoller>>,
}

impl Game {
  pub fn new(
    window: Window,
    document: Document,
    canvas: HtmlCanvasElement,
    assets: Assets,
  ) -> Self {
    let mut world = World::new();
    world.register::<Bounds>();
    world.register::<EntityOperator>();
    world.create_entity().with(Bounds::new(1, 2, 3, 4)).build();
    world.create_entity().with(EntityOperator::Player).build();
    world.create_entity().with(Bounds::new(5, 6, 7, 8)).build();
    world.insert(DurationResource(0.));
    {
      let mut delta = world.write_resource::<DurationResource>();
      *delta = DurationResource(16.67);
    }
    let mut dispatcher =
      DispatcherBuilder::new().with(RenderSystem, "render_system", &[]).build();
    dispatcher.dispatch(&mut world);
    world.maintain();

    let game = Game {
      window: window.clone(),
      document: document.clone(),
      canvas: canvas.clone(),
      world: Rc::new(RefCell::new(world)),
      renderer_state_machine: Rc::new(RefCell::new(None)),
      input_poller: Rc::new(RefCell::new(InputPoller::new(&window))),
    };
    let mut clone = game.clone();
    let renderer_state_machine = RendererStateMachine::new(
      window,
      document,
      canvas,
      assets,
      move |renderer, time, then, now| clone.on_loop(renderer, time, then, now),
    );
    *game.renderer_state_machine.borrow_mut() = Some(renderer_state_machine);

    game
  }

  pub fn start(&mut self) {
    self.renderer_state_machine.borrow_mut().as_mut().unwrap().start();
    self.input_poller.borrow().register();
  }

  pub fn stop(&mut self) {
    self.input_poller.borrow().deregister();
    self.renderer_state_machine.borrow_mut().as_mut().unwrap().stop();
  }

  fn on_pause(&mut self) {
    console::log_1(&"Paused.".into());
    self.stop()
  }

  fn on_loop(
    &mut self,
    renderer: &mut Renderer,
    time: f64,
    then: f64,
    now: f64,
  ) {
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
        XY16 { x: 0, y: 0 },
      ),
      // Cool grass shader
      // Sprite::new(
      //   R16::cast_wh(80, 240, 16, 16),
      //   R16::cast_wh(80, 240, 16, 16),
      //   SpriteComposition::Source,
      //   R16::cast_wh(32, 32, 160, 160),
      //   XY16 { x: 1, y: 1 },
      //   XY16 { x: 0, y: 0 },
      //   XY16 { x: 0, y: 0 },
      // ),
      // Sprite::new(
      //   R16::cast_wh(48, 240, 32, 16),
      //   R16::cast_wh(16, 240, 32, 16),
      //   SpriteComposition::SourceIn,
      //   R16::cast_wh(48, 48, 32, 16),
      //   XY16 { x: 1, y: 1 },
      //   XY16 { x: 0, y: 0 },
      //   XY16 { x: -64, y: 32 },
      // ),
      // Sprite::new(
      //   R16::cast_wh(48, 240, 24, 16),
      //   R16::cast_wh(16, 240, 24, 16),
      //   SpriteComposition::SourceIn,
      //   R16::cast_wh(55, 40, 24, 16),
      //   XY16 { x: 1, y: 1 },
      //   XY16 { x: -64, y: 32 },
      //   XY16 { x: -64, y: 32 },
      // ),
    ];
    let bytes = bincode::config().native_endian().serialize(&bytes).unwrap();

    renderer.render(
      time.to_i32().unwrap(), // https://github.com/rust-lang/rust/issues/10184
      &canvas_wh,
      scale,
      &Rect::cast(0, 0, cam_wh.w, cam_wh.h),
      &bytes,
    );
  }
}
