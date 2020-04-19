//! Blueprints define the Entity and its Components to be injected into the
//! World. They're unprocessed though. This means that the root Blueprint
//! definition and any children have to be processed (patched and injected into
//! the World) every time. This might be possible to change if the Manufacturers
//! can clone an EntityBuilder.
//!
//! Manufacturing is the process of assembling Components and populating the
//! world with them. Blueprint JSON files give some perspective of all the
//! Components that make up (are associated with) a given Entity but it's
//! incomplete:
//!
//! - Blueprint JSON files are used to create Rust blueprint user types.
//!
//! - Serde deserializes all Options as None and collections as empty. This
//!   allows for blueprints and components to be deeply patched.
//!
//! - The Manufacturer replaces Nones with default values at assembly time.
//!
//! - Children use default values by serde _and_ their definition Blueprint.
//!
//! - The output of manufacturing is injected into the world as an Entity and
//!   its components. At this point, it's difficult to conceptualize all
//!   Components that compose an Entity without querying by ID.
//!
//! This means that everything that truly makes up an Entity can be difficult to
//! grasp (conceptualize). However, the Blueprint JSON files are usually enough
//! and debugging involves inspecting the JSON files, intermediate
//! representations as a blueprint, default values and assembly in the
//! Manufacturer. It's a little loose but practical.
//!
//! `Option`s are used so that patching knows when a value is set or should fall
//! should fallthrough to the base. Defaults are only used for collection types
//! that merge by aggregation (the consequence is that it's impossible to remove
//! the base value with an empty override but is similarly impossibly with a
//! nonempty override to remove base values). Serialization should test against
//! default values in the Manufacturer.

use super::BlueprintID;
use crate::atlas::{AnimationID, AnimatorPeriod};
use crate::components::{Alignment, Children, Parent};
use crate::math::Millis;
use crate::sprites::{SpriteComposition, SpriteLayer};
use serde::{Deserialize, Serialize};
use specs::Entity;
use std::collections::HashMap;
use std::num::NonZeroI16;

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

#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct AnimatorBlueprint {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub period: Option<AnimatorPeriod>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub exposure: Option<Millis>,
}

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

#[serde(deny_unknown_fields)]
#[derive(Clone, Default, Deserialize, Serialize)]
pub struct ComponentBlueprints {
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

// Markers are used for unit de/serialization too since those don't work for
// roundtrips when wrapped in an Option.
// https://github.com/serde-rs/serde/issues/1690#issuecomment-604807038
#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct MarkerBlueprint {}

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

/// This Blueprint is special. It's prevalent and so provides shorthands for
/// most properties, even composed objects. Precedence is given to the highest
/// level object(s) defined (i.e., the greatest composition). E.g., consider:
///
/// {
///   ...,
///   "bounds": {"x": 1}
///   "position": {"x": 2, "y": 3},
///   "x": 4,
///   "y": 5,
///   "h": 6
///   ...
/// }
///
/// The above deserializes to an `R16` with an `x` of 1 and default `y`, `w`,
/// and `h` values. If `bounds` had been omitted the result would be an `x` of
/// 2, `y` of 1, `w` of default value, and `h` of 6.
///
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
  pub scale: Option<XYBlueprint<NonZeroI16>>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub sx: Option<NonZeroI16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub sy: Option<NonZeroI16>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub wrap: Option<XY16Blueprint>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub wx: Option<i16>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub wy: Option<i16>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub wrap_velocity: Option<XY16Blueprint>,
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
pub struct XYBlueprint<T> {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub x: Option<T>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub y: Option<T>,
}
pub type XY16Blueprint = XYBlueprint<i16>;

#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct WHBlueprint<T> {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub w: Option<T>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub h: Option<T>,
}
pub type WH16Blueprint = WHBlueprint<i16>;
