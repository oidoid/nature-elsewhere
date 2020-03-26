use super::assets::Assets;
use super::graphics::RendererStateMachine;
use crate::components::{FollowMouse, Position};
use crate::graphics::Renderer;
use crate::graphics::Viewport;
use crate::inputs::InputPoller;
use crate::math::Millis;
use crate::math::R16;
use crate::math::{XY, XY16};
use crate::resources::Timing;
use crate::sprites::sprite::Sprite;
use crate::sprites::sprite_composition::SpriteComposition;
use crate::systems::{InputProcessorSystem, RendererSystem};
use specs::{Builder, World, WorldExt};
use specs::{Dispatcher, DispatcherBuilder};
use std::cell::RefCell;
use std::rc::Rc;
use std::time::Duration;
use web_sys::{console, Document, HtmlCanvasElement, Window};

#[derive(Clone)]
pub struct Game {
  window: Window,
  document: Document,
  canvas: HtmlCanvasElement,
  ecs: Rc<RefCell<World>>,
  dispatcher: Rc<RefCell<Dispatcher<'static, 'static>>>,
  renderer_state_machine: Rc<RefCell<Option<RendererStateMachine>>>,
  input_poller: Rc<RefCell<InputPoller>>,
}

impl Game {
  fn create_entities(&mut self) {
    let mut ecs = self.ecs.borrow_mut();
    self.dispatcher.borrow_mut().setup(&mut ecs);

    // i can get the entity ID at construction time of composed in entities
    // with(Cursor::new()).
    // with(Player {}).
    ecs
      .create_entity()
      .with(FollowMouse)
      .with(Position(XY { x: 10, y: 20 })) // see how this don't work. what about when there are multiple sprites in an entity's component thingy
      .with(Sprite::new(
        R16::cast_wh(80, 150, 11, 13),
        R16::cast_wh(80, 150, 11, 13),
        SpriteComposition::Source,
        R16::cast_wh(32, 32, 11, 13),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: 0, y: 0 },
      ))
      .build();
    // ecs.create_entity().with(Bounds::new(1, 2, 3, 4)).build();
    // ecs
    //   .create_entity()
    //   .with(Bounds::new(5, 6, 7, 8))
    //   .with(Position(XY { x: 10, y: 20 }))
    //   .with(Text("hello\nw\no\nr\nl\nd".to_string()))
    //   .with(MaxWH(WH16::from(5, 5)))
    //   .build();

    // Cool grass shader
    ecs
      .create_entity()
      .with(Sprite::new(
        R16::cast_wh(80, 240, 16, 16),
        R16::cast_wh(80, 240, 16, 16),
        SpriteComposition::Source,
        R16::cast_wh(32, 32, 160, 160),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: 0, y: 0 },
      ))
      .build();
    ecs
      .create_entity()
      .with(Sprite::new(
        R16::cast_wh(48, 240, 32, 16),
        R16::cast_wh(16, 240, 32, 16),
        SpriteComposition::SourceIn,
        R16::cast_wh(48, 48, 32, 16),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: -64, y: 32 },
      ))
      .build();
    ecs
      .create_entity()
      .with(Sprite::new(
        R16::cast_wh(48, 240, 24, 16),
        R16::cast_wh(16, 240, 24, 16),
        SpriteComposition::SourceIn,
        R16::cast_wh(55, 40, 24, 16),
        XY16 { x: 1, y: 1 },
        XY16 { x: -64, y: 32 },
        XY16 { x: -64, y: 32 },
      ))
      .build();
  }

  pub fn new(
    window: Window,
    document: Document,
    canvas: HtmlCanvasElement,
    assets: Assets,
  ) -> Self {
    let dispatcher = DispatcherBuilder::new()
      .with(InputProcessorSystem, "input_processor_system", &[])
      .with(RendererSystem, "render_system", &["input_processor_system"])
      .build();

    let mut game = Game {
      window: window.clone(),
      document: document.clone(),
      canvas: canvas.clone(),
      ecs: Rc::new(RefCell::new(World::new())),
      dispatcher: Rc::new(RefCell::new(dispatcher)),
      renderer_state_machine: Rc::new(RefCell::new(None)),
      input_poller: Rc::new(RefCell::new(InputPoller::new(&window))),
    };

    game.create_entities();
    let renderer_state_machine =
      RendererStateMachine::new(window, document, canvas, assets, {
        let mut clone = game.clone();
        move |renderer, play_time, delta| {
          clone.on_loop(renderer, play_time, delta)
        }
      });
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
    renderer: Rc<RefCell<Renderer>>,
    play_time: Duration,
    delta: Millis,
  ) {
    let mut ecs = self.ecs.borrow_mut();
    ecs.insert(Timing { play_time, delta });
    ecs.insert(self.input_poller.borrow().read());
    ecs.insert(renderer);
    ecs.insert(Viewport::new(&self.document));
    self.dispatcher.borrow_mut().dispatch(&ecs);
    ecs.maintain();
  }
}
