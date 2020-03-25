use super::ID;
use super::{Blueprint, ComponentMap};
use crate::components::{Children, Parent};
use specs::world::Builder;
use specs::world::Entity;
use specs::world::WorldExt;
use specs::World;
use std::collections::HashMap;

pub struct Manufacturer {
  blueprints: HashMap<ID, Blueprint>,
}

impl Manufacturer {
  pub fn new(blueprints: HashMap<ID, Blueprint>) -> Self {
    Self { blueprints }
  }

  /// Returns the root Entity.
  pub fn manufacture(&self, ecs: &mut World, id: ID) -> Entity {
    let blueprint = &self.blueprints[&id];
    self.manufacture_blueprint(ecs, blueprint)
  }

  /// This is not parsing. This is processing an existing Blueprint (and all
  /// child Blueprints therein). Processing means converting the Blueprints to
  /// Entitys. Entitys are just identifiers that are associated with Components.
  /// All of these Components and identifiers are injected directly into the
  /// World. Only the root Entity is returned.
  pub fn manufacture_blueprint(
    &self,
    ecs: &mut World,
    blueprint: &Blueprint,
  ) -> Entity {
    let mut entity = ecs.create_entity();

    macro_rules! entity_with_some_components {
      ( $($component:ident),* ) => {$(
        if let Some(component) = &blueprint.components.$component {
          entity = entity.with(component.clone());
        }
      )*}
    }
    // todo: there's no checking when adding new components to ComponentMap that
    // they're added here as well.
    entity_with_some_components!(
      cam,
      follow_mouse,
      position,
      velocity,
      text,
      max_wh,
      parent,
      children
    );

    let entity = entity.build();

    let mut children = vec![];
    for child in &blueprint.children {
      let mut patched = self.blueprints[&child.id].patch(child);
      patched.components.parent = Some(Parent(entity.clone()));
      let child = self.manufacture_blueprint(ecs, &patched);
      // todo: establish relationship components (anything with Entity ID target or parent / child relationship)
      // enum Relation {
      //   Parent,
      //   Child,
      //   TargetPlayer(Player),
      //   Camera
      // }
      children.push(child);
    }

    ecs.write_storage::<Children>().insert(entity, Children(children));

    entity
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use crate::components::{Position, Velocity};
  use crate::math::XY;
  use specs::join::Join;

  #[test]
  fn manufacture_empty() {
    let mut blueprints = HashMap::new();
    blueprints.insert(ID::Bee, from_json!({"id": "Bee"}).unwrap());
    let manufacturer = Manufacturer::new(blueprints);
    let mut ecs = World::new();
    ecs.register::<Parent>();
    ecs.register::<Children>();

    manufacturer.manufacture(&mut ecs, ID::Bee);

    let entities: Vec<Entity> = (&ecs.entities()).join().collect();
    assert_eq!(entities.len(), 1);
  }

  #[test]
  fn manufacture_components() {
    let mut blueprints = HashMap::new();
    blueprints.insert(
      ID::Bee,
      from_json!({
        "id": "Bee",
        "components": {
          "position": {"x": 1, "y": 2},
          "velocity": {"x": 3, "y": 4}
        }
      })
      .unwrap(),
    );
    let manufacturer = Manufacturer::new(blueprints);
    let mut ecs = World::new();
    // todo: can i use exec instead/
    ecs.register::<Parent>();
    ecs.register::<Children>();
    ecs.register::<Position>();
    ecs.register::<Velocity>();

    let entity = manufacturer.manufacture(&mut ecs, ID::Bee);

    let position = ecs.read_storage::<Position>();
    let position = position.get(entity).unwrap();
    assert_eq!(position.0, XY::new(1, 2));
    let velocity = ecs.read_storage::<Velocity>();
    let velocity = velocity.get(entity).unwrap();
    assert_eq!(velocity.0, XY::new(3, 4));
  }

  #[test]
  fn manufacture_children() {
    let mut blueprints = HashMap::new();
    blueprints.insert(
      ID::SaveDialog,
      from_json!({
        "id": "SaveDialog",
        "components": {"position": {"x": 1, "y": 2}},
        "children": [
          {"id": "Button", "components": {"position": {"x": 3, "y": 4}}},
          {"id": "Button", "components": {"position": {"x": 5, "y": 6}}}
        ]
      })
      .unwrap(),
    );
    blueprints.insert(
      ID::Button,
      from_json!({
        "id": "Button",
        "components": {
          "position": {"x": 7, "y": 8},
          "velocity": {"x": 9, "y": 10}
        }
      })
      .unwrap(),
    );
    let manufacturer = Manufacturer::new(blueprints);
    let mut ecs = World::new();
    ecs.register::<Parent>();
    ecs.register::<Children>();
    ecs.register::<Position>();
    ecs.register::<Velocity>();

    let entity = manufacturer.manufacture(&mut ecs, ID::SaveDialog);

    let entities: Vec<Entity> = (&ecs.entities()).join().collect();
    assert_eq!(entities.len(), 3);

    // let position = ecs.read_storage::<Position>();
    // let position = position.get(entity).unwrap();
    // assert_eq!(position.0, XY::new(1, 2));
    // let velocity = ecs.read_storage::<Velocity>();
    // let velocity = velocity.get(entity).unwrap();
    // assert_eq!(velocity.0, XY::new(3, 4));
  }
}
