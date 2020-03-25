use super::ID;
use crate::components::{
  AlignTo, Cam, Children, FollowMouse, MaxWH, Parent, Position, Text, Velocity,
};
use specs::Entity;

/// Blueprints define the Entity and its Components to be injected into the
/// World. They're unprocessed though. This means that the root Blueprint
/// definition and any children have to be manufactured (patched and injected
/// into the World).
#[serde(deny_unknown_fields)]
#[derive(Clone, Deserialize, Serialize)]
pub struct Blueprint {
  /// Either the identity of the definition Blueprint (root, non-child) or the
  /// identity of the definition Blueprint to look up as a baseline to patch.
  pub id: ID,
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
  #[serde(default)]
  pub components: ComponentMap,
  /// These are kind of "Blueprint specifications" or "Blueprint properties."
  /// They're true Blueprints just like the root but they're manufactured by
  /// using their ID to obtain the root Blueprint as a baseline and then the
  /// specs or props. It's invalid to reference a parent ID as that would create
  /// a cycle. The child ID always refers to a Manufacturer cached ID, not a new
  /// definition. Because it's not a definition, it's not possible to reference
  /// a child Blueprint by ID.
  #[serde(default)]
  pub children: Vec<Blueprint>,
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Default, Deserialize, Serialize)]
pub struct ComponentMap {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub align_to: Option<AlignTo>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub cam: Option<Cam>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub follow_mouse: Option<FollowMouse>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub position: Option<Position>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub velocity: Option<Velocity>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub text: Option<Text>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub max_wh: Option<MaxWH>,

  /// These linkages are established at during manufacturing.
  // todo: explore Saveload macro and trait. https://docs.rs/specs/0.16.1/specs/derive.ConvertSaveload.html
  #[serde(skip)]
  pub parent: Option<Parent>,
  #[serde(skip)]
  pub children: Option<Children>,
}

impl Blueprint {
  /// Create a copy of self, replace any components present in patch, and append
  /// any children in patch. Blueprint children themselves are not patched as
  /// its the Manufacturer's responsibility.
  pub fn patch(&self, patch: &Blueprint) -> Blueprint {
    let mut children = self.children.clone();
    children.extend(patch.children.clone());
    Self {
      id: patch.id,
      components: self.components.patch(&patch.components),
      children,
    }
  }
}

impl ComponentMap {
  /// Create a copy of self and replace any components present in patch.
  pub fn patch(&self, patch: &ComponentMap) -> ComponentMap {
    macro_rules! patch_component {
      ($component:ident) => {
        if patch.$component.is_some() {
          &patch.$component
        } else {
          &self.$component
        }
        .clone()
      };
    }
    Self {
      align_to: patch_component!(align_to),
      cam: patch_component!(cam),
      follow_mouse: patch_component!(follow_mouse),
      position: patch_component!(position),
      velocity: patch_component!(velocity),
      text: patch_component!(text),
      max_wh: patch_component!(max_wh),
      parent: patch_component!(parent),
      children: patch_component!(children),
    }
  }
}
