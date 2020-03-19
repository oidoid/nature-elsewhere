use super::assets::Assets;
use super::graphics::RendererStateMachine;
use crate::components::player::Player;
use crate::components::{bounds::Bounds, max_wh::MaxWH, text::Text};
use crate::graphics::Renderer;
use crate::graphics::Viewport;
use crate::inputs::InputPoller;
use crate::math::wh::WH16;
use crate::math::Millis;
use crate::resources::Timing;
use crate::systems::{InputProcessorSystem, RendererSystem};
use specs::{Builder, RunNow, World, WorldExt};
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

    ecs.create_entity().with(Player {}).with(Bounds::new(1, 2, 3, 4)).build();
    ecs
      .create_entity()
      .with(Bounds::new(5, 6, 7, 8))
      .with(Text("hello\nw\no\nr\nl\nd".to_string()))
      .with(MaxWH(WH16::from(5, 5)))
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
