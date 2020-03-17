use super::assets::Assets;
use super::ecs::entity_operator::EntityOperator;
use super::ecs::resources::TimeStep;
use super::ecs::{bounds::Bounds, max_wh::MaxWH, text::Text};
use super::graphics::renderer_state_machine::RendererStateMachine;
use crate::graphics::renderer::Renderer;
use crate::graphics::viewport;
use crate::inputs::input_poller::InputPoller;
use crate::math::rect::{Rect, R16};
use crate::math::wh::WH16;
use crate::math::xy::XY16;
use crate::sprites::sprite::Sprite;
use crate::sprites::sprite_composition::SpriteComposition;
use num::traits::cast::ToPrimitive;
use specs::prelude::{ResourceId, SystemData};
use specs::DispatcherBuilder;
use specs::Join;
use specs::{
  Builder, ReadExpect, ReadStorage, RunNow, System, World, WorldExt,
};
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::{console, Document, HtmlCanvasElement, Window};
struct RenderSystem;

#[derive(SystemData)]
pub struct RenderData<'a> {
  time_step: ReadExpect<'a, TimeStep>,
  bounds: ReadStorage<'a, Bounds>,
  text: ReadStorage<'a, Text>,
  max_wh: ReadStorage<'a, MaxWH>,
}

impl<'a> System<'a> for RenderSystem {
  type SystemData = RenderData<'a>;

  fn run(&mut self, data: Self::SystemData) {
    let RenderData { time_step, bounds, text, max_wh } = data;
    for (bounds, text, max_wh) in (&bounds, &text, (&max_wh).maybe()).join() {
      console::log_1(
        &format!(
          "Hello {:?} {} {} {:?}",
          &bounds,
          time_step.0,
          text.0,
          max_wh.unwrap_or(&MaxWH(WH16::from(255, 255))).0
        )
        .into(),
      );
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
  fn create_entities(&mut self) {
    let mut world = self.world.borrow_mut();
    world.register::<Bounds>();
    world.register::<EntityOperator>();
    world.register::<Text>();
    world.register::<MaxWH>();
    world.create_entity().with(Bounds::new(1, 2, 3, 4)).build();
    world.create_entity().with(EntityOperator::Player).build();
    world
      .create_entity()
      .with(Bounds::new(5, 6, 7, 8))
      .with(Text("hello\nw\no\nr\nl\nd".to_string()))
      .with(MaxWH(WH16::from(5, 5)))
      .build();
    world.insert(TimeStep(0.));
    {
      let mut delta = world.write_resource::<TimeStep>();
      *delta = TimeStep(16.67);
    }
    let mut dispatcher =
      DispatcherBuilder::new().with(RenderSystem, "render_system", &[]).build();
    dispatcher.dispatch(&world);
  }

  pub fn new(
    window: Window,
    document: Document,
    canvas: HtmlCanvasElement,
    assets: Assets,
  ) -> Self {
    let mut game = Game {
      window: window.clone(),
      document: document.clone(),
      canvas: canvas.clone(),
      world: Rc::new(RefCell::new(World::new())),
      renderer_state_machine: Rc::new(RefCell::new(None)),
      input_poller: Rc::new(RefCell::new(InputPoller::new(&window))),
    };

    let renderer_state_machine =
      RendererStateMachine::new(window, document, canvas, assets, {
        let mut clone = game.clone();
        move |renderer, time, then, now| {
          clone.on_loop(renderer, time, then, now)
        }
      });
    *game.renderer_state_machine.borrow_mut() = Some(renderer_state_machine);

    game.create_entities();

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
    *self.world.borrow().write_resource::<TimeStep>() = TimeStep(now - then);

    self.world.borrow_mut().maintain();
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
