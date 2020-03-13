use super::assets::Assets;
use super::ecs::bounds::Bounds;
use super::ecs::entity_operator::EntityOperator;
use super::graphics::renderer_state_machine::RendererStateMachine;
use crate::inputs::input_poller::InputPoller;
use specs::DispatcherBuilder;
use specs::Join;
use specs::{Builder, Read, ReadStorage, RunNow, System, World, WorldExt};
use web_sys::{console, HtmlCanvasElement, Window};

#[derive(Default)]
struct DurationResource(f64);

struct RenderSystem;

impl<'a> System<'a> for RenderSystem {
  type SystemData = (Read<'a, DurationResource>, ReadStorage<'a, Bounds>);

  fn run(&mut self, data: Self::SystemData) {
    let (duration, bounds) = data;
    let duration = duration.0;
    for (bounds) in (&bounds).join() {
      console::log_1(&format!("Hello {:?} {}", &bounds, duration).into());
    }
  }
}

pub struct Game {
  win: Window,
  canvas: HtmlCanvasElement,
  world: World,
  renderer_state_machine: RendererStateMachine,
  input_poller: InputPoller,
}

impl Game {
  pub fn new(win: Window, canvas: HtmlCanvasElement, assets: Assets) -> Self {
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
    let renderer_state_machine =
      RendererStateMachine::new(win.clone(), canvas.clone(), assets);
    Game {
      win: win.clone(),
      canvas,
      world,
      renderer_state_machine,
      input_poller: InputPoller::new(&win),
    }
  }

  pub fn start(&mut self) {
    self.renderer_state_machine.start();
    self.input_poller.register();
  }

  pub fn stop(&mut self) {
    self.input_poller.deregister();
    self.renderer_state_machine.stop();
  }

  fn on_pause(&mut self) {
    console::log_1(&"Paused.".into());
    self.stop()
  }
}
