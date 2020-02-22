use super::ecs::bounds::Bounds;
use super::ecs::operator::Operator;
use super::graphics::renderer_state_machine::RendererStateMachine;
use super::math::xy::{XY, XY16};
use crate::graphics::shader_layout::ShaderLayout;
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
}

impl Game {
  pub fn new(
    shader_layout: ShaderLayout,
    vert_glsl: String,
    frag_glsl: String,
    win: Window,
    canvas: HtmlCanvasElement,
    atlas_img: DynamicImage,
  ) -> Self {
    let mut world = World::new();
    world.register::<Bounds>();
    world.register::<Operator>();
    world.create_entity().with(Bounds::new(1, 2, 3, 4)).build();
    world.create_entity().with(Operator::Player).build();
    world.create_entity().with(Bounds::new(5, 6, 7, 8)).build();
    let mut hello_world = HelloWorld;
    hello_world.run_now(&world);
    world.maintain();
    let renderer_state_machine = RendererStateMachine::new(
      shader_layout,
      vert_glsl,
      frag_glsl,
      atlas_img,
      win.clone(),
      canvas.clone(),
    );
    Game { win, canvas, world, renderer_state_machine }
  }

  pub fn start(&mut self) {
    self.renderer_state_machine.start();
  }

  pub fn stop(&mut self) {
    self.renderer_state_machine.stop();
  }

  fn on_pause(&mut self) {
    console::log_1(&"Paused.".into());
    self.stop()
  }
}
