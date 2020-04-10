use super::{
  AlignToBlueprint, Blueprint, ComponentBlueprints, MarkerBlueprint,
  WH16Blueprint, XYBlueprint,
};
use crate::components::{Children, Parent};
use std::collections::HashMap;
use std::hash::Hash;

pub trait PatchBlueprint<T: Clone> {
  fn patch(&self, patch: &T) -> T;
}

impl PatchBlueprint<Blueprint> for Blueprint {
  /// Create a copy of self, merge any components present in patch, and append
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

impl PatchBlueprint<ComponentBlueprints> for ComponentBlueprints {
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

impl PatchBlueprint<Option<AlignToBlueprint>> for Option<AlignToBlueprint> {
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

impl PatchBlueprint<Option<Children>> for Option<Children> {
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

impl<K: Clone + Eq + Hash, V: Clone> PatchBlueprint<HashMap<K, Vec<V>>>
  for HashMap<K, Vec<V>>
{
  fn patch(&self, patch: &Self) -> Self {
    let mut patched = self.clone();
    patched.extend(patch.clone());
    patched
  }
}

impl PatchBlueprint<Option<MarkerBlueprint>> for Option<MarkerBlueprint> {
  fn patch(&self, patch: &Self) -> Self {
    match patch {
      None => self.clone(),
      _ => patch.clone(),
    }
  }
}

impl PatchBlueprint<Option<WH16Blueprint>> for Option<WH16Blueprint> {
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

impl PatchBlueprint<Option<Parent>> for Option<Parent> {
  fn patch(&self, patch: &Self) -> Self {
    match patch {
      None => self.clone(),
      _ => patch.clone(),
    }
  }
}

impl PatchBlueprint<Option<String>> for Option<String> {
  fn patch(&self, patch: &Self) -> Self {
    match patch {
      None => self.clone(),
      _ => patch.clone(),
    }
  }
}

impl<T: Clone> PatchBlueprint<Vec<T>> for Vec<T> {
  fn patch(&self, patch: &Self) -> Self {
    let mut patched = self.clone();
    patched.extend(patch.clone());
    patched
  }
}

impl<T: Clone> PatchBlueprint<Option<XYBlueprint<T>>>
  for Option<XYBlueprint<T>>
{
  fn patch(&self, patch: &Self) -> Self {
    match (self, patch) {
      (_, None) => self.clone(),
      (None, _) => patch.clone(),
      (Some(base), Some(patch)) => Some(XYBlueprint {
        x: patch.x.clone().or(base.x.clone()),
        y: patch.y.clone().or(base.y.clone()),
      }),
    }
  }
}
