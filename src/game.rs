use super::assets::Assets;
use super::graphics::renderer_state_machine::RendererStateMachine;
use crate::components::entity_operator::EntityOperator;
use crate::components::{bounds::Bounds, max_wh::MaxWH, text::Text};
use crate::graphics::renderer::Renderer;
use crate::graphics::viewport::Viewport;
use crate::inputs::input_poller::InputPoller;
use crate::math::wh::WH16;
use crate::math::Millis;
use crate::resources::Timing;
use crate::systems::renderer::RendererSystem;
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

    ecs
      .create_entity()
      // .with(EntityOperator::Player)
      .with(Bounds::new(1, 2, 3, 4))
      .build();
    ecs
      .create_entity()
      .with(Bounds::new(5, 6, 7, 8))
      .with(Text("hello\nw\no\nr\nl\nd".to_string()))
      .with(MaxWH(WH16::from(5, 5)))
      .build();
    // ecs.insert(Renderer);
  }

  pub fn new(
    window: Window,
    document: Document,
    canvas: HtmlCanvasElement,
    assets: Assets,
  ) -> Self {
    let dispatcher = DispatcherBuilder::new()
      .with(RendererSystem, "render_system", &[])
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
        move |renderer, time, then, now| {
          clone.on_loop(renderer, time, then, now)
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
    then: Millis,
    now: Millis,
  ) {
    self.ecs.borrow_mut().insert(Timing { play_time, step: now - then });
    self.ecs.borrow_mut().insert(renderer);
    self.ecs.borrow_mut().insert(Viewport::new(&self.document));
    self.dispatcher.borrow_mut().dispatch(&self.ecs.borrow_mut());
    self.ecs.borrow_mut().maintain();
  }
}
