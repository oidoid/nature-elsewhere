use super::xy::XY;
use num::traits::{
  cast::{NumCast, ToPrimitive},
  real::Real,
  Zero,
};
use serde::Serialize;
use std::{
  convert::{From, TryFrom, TryInto},
  fmt,
  ops::{Add, AddAssign, Div, DivAssign, Mul, MulAssign, Sub, SubAssign},
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
    T: Sub<Output = T> + Clone,
  {
    self.to.clone() - self.from.clone()
  }

  /// May be negative.
  pub fn area(&self) -> T
  where
    T: Sub<Output = T> + Mul<Output = T> + Clone,
  {
    self.size().area()
  }

  pub fn is_empty(&self) -> bool
  where
    T: Sub<Output = T> + Zero + Clone,
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

  pub fn clamp(&self, min: &XY<T>, max: &XY<T>) -> Self
  where
    T: PartialOrd + Clone,
  {
    Self { from: self.from.clamp(min, max), to: self.to.clamp(min, max) }
  }

  pub fn lerp(&self, to: &XY<T>, ratio: T) -> Self
  where
    T: Real,
  {
    let from = self.from.lerp(to, ratio);
    Self { from: from.clone(), to: self.to.clone() + from - self.from.clone() }
  }
}

macro_rules! impl_magnitude {
  ($($t:ty),+) => ($(
    impl Rect<$t> {
      pub fn magnitude(&self) -> $t {
        self.size().magnitude()
      }
    }
  )+)
}
impl_magnitude!(usize, isize, u8, i8, u16, i16, u32, i32, f32, u64, i64, f64);

macro_rules! impl_try_lerp {
  ($Ratio:ty; $($T:ty),+) => ($(
    impl Rect<$T> {
      pub fn try_lerp(&self, to: &XY<$T>, ratio: $Ratio) -> Option<Self> {
        let from = self.from.try_lerp(to, ratio)?;
        Some(Self { from: from.clone(), to: self.to.clone() + from - self.from.clone() })
      }
    }
  )+)
}
impl_try_lerp!(f32; u8, i8, u16, i16);
impl_try_lerp!(f64; u32, i32);

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

impl<T: AddAssign> AddAssign<Rect<T>> for Rect<T> {
  fn add_assign(&mut self, rhs: Self) {
    self.from += rhs.from;
    self.to += rhs.to;
  }
}

impl<T: AddAssign + Clone> AddAssign<XY<T>> for Rect<T> {
  fn add_assign(&mut self, rhs: XY<T>) {
    self.from += rhs.clone();
    self.to += rhs;
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

impl<T: SubAssign> SubAssign<Rect<T>> for Rect<T> {
  fn sub_assign(&mut self, rhs: Self) {
    self.from -= rhs.from;
    self.to -= rhs.to;
  }
}

impl<T: SubAssign + Clone> SubAssign<XY<T>> for Rect<T> {
  fn sub_assign(&mut self, rhs: XY<T>) {
    self.from -= rhs.clone();
    self.to -= rhs;
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

impl<T: Mul<Output = T> + Clone> Mul<T> for Rect<T> {
  type Output = Self;

  fn mul(self, rhs: T) -> Self {
    Self { from: self.from * rhs.clone(), to: self.to * rhs }
  }
}

impl<T: MulAssign> MulAssign<Rect<T>> for Rect<T> {
  fn mul_assign(&mut self, rhs: Self) {
    self.from *= rhs.from;
    self.to *= rhs.to;
  }
}

impl<T: MulAssign + Clone> MulAssign<XY<T>> for Rect<T> {
  fn mul_assign(&mut self, rhs: XY<T>) {
    self.from *= rhs.clone();
    self.to *= rhs;
  }
}

impl<T: MulAssign + Clone> MulAssign<T> for Rect<T> {
  fn mul_assign(&mut self, rhs: T) {
    self.from *= rhs.clone();
    self.to *= rhs;
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

impl<T: Div<Output = T> + Clone> Div<T> for Rect<T> {
  type Output = Self;

  fn div(self, rhs: T) -> Self {
    Self { from: self.from / rhs.clone(), to: self.to / rhs }
  }
}

impl<T: DivAssign> DivAssign<Rect<T>> for Rect<T> {
  fn div_assign(&mut self, rhs: Self) {
    self.from /= rhs.from;
    self.to /= rhs.to;
  }
}

impl<T: DivAssign + Clone> DivAssign<XY<T>> for Rect<T> {
  fn div_assign(&mut self, rhs: XY<T>) {
    self.from /= rhs.clone();
    self.to /= rhs;
  }
}

impl<T: DivAssign + Clone> DivAssign<T> for Rect<T> {
  fn div_assign(&mut self, rhs: T) {
    self.from /= rhs.clone();
    self.to /= rhs;
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

macro_rules! impl_From_to_float {
  ($To:ty; $($From:ty),+) => ($(
    impl From<Rect<$From>> for Rect<$To> {
      fn from(Rect {from, to}: Rect<$From>) -> Self {
        Self { from: XY::from(from), to: XY::from(to) }
      }
    }
    impl From<($From, $From, $From, $From)> for Rect<$To> {
      fn from((fx, fy, tx, ty): ($From, $From, $From, $From)) -> Self {
        Self { from: XY::from((fx, fy)), to: XY::from((tx, ty)) }
      }
    }
)+)
}
impl_From_to_float!(f32; u8, i8, u16, i16);
impl_From_to_float!(f64; u8, i8, u16, i16, u32, i32, f32);

macro_rules! impl_TryFrom_float {
  ($From:ty; $($To:ty),+) => ($(
    impl TryFrom<Rect<$From>> for Rect<$To> {
      type Error = ();
      fn try_from(Rect { from, to }: Rect<$From>) -> Result<Self, Self::Error> {
        Ok(Self { from: XY::try_from(from)?, to: XY::try_from(to)? })
      }
    }
    impl TryFrom<($From, $From, $From, $From)> for Rect<$To> {
      type Error = ();
      fn try_from((fx, fy, tx, ty): ($From, $From, $From, $From)) -> Result<Self, Self::Error> {
        Ok(Self { from: XY::try_from((fx, fy))?, to: XY::try_from((tx, ty))? })
      }
    }
  )+)
}
impl_TryFrom_float!(
  f32; usize,
  isize,
  u8,
  i8,
  u16,
  i16,
  u32,
  i32,
  u64,
  i64,
  u128,
  i128
);
impl_TryFrom_float!(
  f64; usize,
  isize,
  u8,
  i8,
  u16,
  i16,
  u32,
  i32,
  f32,
  u64,
  i64,
  u128,
  i128
);

macro_rules! impl_From_widen {
  ($From:ty; $($To:ty),+) => ($(
    impl From<Rect<$From>> for Rect<$To> {
      fn from(Rect { from, to }: Rect<$From>) -> Self {
        Self { from: from.into(), to: to.into() }
      }
    }
    impl From<($From, $From, $From, $From)> for Rect<$To> {
      fn from((fx, fy, tx, ty): ($From, $From, $From, $From)) -> Self {
        Self { from: (fx, fy).into(), to: (tx, ty).into() }
      }
    }
  )+)
}
impl_From_widen!(u8; u16, i16, u32, i32, u64, i64, u128, i128);
impl_From_widen!(i8; i16, i32, i64, i128);
impl_From_widen!(u16; u32, i32, u64, i64, u128, i128);
impl_From_widen!(i16; i32, i64, i128);
impl_From_widen!(u32; u64, i64, u128, i128);
impl_From_widen!(i32; i64, i128);
impl_From_widen!(u64; u128, i128);
impl_From_widen!(i64; i128);

macro_rules! impl_TryFrom_int {
  ($From:ty; $($To:ty),+) => ($(
    impl TryFrom<Rect<$From>> for Rect<$To> {
      type Error = ();
      fn try_from(Rect { from, to }: Rect<$From>) -> Result<Self, Self::Error> {
        Ok(Self { from: from.try_into()?, to: to.try_into()? })
      }
    }
    impl TryFrom<($From, $From, $From, $From)> for Rect<$To> {
      type Error = ();
      fn try_from((fx, fy, tx, ty): ($From, $From, $From, $From)) -> Result<Self, Self::Error> {
        Ok(Self { from: (fx, fy).try_into()?, to: (tx, ty).try_into()? })
      }
    }
  )+)
}
impl_TryFrom_int!(usize; isize, u8, i8, u16, i16, u32, i32, u64, i64, u128, i128);
impl_TryFrom_int!(isize; usize, u8, i8, u16, i16, u32, i32, u64, i64, u128, i128);
impl_TryFrom_int!(u8; usize, isize, i8);
impl_TryFrom_int!(i8; usize, isize, u8, u16, u32, u64, u128);
impl_TryFrom_int!(u16; usize, isize, u8, i8, i16);
impl_TryFrom_int!(i16; usize, isize, u8, i8, u16, u32, u64, u128);
impl_TryFrom_int!(u32; usize, isize, u8, i8, u16, i16, i32);
impl_TryFrom_int!(i32; usize, isize, u8, i8, u16, i16, u32, u64, u128);
impl_TryFrom_int!(u64; usize, isize, u8, i8, u16, i16, u32, i32, i64);
impl_TryFrom_int!(i64; usize, isize, u8, i8, u16, i16, u32, i32, u64, u128);
impl_TryFrom_int!(u128; usize, isize, u8, i8, u16, i16, u32, i32, u64, i64, i128);
impl_TryFrom_int!(i128; usize, isize, u8, i8, u16, i16, u32, i32, u64, i64, u128);

macro_rules! impl_From_tuple {
  ($($T:ty),+) => ($(
    impl From<($T, $T, $T, $T)> for Rect<$T> {
      fn from((fx, fy, tx, ty): ($T, $T, $T, $T)) -> Self {
        Self::new(fx, fy, tx, ty)
      }
    }
    impl From<Rect<$T>> for ($T, $T, $T, $T) {
      fn from(Rect { from, to }: Rect<$T>) -> Self {
        (from.x, from.y, to.x, to.y)
      }
    }
  )+)
}
impl_From_tuple!(
  usize, isize, u8, i8, u16, i16, u32, i32, f32, u64, i64, f64, u128, i128
);

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
  const CASES: &[(
    &str,
    (i16, i16, i16, i16),
    (i16, i16, i16, i16),
    bool,
    bool,
    (i16, i16, i16, i16),
    (i16, i16, i16, i16),
  )] = &[
    (
      "
        0   │    Overlapping Square
          ┌─╆━┱─┐
        ──┼─╂L╂R┼
          └─╄━┹─┘
            │
      ",
      (-1, -1, 1, 1),
      (0, -1, 2, 1),
      true,
      false,
      (0, -1, 1, 1),
      (-1, -1, 2, 1),
    ),
    (
      "
        1   ├───┐Overlapping Square
          ┌─╆━┓R│
        ──┼─╄L╃─┴
          └─┼─┘
            │
      ",
      (-1, -1, 1, 1),
      (0, -2, 2, 0),
      true,
      false,
      (0, -1, 1, 0),
      (-1, -2, 2, 1),
    ),
    (
      "
        2 ┌─R─┐  Overlapping Square
          ┢━┿━┪
        ──┡━┿L┩──
          └─┼─┘
            │
      ",
      (-1, -1, 1, 1),
      (-1, -2, 1, 0),
      true,
      false,
      (-1, -1, 1, 0),
      (-1, -2, 1, 1),
    ),
    (
      "
        3───┤    Overlapping Square
        │R┏━╅─┐
        ┴─╄━╃L┼──
          └─┼─┘
            │
      ",
      (-1, -1, 1, 1),
      (-2, -2, 0, 0),
      true,
      false,
      (-1, -1, 0, 0),
      (-2, -2, 1, 1),
    ),
    (
      "
        4   │    Overlapping Square
        ┌─┲━╅─┐
        ┼R╂─╂L┼──
        └─┺━╃─┘
            │
      ",
      (-1, -1, 1, 1),
      (-2, -1, 0, 1),
      true,
      false,
      (-1, -1, 0, 1),
      (-2, -1, 1, 1),
    ),
    (
      "
        5   │    Overlapping Square
          ┌─┼─┐
        ┬─╆━╅L┼──
        │R┗━╃─┘
        └───┤
      ",
      (-1, -1, 1, 1),
      (-2, 0, 0, 2),
      true,
      false,
      (-1, 0, 0, 1),
      (-2, -1, 1, 2),
    ),
    (
      "
        6   │    Overlapping Square
          ┌─┼─┐
        ──╆━┿L╅──
          ┡━┿━┩
          └─R─┘
      ",
      (-1, -1, 1, 1),
      (-1, 0, 1, 2),
      true,
      false,
      (-1, 0, 1, 1),
      (-1, -1, 1, 2),
    ),
    (
      "
        7   │    Overlapping Square
          ┌─┼─┐
        ──┼─╆L╅─┬
          └─╄━┛R│
            ├───┘
      ",
      (-1, -1, 1, 1),
      (0, 0, 2, 2),
      true,
      false,
      (0, 0, 1, 1),
      (-1, -1, 2, 2),
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
      (-1, -2, 1, 2),
      (-2, -3, 2, -1),
      true,
      false,
      (-1, -2, 1, -1),
      (-2, -3, 2, 2),
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
      (-1, -2, 1, 2),
      (-2, -1, 2, 1),
      true,
      false,
      (-1, -1, 1, 1),
      (-2, -2, 2, 2),
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
      (-1, -2, 1, 2),
      (-2, 1, 2, 3),
      true,
      false,
      (-1, 1, 1, 2),
      (-2, -2, 2, 3),
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
      (-3, -4, 2, 1),
      (-2, -3, -1, -1),
      true,
      true,
      (-2, -3, -1, -1),
      (-3, -4, 2, 1),
    ),
    (
      "
          │Identical
          ┏━┿━┓
        ──╂R┼L╂──
          ┗━┿━┛
            │
      ",
      (-1, -1, 1, 1),
      (-1, -1, 1, 1),
      true,
      true,
      (-1, -1, 1, 1),
      (-1, -1, 1, 1),
    ),
    (
      "
            │Empty
            │
        ────┼────
            │
            │
      ",
      (0, 0, 0, 0),
      (0, 0, 0, 0),
      false,
      false,
      (0, 0, 0, 0),
      (0, 0, 0, 0),
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
      (-1, -1, 1, 1),
      (1, -1, 3, 1),
      false,
      false,
      (1, -1, 1, 1),
      (-1, -1, 3, 1),
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
      (-1, -1, 1, 1),
      (1, -2, 3, 0),
      false,
      false,
      (1, -1, 1, 0),
      (-1, -2, 3, 1),
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
      (-1, -1, 1, 1),
      (1, -3, 3, -1),
      false,
      false,
      (1, -1, 1, -1),
      (-1, -3, 3, 1),
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
      (-1, -1, 1, 1),
      (0, -3, 2, -1),
      false,
      false,
      (0, -1, 1, -1),
      (-1, -3, 2, 1),
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
      (-1, -1, 1, 1),
      (-1, -3, 1, -1),
      false,
      false,
      (-1, -1, 1, -1),
      (-1, -3, 1, 1),
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
      (-1, -1, 1, 1),
      (-2, -3, 0, -1),
      false,
      false,
      (-1, -1, 0, -1),
      (-2, -3, 1, 1),
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
      (-1, -1, 1, 1),
      (-3, -3, -1, -1),
      false,
      false,
      (-1, -1, -1, -1),
      (-3, -3, 1, 1),
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
      (-1, -1, 1, 1),
      (-3, -2, -1, 0),
      false,
      false,
      (-1, -1, -1, 0),
      (-3, -2, 1, 1),
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
      (-1, -1, 1, 1),
      (-3, -1, -1, 1),
      false,
      false,
      (-1, -1, -1, 1),
      (-3, -1, 1, 1),
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
      (-1, -1, 1, 1),
      (-3, 0, -1, 2),
      false,
      false,
      (-1, 0, -1, 1),
      (-3, -1, 1, 2),
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
      (-1, -1, 1, 1),
      (-3, 1, -1, 3),
      false,
      false,
      (-1, 1, -1, 1),
      (-3, -1, 1, 3),
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
      (-1, -1, 1, 1),
      (-2, 1, 0, 3),
      false,
      false,
      (-1, 1, 0, 1),
      (-2, -1, 1, 3),
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
      (-1, -1, 1, 1),
      (-1, 1, 1, 3),
      false,
      false,
      (-1, 1, 1, 1),
      (-1, -1, 1, 3),
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
      (-1, -1, 1, 1),
      (0, 1, 2, 3),
      false,
      false,
      (0, 1, 1, 1),
      (-1, -1, 2, 3),
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
      (-1, -1, 1, 1),
      (1, 1, 3, 3),
      false,
      false,
      (1, 1, 1, 1),
      (-1, -1, 3, 3),
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
      (-1, -1, 1, 1),
      (1, 0, 3, 2),
      false,
      false,
      (1, 0, 1, 1),
      (-1, -1, 3, 2),
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
      (-1, -1, 1, 1),
      (2, -1, 4, 1),
      false,
      false,
      (2, -1, 1, 1),
      (-1, -1, 4, 1),
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
      (-1, -1, 1, 1),
      (2, -2, 4, 0),
      false,
      false,
      (2, -1, 1, 0),
      (-1, -2, 4, 1),
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
      (-1, -1, 1, 1),
      (0, -4, 2, -2),
      false,
      false,
      (0, -1, 1, -2),
      (-1, -4, 2, 1),
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
      (-1, -1, 1, 1),
      (-1, -4, 1, -2),
      false,
      false,
      (-1, -1, 1, -2),
      (-1, -4, 1, 1),
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
      (-1, -1, 1, 1),
      (-2, -4, 0, -2),
      false,
      false,
      (-1, -1, 0, -2),
      (-2, -4, 1, 1),
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
      (-1, -1, 1, 1),
      (-4, -2, -2, 0),
      false,
      false,
      (-1, -1, -2, 0),
      (-4, -2, 1, 1),
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
      (-1, -1, 1, 1),
      (-4, -1, -2, 1),
      false,
      false,
      (-1, -1, -2, 1),
      (-4, -1, 1, 1),
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
      (-1, -1, 1, 1),
      (-4, 0, -2, 2),
      false,
      false,
      (-1, 0, -2, 1),
      (-4, -1, 1, 2),
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
      (-1, -1, 1, 1),
      (-2, 2, 0, 4),
      false,
      false,
      (-1, 2, 0, 1),
      (-2, -1, 1, 4),
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
      (-1, -1, 1, 1),
      (-1, 2, 1, 4),
      false,
      false,
      (-1, 2, 1, 1),
      (-1, -1, 1, 4),
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
      (-1, -1, 1, 1),
      (0, 2, 2, 4),
      false,
      false,
      (0, 2, 1, 1),
      (-1, -1, 2, 4),
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
      (-1, -1, 1, 1),
      (2, 0, 4, 2),
      false,
      false,
      (2, 0, 1, 1),
      (-1, -1, 4, 2),
    ),
    (
      "0 Distant Disjoint",
      (0, 0, 10, 10),
      (17, -22, 25, -17),
      false,
      false,
      (17, 0, 10, -17),
      (0, -22, 25, 10),
    ),
    (
      "1 Distant Disjoint",
      (0, 0, 10, 10),
      (-17, -22, -9, -17),
      false,
      false,
      (0, 0, -9, -17),
      (-17, -22, 10, 10),
    ),
    (
      "2 Distant Disjoint",
      (0, 0, 10, 10),
      (-17, 22, -9, 27),
      false,
      false,
      (0, 22, -9, 10),
      (-17, 0, 10, 27),
    ),
    (
      "3 Distant Disjoint",
      (0, 0, 10, 10),
      (17, 22, 25, 27),
      false,
      false,
      (17, 22, 10, 10),
      (0, 0, 25, 27),
    ),
    (
      "0 Disparate Disjoint",
      (100, 100, 500, 1100),
      (20, -39, 32, -1),
      false,
      false,
      (100, 100, 32, -1),
      (20, -39, 500, 1100),
    ),
    (
      "1 Disparate Disjoint",
      (100, 100, 500, 1100),
      (-20, -39, -8, -1),
      false,
      false,
      (100, 100, -8, -1),
      (-20, -39, 500, 1100),
    ),
    (
      "2 Disparate Disjoint",
      (100, 100, 500, 1100),
      (-20, 39, -8, 77),
      false,
      false,
      (100, 100, -8, 77),
      (-20, 39, 500, 1100),
    ),
    (
      "3 Disparate Disjoint",
      (100, 100, 500, 1100),
      (20, 39, 32, 77),
      false,
      false,
      (100, 100, 32, 77),
      (20, 39, 500, 1100),
    ),
  ];

  #[test]
  fn intersects() {
    CASES.iter().enumerate().for_each(
      |(
        i,
        &(diagram, lhs, rhs, intersects, _contains, _intersection, _union),
      )| {
        assert_eq!(
          R16::from(lhs).intersects(&R16::from(rhs)),
          intersects,
          "Case {} failed: {:?}.{}",
          i,
          (lhs, rhs, intersects),
          diagram
        );
        assert_eq!(
          R16::from(rhs).intersects(&R16::from(lhs)),
          intersects,
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
        &(diagram, lhs, rhs, _intersects, contains, _intersection, _union),
      )| {
        assert_eq!(
          R16::from(lhs).contains(&R16::from(rhs)),
          contains,
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
        &(diagram, lhs, rhs, _intersects, _contains, intersection, _union),
      )| {
        assert_eq!(
          R16::from(lhs).intersection(&R16::from(rhs)),
          R16::from(intersection),
          "Case {} failed: {:?}.{}",
          i,
          (lhs, rhs, intersection),
          diagram
        );
        assert_eq!(
          R16::from(rhs).intersection(&R16::from(lhs)),
          R16::from(intersection),
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
        &(diagram, lhs, rhs, _intersects, _contains, _intersection, union),
      )| {
        assert_eq!(
          R16::from(lhs).union(&R16::from(rhs)),
          R16::from(union),
          "Case {} failed: {:?}.{}",
          i,
          (lhs, rhs, union),
          diagram
        );
        assert_eq!(
          R16::from(rhs).union(&R16::from(lhs)),
          R16::from(union),
          "Case {} (flipped) failed: {:?}.{}",
          i,
          (lhs, rhs, union),
          diagram
        );
      },
    )
  }
}
