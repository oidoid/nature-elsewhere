use std::cmp::Eq;
use std::collections::HashSet;
use std::hash::Hash;
use std::iter::FromIterator;

pub fn to_set<T: Eq + Hash + Clone>(array: &[T]) -> HashSet<T> {
  HashSet::from_iter(array.iter().cloned())
}
