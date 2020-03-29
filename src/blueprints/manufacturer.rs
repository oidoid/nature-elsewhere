use super::Blueprint;
use super::BlueprintID;
use crate::components::{
  Cam, Children, FollowMouse, MaxWH, Parent, Position, Text, Velocity,
};
use crate::math::{WH, XY};
use specs::world::Builder;
use specs::world::Entity;
use specs::world::WorldExt;
use specs::World;
use std::collections::HashMap;

pub struct Manufacturer {
  blueprints: HashMap<BlueprintID, Blueprint>,
}

impl Manufacturer {
  pub fn new(blueprints: HashMap<BlueprintID, Blueprint>) -> Self {
    Self { blueprints }
  }

  /// Returns the root Entity.
  pub fn manufacture(&self, ecs: &mut World, id: BlueprintID) -> Entity {
    self.manufacture_blueprint(ecs, &self.blueprints[&id])
  }

  /// This is not parsing. This is processing an existing Blueprint (and all
  /// child Blueprints therein). Processing means converting the Blueprints to
  /// Entitys. Entitys are just identifiers that are associated with Components.
  /// All of these Components and identifiers are injected directly into the
  /// World.
  /// Returns the root Entity.
  pub fn manufacture_blueprint(
    &self,
    ecs: &mut World,
    blueprint: &Blueprint,
  ) -> Entity {
    let mut entity = ecs.create_entity();
    let components = &blueprint.components;

    macro_rules! entity_with_cloneable_components {
      ( $($component:ident),* ) => {$(
        if let Some(component) = &components.$component {
          entity = entity.with(component.clone());
        }
      )*}
    }
    entity_with_cloneable_components!(parent, children);

    if let Some(_component) = &components.follow_mouse {
      entity = entity.with(FollowMouse {});
    }
    if let Some(component) = &components.cam {
      entity = entity.with(Cam { area: WH::new(component.w, component.h) });
    }
    if let Some(component) = &components.max_wh {
      entity = entity.with(MaxWH { area: WH::new(component.w, component.h) });
    }
    if let Some(component) = &components.position {
      entity =
        entity.with(Position { position: XY::new(component.x, component.y) });
    }
    if let Some(component) = &components.velocity {
      entity =
        entity.with(Velocity { velocity: XY::new(component.x, component.y) });
    }
    if let Some(component) = &components.text {
      entity = entity.with(Text { text: component.clone() });
    }

    let entity = entity.build();

    let mut children = vec![];
    for child in &blueprint.children {
      let mut patched = self.blueprints[&child.id].patch(child);
      patched.components.parent = Some(Parent { parent: entity.clone() });
      let child = self.manufacture_blueprint(ecs, &patched);
      children.push(child);
    }

    if children.len() > 0 {
      ecs
        .write_storage::<Children>()
        .insert(entity, Children { children })
        .expect("Children component not inserted.");
    }

    entity
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use crate::components::{FollowMouse, Position, Velocity};
  use crate::math::{XY, XY16};
  use specs::join::Join;
  use specs::ReadStorage;

  #[test]
  fn manufacture_empty() {
    let mut blueprints = HashMap::new();
    blueprints.insert(BlueprintID::Bee, from_json!({"id": "Bee"}).unwrap());
    let manufacturer = Manufacturer::new(blueprints);
    let mut ecs = World::new();

    manufacturer.manufacture(&mut ecs, BlueprintID::Bee);

    let entities: Vec<Entity> = (&ecs.entities()).join().collect();
    assert_eq!(entities.len(), 1);
  }

  #[test]
  fn manufacture_components() {
    let mut blueprints = HashMap::new();
    blueprints.insert(
      BlueprintID::Bee,
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
    ecs.register::<Position>();
    ecs.register::<Velocity>();

    let entity = manufacturer.manufacture(&mut ecs, BlueprintID::Bee);

    let position = ecs.read_storage::<Position>();
    let position = position.get(entity).unwrap();
    assert_eq!(position.position, XY::new(1, 2));
    let velocity = ecs.read_storage::<Velocity>();
    let velocity: XY16 = velocity.get(entity).unwrap().velocity.clone();
    assert_eq!(velocity, XY::new(3, 4));
  }

  #[test]
  fn manufacture_marker_component() {
    let mut blueprints: HashMap<BlueprintID, Blueprint> = HashMap::new();
    blueprints.insert(
      BlueprintID::Bee,
      serde_json::from_str(
        "{\"id\": \"Bee\", \"components\": {\"follow_mouse\": {}}}",
      )
      .unwrap(),
    );
    let f = blueprints.get(&BlueprintID::Bee).unwrap();
    assert_eq!(f.components.follow_mouse.is_some(), true);

    let manufacturer = Manufacturer::new(blueprints);
    let mut ecs = World::new();
    ecs.register::<FollowMouse>();

    let entity = manufacturer.manufacture(&mut ecs, BlueprintID::Bee);

    let follow_mouse = ecs.read_storage::<FollowMouse>();
    assert_eq!(follow_mouse.get(entity).is_some(), true);
  }

  #[test]
  fn manufacture_children() {
    let mut blueprints = HashMap::new();
    blueprints.insert(
      BlueprintID::SaveDialog,
      from_json!({
        "id": "SaveDialog",
        "components": {"position": {"x": 1, "y": 2}},
        "children": [
          {"id": "Button", "components": {"position": {"x": 3, "y": 4}}},
          {"id": "Button", "components": {"velocity": {"x": 5, "y": 6}}},
          {"id": "Button"}
        ]
      })
      .unwrap(),
    );
    blueprints.insert(
      BlueprintID::Button,
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

    let entity = manufacturer.manufacture(&mut ecs, BlueprintID::SaveDialog);

    let entities: Vec<Entity> = (&ecs.entities()).join().collect();
    assert_eq!(entities.len(), 4);

    ecs.exec(
      |(positions, velocities, parents, children): (
        ReadStorage<Position>,
        ReadStorage<Velocity>,
        ReadStorage<Parent>,
        ReadStorage<Children>,
      )| {
        let save_dialog: Vec<(&Position, &Children)> =
          (&positions, &children).join().collect();
        assert_eq!(save_dialog.len(), 1);
        assert_eq!((save_dialog[0].0).position, XY::new(1, 2));
        assert_eq!((save_dialog[0].1).children.len(), 3);

        let buttons: Vec<(&Position, &Velocity, &Parent)> =
          (&positions, &velocities, &parents).join().collect();
        assert_eq!(buttons.len(), 3);
        assert_eq!(buttons[0].0.position, XY::new(3, 4));
        assert_eq!(buttons[0].1.velocity, XY::new(9, 10));
        assert_eq!(buttons[0].2.parent, entity);
        assert_eq!(buttons[1].0.position, XY::new(7, 8));
        assert_eq!(buttons[1].1.velocity, XY::new(5, 6));
        assert_eq!(buttons[1].2.parent, entity);
        assert_eq!(buttons[2].0.position, XY::new(7, 8));
        assert_eq!(buttons[2].1.velocity, XY::new(9, 10));
        assert_eq!(buttons[2].2.parent, entity);
      },
    );
  }

  #[test]
  fn manufacture_grandparents() {
    let mut blueprints = HashMap::new();
    blueprints.insert(
      BlueprintID::SaveDialog,
      from_json!({
        "id": "SaveDialog",
        "components": {"position": {"x": 1, "y": 2}},
        "children": [
          {"id": "Button", "components": {"position": {"x": 3, "y": 4}}}
        ]
      })
      .unwrap(),
    );
    blueprints.insert(
      BlueprintID::Map,
      from_json!({
        "id": "Map",
        "components": {"velocity": {"y": 6}},
        "children": [
         {"id": "Button", "components": {"position": {"x": 7, "y": 8}}}
        ]
      })
      .unwrap(),
    );
    blueprints
      .insert(BlueprintID::Button, from_json!({"id": "Button"}).unwrap());
    let manufacturer = Manufacturer::new(blueprints);
    let mut ecs = World::new();
    ecs.register::<Parent>();
    ecs.register::<Children>();
    ecs.register::<Position>();
    ecs.register::<Velocity>();
    ecs.register::<FollowMouse>();

    let save_dialog_entity =
      manufacturer.manufacture(&mut ecs, BlueprintID::SaveDialog);
    let map_entity = manufacturer.manufacture(&mut ecs, BlueprintID::Map);

    let entities: Vec<Entity> = (&ecs.entities()).join().collect();
    assert_eq!(entities.len(), 4);

    ecs.exec(
      |(positions, velocities, parents, children): (
        ReadStorage<Position>,
        ReadStorage<Velocity>,
        ReadStorage<Parent>,
        ReadStorage<Children>,
      )| {
        let save_dialog: Vec<(&Position, &Children)> =
          (&positions, &children).join().collect();
        assert_eq!(save_dialog.len(), 1);
        assert_eq!(save_dialog[0].0.position, XY::new(1, 2));
        assert_eq!(save_dialog[0].1.children.len(), 1);

        let map: Vec<(&Velocity, &Children)> =
          (&velocities, &children).join().collect();
        assert_eq!(map.len(), 1);
        assert_eq!(map[0].0.velocity, XY::new(0, 6));
        assert_eq!(map[0].1.children.len(), 1);

        let buttons: Vec<(&Position, &Parent)> =
          (&positions, &parents).join().collect();
        assert_eq!(buttons.len(), 2);
        assert_eq!(buttons[0].0.position, XY::new(3, 4));
        assert_eq!(buttons[0].1.parent, save_dialog_entity);
        assert_eq!(buttons[1].0.position, XY::new(7, 8));
        assert_eq!(buttons[1].1.parent, map_entity);
      },
    );
  }
}
