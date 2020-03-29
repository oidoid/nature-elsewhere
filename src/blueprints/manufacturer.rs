use super::Blueprint;
use super::BlueprintID;
use crate::components::{Children, Parent};
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
      patched.components.parent = Some(Parent::new(entity.clone()));
      let child = self.manufacture_blueprint(ecs, &patched);
      // todo: establish relationship components (anything with Entity ID target or parent / child relationship)
      // enum Relation {
      //   Parent,
      //   Child,
      //   TargetPlayer(Player),
      //   Camera
      // }
      // there are cases where non-i16 xy are useful.
      children.push(child);
    }

    if children.len() > 0 {
      ecs
        .write_storage::<Children>()
        .insert(entity, Children::new(children))
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
          "position": {"xy":{"x": 1, "y": 2}},
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
    assert_eq!(position.xy, XY::new(1, 2));
    let velocity = ecs.read_storage::<Velocity>();
    let velocity: XY16 = velocity.get(entity).unwrap().into();
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
        "components": {"position": {"xy": {"x": 1, "y": 2}}},
        "children": [
          {"id": "Button", "components": {"position": {"xy": {"x": 3, "y": 4}}}},
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
          "position": {"xy":{"x": 7, "y": 8}},
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
        assert_eq!((save_dialog[0].0).xy, XY::new(1, 2));
        assert_eq!((save_dialog[0].1).children.len(), 3);

        let buttons: Vec<(&Position, &Velocity, &Parent)> =
          (&positions, &velocities, &parents).join().collect();
        assert_eq!(buttons.len(), 3);
        assert_eq!((buttons[0].0).xy, XY::new(3, 4));
        assert_eq!((buttons[0].1).x, 9);
        assert_eq!((buttons[0].1).y, 10);
        assert_eq!((buttons[0].2).parent, entity);
        assert_eq!((buttons[1].0).xy, XY::new(7, 8));
        assert_eq!((buttons[1].1).x, 5);
        assert_eq!((buttons[1].1).y, 6);
        assert_eq!((buttons[1].2).parent, entity);
        assert_eq!((buttons[2].0).xy, XY::new(7, 8));
        assert_eq!((buttons[2].1).x, 9);
        assert_eq!((buttons[2].1).y, 10);
        assert_eq!((buttons[2].2).parent, entity);
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
        "components": {"position": {"xy": {"x": 1, "y": 2}}},
        "children": [
          {"id": "Button", "components": {"position": {"xy": {"x": 3, "y": 4}}}}
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
          {"id": "Button", "components": {"position": {"xy": {"x": 7, "y": 8}}}}
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
        assert_eq!((save_dialog[0].0).xy, XY::new(1, 2));
        assert_eq!((save_dialog[0].1).children.len(), 1);

        let map: Vec<(&Velocity, &Children)> =
          (&velocities, &children).join().collect();
        assert_eq!(map.len(), 1);
        assert_eq!((map[0].0).x, 0);
        assert_eq!((map[0].0).y, 6);
        assert_eq!((map[0].1).children.len(), 1);

        let buttons: Vec<(&Position, &Parent)> =
          (&positions, &parents).join().collect();
        assert_eq!(buttons.len(), 2);
        assert_eq!((buttons[0].0).xy, XY::new(3, 4));
        assert_eq!((buttons[0].1).parent, save_dialog_entity);
        assert_eq!((buttons[1].0).xy, XY::new(7, 8));
        assert_eq!((buttons[1].1).parent, map_entity);
      },
    );
  }
}
