use super::BlueprintID;
use crate::atlas::{AnimationID, AnimatorPeriod};
use crate::components::{Alignment, Children, Parent};
use crate::math::Millis;
use crate::sprites::{SpriteComposition, SpriteLayer};
use serde::{Deserialize, Serialize};
use specs::Entity;
use std::collections::HashMap;
use std::hash::Hash;

/// Blueprints define the Entity and its Components to be injected into the
/// World. They're unprocessed though. This means that the root Blueprint
/// definition and any children have to be processed (patched and injected into
/// the World) every time.
///
/// Manufacturing is the process of assembling Components and populating the
/// world with them. Blueprint JSON files give some perspective of all the
/// Components that make up (are associated with) a given Entity but it's
/// incomplete:
///
/// - ComponentBlueprints use default values by serde and often have an
///   intermediate representation for deserialization.
///
/// - Children use default values by serde _and_ their definition Blueprint.
///
/// This means that everything that truly makes up an Entity can be difficult to
/// grasp (conceptualize). However, the Blueprint JSON files are usually enough
/// and debugging involves inspecting the JSON files, intermediate
/// representations in ComponentBlueprints, default values in serde, and
/// assembly in the Manufacturer. It's a little loose but practical.
/// defaults aren't used since htey harm the patching beahvior. options everywhere
#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct Blueprint {
  /// Either the identity of the definition Blueprint (root, non-child) or the
  /// identity of the definition Blueprint to look up as a baseline to patch.
  pub id: BlueprintID,
  /// A vector is all that would be needed if each component had distinct fields
  /// but that doesn't work well for marker or tuple structs. A map from
  /// component name to component props would then be used but then the
  /// components must be within an enum wrapper and that requires [tagging].
  /// The flatten attribute doesn't seem to help. A map also prohibits duplicate
  /// component types. A pseudo-map object is used instead, ComponentMap. Since
  /// there are not many Blueprints, it is probably fine that ComponentMap may
  /// have many empty properties.
  ///
  /// All parents with nonempty children are given Children components. All
  /// children are given Parent components. These relations hold Entitys. The
  /// linkage is a _m_-ary tree.
  ///
  /// [tagging]: https://serde.rs/enum-representations.html#externally-tagged
  #[serde(default, skip_serializing_if = "ComponentBlueprints::is_empty")]
  pub components: ComponentBlueprints,
  /// These are kind of "Blueprint specifications" or "Blueprint properties."
  /// They're true Blueprints just like the root but they're manufactured by
  /// using their ID to obtain the root Blueprint as a baseline and then the
  /// specs or props. It's invalid to reference a parent ID as that would create
  /// a cycle. The child ID always refers to a Manufacturer cached ID, not a new
  /// definition. Because it's not a definition, it's not possible to reference
  /// a child Blueprint by ID.
  #[serde(default, skip_serializing_if = "Vec::is_empty")]
  pub children: Vec<Blueprint>,
}

pub trait Patch<T: Clone> {
  fn patch(&self, patch: &T) -> T;
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Default, Deserialize, Serialize)]
pub struct ComponentBlueprints {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub align_to: Option<AlignToBlueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub cam: Option<WH16Blueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub follow_mouse: Option<MarkerBlueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub position: Option<XY16Blueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub velocity: Option<XY16Blueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub text: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub max_wh: Option<WH16Blueprint>,
  #[serde(default, skip_serializing_if = "HashMap::is_empty")]
  pub sprites: HashMap<String, Vec<SpriteBlueprint>>,

  /// These linkages are established during manufacturing only.
  #[serde(skip)]
  pub parent: Option<Parent>,
  #[serde(skip)]
  pub children: Option<Children>,
}

impl ComponentBlueprints {
  pub fn is_empty(blueprints: &ComponentBlueprints) -> bool {
    blueprints.align_to.is_none()
      && blueprints.cam.is_none()
      && blueprints.follow_mouse.is_none()
      && blueprints.position.is_none()
      && blueprints.velocity.is_none()
      && blueprints.text.is_none()
      && blueprints.max_wh.is_none()
      && blueprints.sprites.is_empty()
  }
}

impl Patch<Blueprint> for Blueprint {
  /// Create a copy of self, replace any components present in patch, and append
  /// any children in patch. Blueprint children themselves are not patched as
  /// its the Manufacturer's responsibility.
  fn patch(&self, patch: &Blueprint) -> Blueprint {
    Self {
      id: patch.id,
      components: self.components.patch(&patch.components),
      children: self.children.patch(&patch.children),
    }
  }
}

impl Patch<ComponentBlueprints> for ComponentBlueprints {
  fn patch(&self, patch: &Self) -> Self {
    Self {
      align_to: self.align_to.patch(&patch.align_to),
      cam: self.cam.patch(&patch.cam),
      follow_mouse: self.follow_mouse.patch(&patch.follow_mouse),
      position: self.position.patch(&patch.position),
      velocity: self.velocity.patch(&patch.velocity),
      text: self.text.patch(&patch.text),
      max_wh: self.max_wh.patch(&patch.max_wh),
      parent: self.parent.patch(&patch.parent),
      children: self.children.patch(&patch.children),
      sprites: self.sprites.patch(&patch.sprites),
    }
  }
}

// Marker is used for unit de/serialization too since those don't work for roundtrips when wrapped in option https://github.com/serde-rs/serde/issues/1690#issuecomment-604807038
#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct MarkerBlueprint {}

impl Patch<Option<MarkerBlueprint>> for Option<MarkerBlueprint> {
  fn patch(&self, patch: &Self) -> Self {
    match patch {
      None => self.clone(),
      _ => patch.clone(),
    }
  }
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct AlignToBlueprint {
  pub alignment: Alignment,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub margin: Option<XY16Blueprint>,
  // todo: how does the Manufacturer link this? It describes some Relationship,
  // so maybe a Relationship enum Component? Or maybe it's dynamic and set by
  // some kind of Behavior, like a "FindNearestEntityInitialization" behavior?
  #[serde(skip)]
  pub to: Option<Entity>,
}

impl Patch<Option<AlignToBlueprint>> for Option<AlignToBlueprint> {
  fn patch(&self, patch: &Self) -> Self {
    match (self, patch) {
      (_, None) => self.clone(),
      (None, _) => patch.clone(),
      (Some(base), Some(patch)) => Some(AlignToBlueprint {
        alignment: patch.alignment,
        margin: base.margin.patch(&patch.margin),
        to: base.to.or(patch.to),
      }),
    }
  }
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct WH16Blueprint {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub w: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub h: Option<i16>,
}

impl Patch<Option<WH16Blueprint>> for Option<WH16Blueprint> {
  fn patch(&self, patch: &Self) -> Self {
    match (self, patch) {
      (_, None) => self.clone(),
      (None, _) => patch.clone(),
      (Some(base), Some(patch)) => {
        Some(WH16Blueprint { w: patch.w.or(base.w), h: patch.h.or(base.h) })
      }
    }
  }
}

impl Patch<Option<Children>> for Option<Children> {
  fn patch(&self, patch: &Self) -> Self {
    match (self, patch) {
      (_, None) => self.clone(),
      (None, _) => patch.clone(),
      (Some(base), Some(patch)) => {
        Some(Children { children: base.children.patch(&patch.children) })
      }
    }
  }
}

impl Patch<Option<Parent>> for Option<Parent> {
  fn patch(&self, patch: &Self) -> Self {
    match patch {
      None => self.clone(),
      _ => patch.clone(),
    }
  }
}

// Serialization is going to have to test against default values. I have to use optionals here too in order for patching to work correctly.
#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct XY16Blueprint {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub x: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub y: Option<i16>,
}

impl Patch<Option<XY16Blueprint>> for Option<XY16Blueprint> {
  fn patch(&self, patch: &Self) -> Self {
    match (self, patch) {
      (_, None) => self.clone(),
      (None, _) => patch.clone(),
      (Some(base), Some(patch)) => {
        Some(XY16Blueprint { x: patch.x.or(base.x), y: patch.y.or(base.y) })
      }
    }
  }
}

impl Patch<Option<String>> for Option<String> {
  fn patch(&self, patch: &Self) -> Self {
    match patch {
      None => self.clone(),
      _ => patch.clone(),
    }
  }
}

impl<K: Clone + Eq + Hash, V: Clone> Patch<HashMap<K, Vec<V>>>
  for HashMap<K, Vec<V>>
{
  fn patch(&self, patch: &Self) -> Self {
    let mut meld: HashMap<K, Vec<V>> = self.clone();
    meld.extend(patch.into_iter().map(|(key, val)| (key.clone(), val.clone())));
    meld
  }
}

impl<T: Clone> Patch<Vec<T>> for Vec<T> {
  fn patch(&self, patch: &Self) -> Self {
    let mut meld = self.clone();
    meld.extend(patch.clone());
    meld
  }
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct R16Blueprint {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub x: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub y: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub w: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub h: Option<i16>,
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct SpriteBlueprint {
  pub id: AnimationID,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub constituent_id: Option<AnimationID>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub composition: Option<SpriteComposition>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub bounds: Option<R16Blueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub position: Option<XY16Blueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub x: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub y: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub area: Option<WH16Blueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub w: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub h: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub layer: Option<SpriteLayer>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub scale: Option<XY16Blueprint>, // watch out for zero scale
  #[serde(skip_serializing_if = "Option::is_none")]
  pub sx: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub sy: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub wrap: Option<XY16Blueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub wx: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub wy: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub wrap_velocity: Option<XY16Blueprint>, // Decamillipixel
  #[serde(skip_serializing_if = "Option::is_none")]
  pub wvx: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub wvy: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub animator: Option<AnimatorBlueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub period: Option<AnimatorPeriod>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub exposure: Option<Millis>,
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct AnimatorBlueprint {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub period: Option<AnimatorPeriod>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub exposure: Option<Millis>,
}
