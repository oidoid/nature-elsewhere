use super::assets::Assets;
use super::ecs::bounds::Bounds;
use super::ecs::operator::Operator;
use super::graphics::renderer_state_machine::RendererStateMachine;
use super::math::xy::{XY, XY16};
use crate::atlas::atlas::Atlas;
use crate::graphics::shader_layout::ShaderLayout;
use crate::inputs::input_poller::InputPoller;
use image::DynamicImage;
use specs::{
  Builder, Component, ReadStorage, RunNow, System, VecStorage, World, WorldExt,
};
use web_sys::{console, HtmlCanvasElement, Window};

struct HelloWorld;

impl<'a> System<'a> for HelloWorld {
  type SystemData = ReadStorage<'a, Bounds>;

  fn run(&mut self, boundses: Self::SystemData) {
    use specs::Join;

    for bounds in boundses.join() {
      console::log_1(&format!("Hello {:?}", &bounds).into());
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
    world.register::<Operator>();
    world.create_entity().with(Bounds::new(1, 2, 3, 4)).build();
    world.create_entity().with(Operator::Player).build();
    world.create_entity().with(Bounds::new(5, 6, 7, 8)).build();
    let mut hello_world = HelloWorld;
    hello_world.run_now(&world);
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
