use super::xy::XY;
use num::traits::{
  cast::{NumCast, ToPrimitive},
  Zero,
};
use serde::Serialize;
use std::{
  any::Any,
  convert::TryInto,
  fmt,
  ops::{Add, AddAssign, Div, Mul, Sub},
};

/// Axis-aligned rectangle. Rectangles are considered front-facing when both
/// components of `from` are less-than or equal to `to` and back-facing
/// (flipped) otherwise. Back-facing rectangles are useful for distinguishing
/// certain states such as the intersection of disjoint rectangles. Rect itself
/// makes no distinction between back- and front-facing rectangles except for
/// `Rect.flipped()`. A back-facing rectangle can be recomputed to a
/// front-facing rectangle by calling order().
#[derive(Clone, Eq, PartialEq, Serialize)]
pub struct Rect<T> {
  pub from: XY<T>,
  pub to: XY<T>,
}
pub type R16 = Rect<i16>;
pub type R32 = Rect<i32>;

impl<T> Rect<T> {
  pub fn new(fx: T, fy: T, tx: T, ty: T) -> Self {
    Self { from: XY::new(fx, fy), to: XY::new(tx, ty) }
  }

  pub fn new_wh(fx: T, fy: T, w: T, h: T) -> Self
  where
    T: Add<Output = T> + Clone,
  {
    Self { from: XY::new(fx.clone(), fy.clone()), to: XY::new(fx + w, fy + h) }
  }

  /// Cast each component passed and returns a new Rect.
  pub fn cast_from<From>(fx: From, fy: From, tx: From, ty: From) -> Option<Self>
  where
    T: NumCast,
    From: ToPrimitive + Clone,
  {
    Some(Self { from: XY::cast_from(fx, fy)?, to: XY::cast_from(tx, ty)? })
  }

  pub fn cast_from_wh<From, To>(
    fx: From,
    fy: From,
    w: To,
    h: To,
  ) -> Option<Self>
  where
    T: Add<Output = T> + NumCast + Clone,
    From: ToPrimitive + Clone,
    To: ToPrimitive + Clone,
  {
    let from = XY::cast_from(fx, fy)?;
    Some(Self { to: from.clone() + XY::cast_from(w, h)?, from })
  }

  /// Cast each component of self and returns a new Rect.
  pub fn cast_into<Into>(self) -> Option<Rect<Into>>
  where
    T: ToPrimitive + Clone,
    Into: NumCast,
  {
    Some(Rect { from: self.from.cast_into()?, to: self.to.cast_into()? })
  }

  pub fn move_to(&self, to: &XY<T>) -> Self
  where
    T: Clone + Add<Output = T> + Sub<Output = T>,
  {
    let by = to.clone() - self.from.clone();
    self.clone() + by
  }

  /// Components may be negative.
  pub fn size(&self) -> XY<T>
  where
    T: Sub<Output = T> + Ord + Clone,
  {
    self.to.clone() - self.from.clone()
  }

  /// May be negative.
  pub fn area(&self) -> T
  where
    T: Sub<Output = T> + Mul<Output = T> + Ord + Clone,
  {
    self.size().area()
  }

  pub fn is_empty(&self) -> bool
  where
    T: Sub<Output = T> + Mul<Output = T> + Zero + Ord + Clone,
  {
    let size = self.size();
    size.x.is_zero() || size.y.is_zero()
  }

  /// Returns true if Rect is back-facing (from < to), false if front-facing.
  pub fn flipped(&self) -> bool
  where
    T: PartialOrd,
  {
    self.to.x < self.from.x || self.to.y < self.from.y
  }

  pub fn min(&self) -> XY<T>
  where
    T: Ord + Clone,
  {
    self.from.min(&self.to)
  }

  pub fn max(&self) -> XY<T>
  where
    T: Ord + Clone,
  {
    self.from.max(&self.to)
  }

  /// Returns a new front-facing Rect range with coordinates reordered such that
  /// from <= to.
  pub fn order(&self) -> Self
  where
    T: Ord + Clone,
  {
    Self { from: self.min(), to: self.max() }
  }

  /// Return true if self and rhs are overlapping, false if touching or
  /// independent.
  pub fn intersects(&self, rhs: &Self) -> bool
  where
    T: Ord + Clone,
  {
    // [todo] don't attempt to reorder self?
    let lhs = self.order();
    let rhs = rhs.order();
    lhs.from.x < rhs.to.x
      && lhs.to.x > rhs.from.x
      && lhs.from.y < rhs.to.y
      && lhs.to.y > rhs.from.y
  }

  /// from > to if no intersection, from == to if touching but not overlapping,
  /// or from < to if overlapping.
  pub fn intersection(&self, rhs: &Self) -> Self
  where
    T: Ord + Clone,
  {
    // what about empties?
    let lhs = self.order();
    let rhs = rhs.order();
    Self { from: lhs.from.max(&rhs.from), to: lhs.to.min(&rhs.to) }
  }

  pub fn union(&self, rhs: &Self) -> Self
  where
    T: Ord + Clone,
  {
    // what about empties?
    let lhs = self.order();
    let rhs = rhs.order();
    Self { from: lhs.from.min(&rhs.from), to: lhs.to.max(&rhs.to) }
  }

  pub fn try_intersection(&self, rhs: &Self) -> Result<Self, Self>
  where
    T: Sub<Output = T> + Mul<Output = T> + Ord + Zero + Clone,
  {
    let intersection = self.intersection(rhs);
    if intersection.flipped() || intersection.is_empty() {
      return Err(intersection);
    }
    Ok(intersection)
  }

  pub fn union_all(rects: &[Self]) -> Option<Self>
  where
    T: Sub<Output = T> + Mul<Output = T> + Ord + Zero + Clone,
  {
    if rects.is_empty() {
      return None;
    }
    let union =
      rects.iter().fold(rects[0].clone(), |sum, rect| sum.union(rect));
    if union.is_empty() {
      return None;
    }
    Some(union)
  }

  pub fn center(&self) -> XY<T>
  where
    T: Add<Output = T> + Sub<Output = T> + Div<Output = T> + NumCast + Clone,
  {
    self.from.clone()
      + (self.to.clone() - self.from.clone())
        / T::from(2)
          .expect(&format!("Conversion from i32 to {} failed.", stringify!(T)))
  }
}

macro_rules! impl_magnitude {
  ($($t:ty),+) => ($(
    impl Rect<$t> {
      pub fn magnitude(&self) -> $t {
        (self.from.clone() - self.to.clone()).magnitude()
      }
    }
  )+)
}
impl_magnitude!(u8, i8, u16, i16, u32, i32, f32, u64, i64, f64, usize, isize);

impl<T: fmt::Debug> fmt::Debug for Rect<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "[{:?}, {:?}]", self.from, self.to)
  }
}

impl<T: fmt::Display> fmt::Display for Rect<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "[{}, {}]", self.from, self.to)
  }
}

impl<T: Add<Output = T>> Add<Rect<T>> for Rect<T> {
  type Output = Self;
  fn add(self, rhs: Self) -> Self {
    Self { from: self.from + rhs.from, to: self.to + rhs.to }
  }
}

impl<T: Add<Output = T> + Clone> Add<XY<T>> for Rect<T> {
  type Output = Self;
  fn add(self, rhs: XY<T>) -> Self {
    Self { from: self.from + rhs.clone(), to: self.to + rhs }
  }
}

impl<T: AddAssign + Clone> AddAssign<&XY<T>> for Rect<T> {
  fn add_assign(&mut self, rhs: &XY<T>) {
    self.from += rhs.clone();
    self.to += rhs.clone();
  }
}

impl<T: Sub<Output = T>> Sub<Rect<T>> for Rect<T> {
  type Output = Self;
  fn sub(self, rhs: Self) -> Self {
    Self { from: self.from - rhs.from, to: self.to - rhs.to }
  }
}

impl<T: Sub<Output = T> + Clone> Sub<XY<T>> for Rect<T> {
  type Output = Self;
  fn sub(self, rhs: XY<T>) -> Self {
    Self { from: self.from - rhs.clone(), to: self.to - rhs }
  }
}

impl<T: Mul<Output = T>> Mul<Rect<T>> for Rect<T> {
  type Output = Self;
  fn mul(self, rhs: Self) -> Self {
    Self { from: self.from * rhs.from, to: self.to * rhs.to }
  }
}

impl<T: Mul<Output = T> + Clone> Mul<XY<T>> for Rect<T> {
  type Output = Self;
  fn mul(self, rhs: XY<T>) -> Self {
    Self { from: self.from * rhs.clone(), to: self.to * rhs }
  }
}

impl<T: Div<Output = T>> Div<Rect<T>> for Rect<T> {
  type Output = Self;
  fn div(self, rhs: Self) -> Self {
    Self { from: self.from / rhs.from, to: self.to / rhs.to }
  }
}

impl<T: Div<Output = T> + Clone> Div<XY<T>> for Rect<T> {
  type Output = Self;

  fn div(self, rhs: XY<T>) -> Self {
    Self { from: self.from / rhs.clone(), to: self.to / rhs }
  }
}

pub trait Contains<T> {
  fn contains(&self, rhs: &T) -> bool;
}

impl<T: Sub<Output = T> + Mul<Output = T> + Ord + Zero + Clone>
  Contains<Rect<T>> for Rect<T>
{
  /// Return true if rhs fits within possibly touching but not overlapping.
  fn contains(&self, rhs: &Self) -> bool {
    if self.is_empty() {
      return false;
    }
    let lhs = self.order();
    let rhs = rhs.order();
    lhs.from.x <= rhs.from.x
      && lhs.to.x >= rhs.to.x
      && lhs.from.y <= rhs.from.y
      && lhs.to.y >= rhs.to.y
  }
}

impl<T> Contains<XY<T>> for Rect<T>
where
  T: Ord + Clone,
{
  fn contains(&self, XY { x, y }: &XY<T>) -> bool {
    let lhs = self.order();
    x.clone() < lhs.to.x
      && *x > lhs.from.x
      && y.clone() < lhs.to.y
      && *y > lhs.from.y
  }
}

pub trait CenterOn<T> {
  /// Return true if self and rhs are overlapping, false if touching or
  /// independent.
  fn center_on(&self, on: &T) -> Self;
}

impl<
    T: Add<Output = T> + Sub<Output = T> + Div<Output = T> + NumCast + Clone,
  > CenterOn<Rect<T>> for Rect<T>
{
  fn center_on(&self, on: &Self) -> Rect<T> {
    self.center_on(&on.center())
  }
}

impl<
    T: Add<Output = T> + Sub<Output = T> + Div<Output = T> + NumCast + Clone,
  > CenterOn<XY<T>> for Rect<T>
{
  fn center_on(&self, on: &XY<T>) -> Rect<T> {
    let mv = on.clone() - self.center();
    Self { from: self.from.clone() + mv.clone(), to: self.to.clone() + mv }
  }
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn new() {
    assert_eq!(
      Rect::new(1, 2, 3, 4),
      R16 { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }
    )
  }

  #[test]
  fn new_wh() {
    assert_eq!(
      Rect::new_wh(1, 2, 3, 4),
      R16 { from: XY { x: 1, y: 2 }, to: XY { x: 4, y: 6 } }
    )
  }

  #[test]
  fn cast_from() {
    assert_eq!(
      Rect::cast_from(1.2, 3.4, 5.6, 7.8).unwrap(),
      R16 { from: XY { x: 1, y: 3 }, to: XY { x: 5, y: 7 } }
    )
  }

  #[test]
  fn cast_into() {
    assert_eq!(
      Rect::<f64> { from: XY { x: 1.2, y: 3.4 }, to: XY { x: 5.6, y: 7.8 } }
        .cast_into()
        .unwrap(),
      R16 { from: XY { x: 1, y: 3 }, to: XY { x: 5, y: 7 } }
    )
  }

  #[test]
  fn add_rect() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }
        + Rect { from: XY { x: 5, y: 6 }, to: XY { x: 7, y: 8 } },
      Rect { from: XY { x: 6, y: 8 }, to: XY { x: 10, y: 12 } }
    )
  }

  #[test]
  fn add_xy() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }
        + XY { x: 5, y: 6 },
      Rect { from: XY { x: 6, y: 8 }, to: XY { x: 8, y: 10 } }
    )
  }

  #[test]
  fn sub_rect() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }
        - Rect { from: XY { x: 5, y: 6 }, to: XY { x: 7, y: 8 } },
      Rect { from: XY { x: -4, y: -4 }, to: XY { x: -4, y: -4 } }
    )
  }

  #[test]
  fn sub_xy() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }
        - XY { x: 5, y: 6 },
      Rect { from: XY { x: -4, y: -4 }, to: XY { x: -2, y: -2 } }
    )
  }

  #[test]
  fn mul_rect() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }
        * Rect { from: XY { x: 5, y: 6 }, to: XY { x: 7, y: 8 } },
      Rect { from: XY { x: 5, y: 12 }, to: XY { x: 21, y: 32 } }
    )
  }

  #[test]
  fn mul_xy() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }
        * XY { x: 5, y: 6 },
      Rect { from: XY { x: 5, y: 12 }, to: XY { x: 15, y: 24 } }
    )
  }

  #[test]
  fn div_rect() {
    assert_eq!(
      Rect { from: XY { x: 5, y: 6 }, to: XY { x: 7, y: 8 } }
        / Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } },
      Rect { from: XY { x: 5, y: 3 }, to: XY { x: 2, y: 2 } }
    )
  }

  #[test]
  fn div_xy() {
    assert_eq!(
      Rect { from: XY { x: 6, y: 5 }, to: XY { x: 4, y: 3 } }
        / XY { x: 2, y: 1 },
      Rect { from: XY { x: 3, y: 5 }, to: XY { x: 2, y: 3 } }
    )
  }

  #[test]
  fn wh() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }.size(),
      XY { x: 2, y: 2 }
    )
  }

  #[test]
  fn area() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 2 }, to: XY { x: 3, y: 4 } }.area(),
      4
    )
  }

  #[test]
  fn empty_zero() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 1 }, to: XY { x: 5, y: 1 } }.is_empty(),
      true
    )
  }

  #[test]
  fn empty_nonzero() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 1 }, to: XY { x: 5, y: 5 } }.is_empty(),
      false
    )
  }

  #[test]
  fn magnitude() {
    assert_eq!(
      R16 { from: XY { x: 1, y: 2 }, to: XY { x: 4, y: 6 } }.magnitude(),
      5
    )
  }

  #[test]
  fn min() {
    assert_eq!(
      Rect { from: XY { x: 4, y: 1 }, to: XY { x: 2, y: 3 } }.min(),
      XY { x: 2, y: 1 }
    )
  }

  #[test]
  fn max() {
    assert_eq!(
      Rect { from: XY { x: 4, y: 1 }, to: XY { x: 2, y: 3 } }.max(),
      XY { x: 4, y: 3 }
    )
  }

  #[test]
  fn order() {
    assert_eq!(
      Rect { from: XY { x: 4, y: 1 }, to: XY { x: 2, y: 3 } }.order(),
      Rect { from: XY { x: 2, y: 1 }, to: XY { x: 4, y: 3 } }
    )
  }

  #[test]
  fn contains_xy_external() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 1 }, to: XY { x: 4, y: 4 } }
        .contains(&XY { x: 5, y: 5 }),
      false
    )
  }

  #[test]
  fn contains_xy_internal() {
    assert_eq!(
      Rect { from: XY { x: 1, y: 1 }, to: XY { x: 4, y: 4 } }
        .contains(&XY { x: 2, y: 2 }),
      true
    )
  }

  // (diagram, lhs, rhs, intersects, contains, intersection, union)
  const CASES: &[(&str, R16, R16, bool, bool, R16, R16)] = &[
    (
      "
        0   │    Overlapping Square
          ┌─╆━┱─┐
        ──┼─╂L╂R┼
          └─╄━┹─┘
            │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 0, y: -1 }, to: XY { x: 2, y: 1 } },
      true,
      false,
      Rect { from: XY { x: 0, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 2, y: 1 } },
    ),
    (
      "
        1   ├───┐Overlapping Square
          ┌─╆━┓R│
        ──┼─╄L╃─┴
          └─┼─┘
            │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 0, y: -2 }, to: XY { x: 2, y: 0 } },
      true,
      false,
      Rect { from: XY { x: 0, y: -1 }, to: XY { x: 1, y: 0 } },
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 2, y: 1 } },
    ),
    (
      "
        2 ┌─R─┐  Overlapping Square
          ┢━┿━┪
        ──┡━┿L┩──
          └─┼─┘
            │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 1, y: 0 } },
      true,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 0 } },
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        3───┤    Overlapping Square
        │R┏━╅─┐
        ┴─╄━╃L┼──
          └─┼─┘
            │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -2, y: -2 }, to: XY { x: 0, y: 0 } },
      true,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 0, y: 0 } },
      Rect { from: XY { x: -2, y: -2 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        4   │    Overlapping Square
        ┌─┲━╅─┐
        ┼R╂─╂L┼──
        └─┺━╃─┘
            │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -2, y: -1 }, to: XY { x: 0, y: 1 } },
      true,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 0, y: 1 } },
      Rect { from: XY { x: -2, y: -1 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        5   │    Overlapping Square
          ┌─┼─┐
        ┬─╆━╅L┼──
        │R┗━╃─┘
        └───┤
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -2, y: 0 }, to: XY { x: 0, y: 2 } },
      true,
      false,
      Rect { from: XY { x: -1, y: 0 }, to: XY { x: 0, y: 1 } },
      Rect { from: XY { x: -2, y: -1 }, to: XY { x: 1, y: 2 } },
    ),
    (
      "
        6   │    Overlapping Square
          ┌─┼─┐
        ──╆━┿L╅──
          ┡━┿━┩
          └─R─┘
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: 0 }, to: XY { x: 1, y: 2 } },
      true,
      false,
      Rect { from: XY { x: -1, y: 0 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 2 } },
    ),
    (
      "
        7   │    Overlapping Square
          ┌─┼─┐
        ──┼─╆L╅─┬
          └─╄━┛R│
            ├───┘
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 2, y: 2 } },
      true,
      false,
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 2, y: 2 } },
    ),
    (
      "
        0 ┌───┼───┐Overlapping Oblong
          │ ┏━┿━┓R│
          └─╄━┿━╃─┘
        ────┼─┼L┼────
            │ │ │
            └─┼─┘
              │
      ",
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 1, y: 2 } },
      Rect { from: XY { x: -2, y: -3 }, to: XY { x: 2, y: -1 } },
      true,
      false,
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 1, y: -1 } },
      Rect { from: XY { x: -2, y: -3 }, to: XY { x: 2, y: 2 } },
    ),
    (
      "
        1     │    Overlapping Oblong
            ┌─┼─┐
          ┌─╆━┿━┪─┐
        ──┼─╂─┼L╂R┼──
          └─╄━┿━╃─┘
            └─┼─┘
              │
      ",
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 1, y: 2 } },
      Rect { from: XY { x: -2, y: -1 }, to: XY { x: 2, y: 1 } },
      true,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -2, y: -2 }, to: XY { x: 2, y: 2 } },
    ),
    (
      "
        2     │    Overlapping Oblong
            ┌─┼─┐
            │ │ │
        ────┼─┼L┼────
          ┌─╆━┿━┪─┐
          │ ┗━┿━┛R│
          └───┼───┘
      ",
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 1, y: 2 } },
      Rect { from: XY { x: -2, y: 1 }, to: XY { x: 2, y: 3 } },
      true,
      false,
      Rect { from: XY { x: -1, y: 1 }, to: XY { x: 1, y: 2 } },
      Rect { from: XY { x: -2, y: -2 }, to: XY { x: 2, y: 3 } },
    ),
    (
      "
        ┌────┼───┐Island
        │┏━┓ │   │
        │┃R┃ │   │
        │┗━┛ │ L │
        ┼────┼───┼
        └────┼───┘
      ",
      Rect { from: XY { x: -3, y: -4 }, to: XY { x: 2, y: 1 } },
      Rect { from: XY { x: -2, y: -3 }, to: XY { x: -1, y: -1 } },
      true,
      true,
      Rect { from: XY { x: -2, y: -3 }, to: XY { x: -1, y: -1 } },
      Rect { from: XY { x: -3, y: -4 }, to: XY { x: 2, y: 1 } },
    ),
    (
      "
          │Identical
          ┏━┿━┓
        ──╂R┼L╂──
          ┗━┿━┛
            │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      true,
      true,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
            │Empty
            │
        ────┼────
            │
            │
      ",
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 0, y: 0 } },
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 0, y: 0 } },
      false,
      false,
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 0, y: 0 } },
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 0, y: 0 } },
    ),
    (
      "
        0     │      Touching
              │
            ┌─┼─┰───┐
        ────┼─┼L╂──R┼
            └─┼─┸───┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 1, y: -1 }, to: XY { x: 3, y: 1 } },
      false,
      false,
      Rect { from: XY { x: 1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 3, y: 1 } },
    ),
    (
      "
        1     │      Touching
              │ ┌───┐
            ┌─┼─┧  R│
        ────┼─┼L╀───┴
            └─┼─┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 1, y: -2 }, to: XY { x: 3, y: 0 } },
      false,
      false,
      Rect { from: XY { x: 1, y: -1 }, to: XY { x: 1, y: 0 } },
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 3, y: 1 } },
    ),
    (
      "
        2     │ ┌───┐Touching
              │ │  R│
            ┌─┼─┼───┘
        ────┼─┼L┼────
            └─┼─┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 1, y: -3 }, to: XY { x: 3, y: -1 } },
      false,
      false,
      Rect { from: XY { x: 1, y: -1 }, to: XY { x: 1, y: -1 } },
      Rect { from: XY { x: -1, y: -3 }, to: XY { x: 3, y: 1 } },
    ),
    (
      "
        3     ├───┐Touching
              │  R│
            ┌─┾━┭─┘
        ────┼─┼L┼────
            └─┼─┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 0, y: -3 }, to: XY { x: 2, y: -1 } },
      false,
      false,
      Rect { from: XY { x: 0, y: -1 }, to: XY { x: 1, y: -1 } },
      Rect { from: XY { x: -1, y: -3 }, to: XY { x: 2, y: 1 } },
    ),
    (
      "
        4   ┌─┼─┐    Touching
            │ │R│
            ┝━┿━┥
        ────┼─┼L┼───
            └─┼─┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -3 }, to: XY { x: 1, y: -1 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: -1 } },
      Rect { from: XY { x: -1, y: -3 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        5 ┌───┼      Touching
          │  R│
          └─┮━┽─┐
        ────┼─┼L┼────
            └─┼─┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -2, y: -3 }, to: XY { x: 0, y: -1 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 0, y: -1 } },
      Rect { from: XY { x: -2, y: -3 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        6───┐ │      Touching
        │  R│ │
        └───┼─┼─┐
        ────┼─┼L┼────
            └─┼─┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -3, y: -3 }, to: XY { x: -1, y: -1 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: -1, y: -1 } },
      Rect { from: XY { x: -3, y: -3 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        7     │      Touching
        ┌───┐ │
        │  R┟─┼─┐
        ┴───╀─┼L┼───
            └─┼─┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -3, y: -2 }, to: XY { x: -1, y: 0 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: -1, y: 0 } },
      Rect { from: XY { x: -3, y: -2 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        8     │      Touching
              │
        ┌───┰─┼─┐
        ┼──R╂─┼L┼───
        └───┸─┼─┘
              │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -3, y: -1 }, to: XY { x: -1, y: 1 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: -1, y: 1 } },
      Rect { from: XY { x: -3, y: -1 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        9     │      Touching
              │
            ┌─┼─┐
        ┬───╁─┼L┼───
        │  R┞─┼─┘
        └───┘ │
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -3, y: 0 }, to: XY { x: -1, y: 2 } },
      false,
      false,
      Rect { from: XY { x: -1, y: 0 }, to: XY { x: -1, y: 1 } },
      Rect { from: XY { x: -3, y: -1 }, to: XY { x: 1, y: 2 } },
    ),
    (
      "
        10    │      Touching
              │
            ┌─┼─┐
        ────┼─┼L┼────
        ┌───┼─┼─┘
        │  R│ │
        └───┘ │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -3, y: 1 }, to: XY { x: -1, y: 3 } },
      false,
      false,
      Rect { from: XY { x: -1, y: 1 }, to: XY { x: -1, y: 1 } },
      Rect { from: XY { x: -3, y: -1 }, to: XY { x: 1, y: 3 } },
    ),
    (
      "
        11    │      Touching
              │
            ┌─┼─┐
        ────┼─┼L┼────
          ┌─┶━┽─┘
          │  R│
          └───┤
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -2, y: 1 }, to: XY { x: 0, y: 3 } },
      false,
      false,
      Rect { from: XY { x: -1, y: 1 }, to: XY { x: 0, y: 1 } },
      Rect { from: XY { x: -2, y: -1 }, to: XY { x: 1, y: 3 } },
    ),
    (
      "
        12    │      Touching
              │
            ┌─┼─┐
        ────┼─┼L┼───
            ┝━┿━┥
            │ │R│
            └─┼─┘
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: 1 }, to: XY { x: 1, y: 3 } },
      false,
      false,
      Rect { from: XY { x: -1, y: 1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 3 } },
    ),
    (
      "
        13    │      Touching
              │
            ┌─┼─┐
        ────┼─┼L┼────
            └─┾━┵─┐
              │  R│
              ├───┘
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 3 } },
      false,
      false,
      Rect { from: XY { x: 0, y: 1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 2, y: 3 } },
    ),
    (
      "
        14    │      Touching
              │
            ┌─┼─┐
        ────┼─┼L┼────
            └─┼─┼───┐
              │ │  R│
              │ └───┘
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 1, y: 1 }, to: XY { x: 3, y: 3 } },
      false,
      false,
      Rect { from: XY { x: 1, y: 1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 3, y: 3 } },
    ),
    (
      "
        15    │      Touching
              │
            ┌─┼─┐
        ────┼─┼L╁───┬
            └─┼─┦  R│
              │ └───┘
              │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 1, y: 0 }, to: XY { x: 3, y: 2 } },
      false,
      false,
      Rect { from: XY { x: 1, y: 0 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 3, y: 2 } },
    ),
    (
      "
        0      │    Disjoint
               │
               │
             ┌─┼─┐┌───┐
        ─────┼─┼L┼┼──R┼
             └─┼─┘└───┘
               │
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 2, y: -1 }, to: XY { x: 4, y: 1 } },
      false,
      false,
      Rect { from: XY { x: 2, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 4, y: 1 } },
    ),
    (
      "
        1      │    Disjoint
               │
               │  ┌───┐
             ┌─┼─┐│  R│
        ─────┼─┼L┼┴───┴
             └─┼─┘
               │
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 2, y: -2 }, to: XY { x: 4, y: 0 } },
      false,
      false,
      Rect { from: XY { x: 2, y: -1 }, to: XY { x: 1, y: 0 } },
      Rect { from: XY { x: -1, y: -2 }, to: XY { x: 4, y: 1 } },
    ),
    (
      "
        2      ├───┐Disjoint
               │  R│
               ├───┘
             ┌─┼─┐
        ─────┼─┼L┼─────
             └─┼─┘
               │
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 0, y: -4 }, to: XY { x: 2, y: -2 } },
      false,
      false,
      Rect { from: XY { x: 0, y: -1 }, to: XY { x: 1, y: -2 } },
      Rect { from: XY { x: -1, y: -4 }, to: XY { x: 2, y: 1 } },
    ),
    (
      "
        3    ┌─┼─┐  Disjoint
             │ │R│
             └─┼─┘
             ┌─┼─┐
        ─────┼─┼L┼─────
             └─┼─┘
               │
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -4 }, to: XY { x: 1, y: -2 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: -2 } },
      Rect { from: XY { x: -1, y: -4 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        4  ┌───┤    Disjoint
           │  R│
           └───┤
             ┌─┼─┐
        ─────┼─┼L┼─────
             └─┼─┘
               │
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -2, y: -4 }, to: XY { x: 0, y: -2 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 0, y: -2 } },
      Rect { from: XY { x: -2, y: -4 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        5      │    Disjoint
               │
        ┌───┐  │
        │  R│┌─┼─┐
        ┴───┴┼─┼L┼─────
             └─┼─┘
               │
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -4, y: -2 }, to: XY { x: -2, y: 0 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: -2, y: 0 } },
      Rect { from: XY { x: -4, y: -2 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        6      │    Disjoint
               │
               │
        ┌───┐┌─┼─┐
        ┼──R┼┼─┼L┼─────
        └───┘└─┼─┘
               │
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -4, y: -1 }, to: XY { x: -2, y: 1 } },
      false,
      false,
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: -2, y: 1 } },
      Rect { from: XY { x: -4, y: -1 }, to: XY { x: 1, y: 1 } },
    ),
    (
      "
        7      │    Disjoint
               │
               │
             ┌─┼─┐
        ┬───┬┼─┼L┼─────
        │  R│└─┼─┘
        └───┘  │
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -4, y: 0 }, to: XY { x: -2, y: 2 } },
      false,
      false,
      Rect { from: XY { x: -1, y: 0 }, to: XY { x: -2, y: 1 } },
      Rect { from: XY { x: -4, y: -1 }, to: XY { x: 1, y: 2 } },
    ),
    (
      "
        8      │    Disjoint
               │
               │
             ┌─┼─┐
        ─────┼─┼L┼─────
             └─┼─┘
           ┌───┤
           │  R│
           └───┤
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -2, y: 2 }, to: XY { x: 0, y: 4 } },
      false,
      false,
      Rect { from: XY { x: -1, y: 2 }, to: XY { x: 0, y: 1 } },
      Rect { from: XY { x: -2, y: -1 }, to: XY { x: 1, y: 4 } },
    ),
    (
      "
        9      │    Disjoint
               │
               │
             ┌─┼─┐
        ─────┼─┼L┼─────
             └─┼─┘
             ┌─┼─┐
             │ │R│
             └─┼─┘
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: 2 }, to: XY { x: 1, y: 4 } },
      false,
      false,
      Rect { from: XY { x: -1, y: 2 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 4 } },
    ),
    (
      "
        10     │    Disjoint
               │
               │
             ┌─┼─┐
        ─────┼─┼L┼─────
             └─┼─┘
               ├───┐
               │  R│
               ├───┘
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 0, y: 2 }, to: XY { x: 2, y: 4 } },
      false,
      false,
      Rect { from: XY { x: 0, y: 2 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 2, y: 4 } },
    ),
    (
      "
        11     │    Disjoint
               │
               │
             ┌─┼─┐
        ─────┼─┼L┼┬───┬
             └─┼─┘│  R│
               │  └───┘
               │
               │
      ",
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: 2, y: 0 }, to: XY { x: 4, y: 2 } },
      false,
      false,
      Rect { from: XY { x: 2, y: 0 }, to: XY { x: 1, y: 1 } },
      Rect { from: XY { x: -1, y: -1 }, to: XY { x: 4, y: 2 } },
    ),
    (
      "0 Distant Disjoint",
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 10, y: 10 } },
      Rect { from: XY { x: 17, y: -22 }, to: XY { x: 25, y: -17 } },
      false,
      false,
      Rect { from: XY { x: 17, y: 0 }, to: XY { x: 10, y: -17 } },
      Rect { from: XY { x: 0, y: -22 }, to: XY { x: 25, y: 10 } },
    ),
    (
      "1 Distant Disjoint",
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 10, y: 10 } },
      Rect { from: XY { x: -17, y: -22 }, to: XY { x: -9, y: -17 } },
      false,
      false,
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: -9, y: -17 } },
      Rect { from: XY { x: -17, y: -22 }, to: XY { x: 10, y: 10 } },
    ),
    (
      "2 Distant Disjoint",
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 10, y: 10 } },
      Rect { from: XY { x: -17, y: 22 }, to: XY { x: -9, y: 27 } },
      false,
      false,
      Rect { from: XY { x: 0, y: 22 }, to: XY { x: -9, y: 10 } },
      Rect { from: XY { x: -17, y: 0 }, to: XY { x: 10, y: 27 } },
    ),
    (
      "3 Distant Disjoint",
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 10, y: 10 } },
      Rect { from: XY { x: 17, y: 22 }, to: XY { x: 25, y: 27 } },
      false,
      false,
      Rect { from: XY { x: 17, y: 22 }, to: XY { x: 10, y: 10 } },
      Rect { from: XY { x: 0, y: 0 }, to: XY { x: 25, y: 27 } },
    ),
    (
      "0 Disparate Disjoint",
      Rect { from: XY { x: 100, y: 100 }, to: XY { x: 500, y: 1100 } },
      Rect { from: XY { x: 20, y: -39 }, to: XY { x: 32, y: -1 } },
      false,
      false,
      Rect { from: XY { x: 100, y: 100 }, to: XY { x: 32, y: -1 } },
      Rect { from: XY { x: 20, y: -39 }, to: XY { x: 500, y: 1100 } },
    ),
    (
      "1 Disparate Disjoint",
      Rect { from: XY { x: 100, y: 100 }, to: XY { x: 500, y: 1100 } },
      Rect { from: XY { x: -20, y: -39 }, to: XY { x: -8, y: -1 } },
      false,
      false,
      Rect { from: XY { x: 100, y: 100 }, to: XY { x: -8, y: -1 } },
      Rect { from: XY { x: -20, y: -39 }, to: XY { x: 500, y: 1100 } },
    ),
    (
      "2 Disparate Disjoint",
      Rect { from: XY { x: 100, y: 100 }, to: XY { x: 500, y: 1100 } },
      Rect { from: XY { x: -20, y: 39 }, to: XY { x: -8, y: 77 } },
      false,
      false,
      Rect { from: XY { x: 100, y: 100 }, to: XY { x: -8, y: 77 } },
      Rect { from: XY { x: -20, y: 39 }, to: XY { x: 500, y: 1100 } },
    ),
    (
      "3 Disparate Disjoint",
      Rect { from: XY { x: 100, y: 100 }, to: XY { x: 500, y: 1100 } },
      Rect { from: XY { x: 20, y: 39 }, to: XY { x: 32, y: 77 } },
      false,
      false,
      Rect { from: XY { x: 100, y: 100 }, to: XY { x: 32, y: 77 } },
      Rect { from: XY { x: 20, y: 39 }, to: XY { x: 500, y: 1100 } },
    ),
  ];

  #[test]
  fn intersects() {
    CASES.iter().enumerate().for_each(
      |(
        i,
        (diagram, lhs, rhs, intersects, _contains, _intersection, _union),
      )| {
        assert_eq!(
          lhs.intersects(rhs),
          *intersects,
          "Case {} failed: {:?}.{}",
          i,
          (lhs, rhs, intersects),
          diagram
        );
        assert_eq!(
          rhs.intersects(lhs),
          *intersects,
          "Case {} (flipped) failed: {:?}.{}",
          i,
          (lhs, rhs, intersects),
          diagram
        );
      },
    )
  }

  #[test]
  fn contains() {
    CASES.iter().enumerate().for_each(
      |(
        i,
        (diagram, lhs, rhs, _intersects, contains, _intersection, _union),
      )| {
        assert_eq!(
          lhs.contains(rhs),
          *contains,
          "Case {} failed: {:?}.{}",
          i,
          (lhs, rhs, contains),
          diagram
        );
      },
    )
  }

  #[test]
  fn intersection() {
    CASES.iter().enumerate().for_each(
      |(
        i,
        (diagram, lhs, rhs, _intersects, _contains, intersection, _union),
      )| {
        assert_eq!(
          lhs.intersection(rhs),
          *intersection,
          "Case {} failed: {:?}.{}",
          i,
          (lhs, rhs, intersection),
          diagram
        );
        assert_eq!(
          rhs.intersection(lhs),
          *intersection,
          "Case {} (flipped) failed: {:?}.{}",
          i,
          (lhs, rhs, intersection),
          diagram
        );
      },
    )
  }

  #[test]
  fn union() {
    CASES.iter().enumerate().for_each(
      |(
        i,
        (diagram, lhs, rhs, _intersects, _contains, _intersection, union),
      )| {
        assert_eq!(
          lhs.union(rhs),
          *union,
          "Case {} failed: {:?}.{}",
          i,
          (lhs, rhs, union),
          diagram
        );
        assert_eq!(
          rhs.union(lhs),
          *union,
          "Case {} (flipped) failed: {:?}.{}",
          i,
          (lhs, rhs, union),
          diagram
        );
      },
    )
  }
}
