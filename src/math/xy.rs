use super::lerp::Lerp;
use num::{
  integer::Roots,
  traits::{
    cast::{NumCast, ToPrimitive},
    clamp, Signed,
  },
};
use serde::Serialize;
use std::{
  convert::TryFrom,
  fmt,
  num::NonZeroI16,
  ops::{Add, AddAssign, Div, DivAssign, Mul, MulAssign, Sub, SubAssign},
};

#[derive(Clone, Eq, PartialEq, Serialize)]
pub struct XY<T> {
  pub x: T,
  pub y: T,
}
pub type XY16 = XY<i16>;

impl<T> XY<T> {
  pub fn new(x: T, y: T) -> Self {
    Self { x, y }
  }

  /// Cast each argument returns a new XY.
  pub fn try_from<From>(x: From, y: From) -> Option<Self>
  where
    T: NumCast,
    From: ToPrimitive + Clone,
  {
    Some(Self { x: T::from(x)?, y: T::from(y)? })
  }

  /// Cast each component of self and returns a new XY.
  pub fn try_into<Into>(&self) -> Option<XY<Into>>
  where
    T: ToPrimitive + Clone,
    Into: NumCast,
  {
    Some(XY { x: Into::from(self.x.clone())?, y: Into::from(self.y.clone())? })
  }

  /// Returns a new XY with equal x and y components.
  pub fn square(side: T) -> Self
  where
    T: Clone,
  {
    Self { x: side.clone(), y: side }
  }

  pub fn area(&self) -> T
  where
    T: Mul<Output = T> + Clone,
  {
    self.x.clone() * self.y.clone()
  }

  pub fn min(&self, XY { x, y }: &Self) -> Self
  where
    T: Ord + Clone,
  {
    Self { x: self.x.clone().min(x.clone()), y: self.y.clone().min(y.clone()) }
  }

  pub fn max(&self, XY { x, y }: &Self) -> Self
  where
    T: Ord + Clone,
  {
    Self { x: self.x.clone().max(x.clone()), y: self.y.clone().max(y.clone()) }
  }

  pub fn clamp(&self, min: &Self, max: &Self) -> Self
  where
    T: PartialOrd + Clone,
  {
    Self {
      x: clamp(self.x.clone(), min.x.clone(), max.x.clone()),
      y: clamp(self.y.clone(), min.y.clone(), max.y.clone()),
    }
  }

  pub fn abs(&self) -> Self
  where
    T: Signed,
  {
    Self { x: self.x.abs(), y: self.y.abs() }
  }
}

macro_rules! impl_magnitude {
  ($($t:ty),*) => ($(
    impl XY<$t> {
      /// Returns the length.
      pub fn magnitude(&self) -> $t {
        (self.x * self.x + self.y * self.y).sqrt()
      }
    }
  )*)
}
impl_magnitude!(
  usize, isize, u8, i8, u16, i16, u32, i32, f32, u64, i64, f64, u128, i128
);

macro_rules! impl_lerp {
  ($ratio:ty: $($t:ty),*) => ($(
    impl XY<$t> {
      pub fn lerp(&self, to: &Self, ratio: $ratio) -> Self {
        Self { x: self.x.lerp(to.x, ratio), y: self.y.lerp(to.y, ratio) }
      }
    }
  )*)
}
impl_lerp!(f32: u8, i8, u16, i16, f32);
impl_lerp!(f64: u32, i32, f64);

impl<T: fmt::Debug> fmt::Debug for XY<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({:?}, {:?})", self.x, self.y)
  }
}

impl<T: fmt::Display> fmt::Display for XY<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({}, {})", self.x, self.y)
  }
}

impl<T: Add<Output = T>> Add<XY<T>> for XY<T> {
  type Output = Self;

  fn add(self, rhs: Self) -> Self {
    Self { x: self.x + rhs.x, y: self.y + rhs.y }
  }
}

impl<T: AddAssign> AddAssign<XY<T>> for XY<T> {
  fn add_assign(&mut self, rhs: Self) {
    self.x += rhs.x;
    self.y += rhs.y;
  }
}

impl<T: Sub<Output = T>> Sub<XY<T>> for XY<T> {
  type Output = Self;

  fn sub(self, rhs: Self) -> Self {
    Self { x: self.x - rhs.x, y: self.y - rhs.y }
  }
}

impl<T: SubAssign> SubAssign<XY<T>> for XY<T> {
  fn sub_assign(&mut self, rhs: Self) {
    self.x -= rhs.x;
    self.y -= rhs.y;
  }
}

impl<T: Mul<Output = T>> Mul<XY<T>> for XY<T> {
  type Output = Self;

  fn mul(self, rhs: Self) -> Self {
    Self { x: self.x * rhs.x, y: self.y * rhs.y }
  }
}

impl<T: Mul<Output = T> + Clone> Mul<T> for XY<T> {
  type Output = Self;

  fn mul(self, rhs: T) -> Self {
    Self { x: self.x * rhs.clone(), y: self.y * rhs }
  }
}

impl<T: MulAssign> MulAssign<XY<T>> for XY<T> {
  fn mul_assign(&mut self, rhs: Self) {
    self.x *= rhs.x;
    self.y *= rhs.y;
  }
}

impl<T: MulAssign + Clone> MulAssign<T> for XY<T> {
  fn mul_assign(&mut self, rhs: T) {
    self.x *= rhs.clone();
    self.y *= rhs;
  }
}

impl<T: Div<Output = T>> Div<XY<T>> for XY<T> {
  type Output = Self;

  fn div(self, rhs: Self) -> Self {
    Self { x: self.x / rhs.x, y: self.y / rhs.y }
  }
}

impl<T: Div<Output = T> + Clone> Div<T> for XY<T> {
  type Output = Self;

  fn div(self, rhs: T) -> Self {
    Self { x: self.x / rhs.clone(), y: self.y / rhs }
  }
}

impl<T: DivAssign> DivAssign<XY<T>> for XY<T> {
  fn div_assign(&mut self, rhs: Self) {
    self.x /= rhs.x;
    self.y /= rhs.y;
  }
}

impl<T: DivAssign + Clone> DivAssign<T> for XY<T> {
  fn div_assign(&mut self, rhs: T) {
    self.x /= rhs.clone();
    self.y /= rhs;
  }
}

impl From<XY<NonZeroI16>> for XY<i16> {
  fn from(XY { x, y }: XY<NonZeroI16>) -> Self {
    Self { x: x.get(), y: y.get() }
  }
}

impl TryFrom<XY<i16>> for XY<NonZeroI16> {
  type Error = ();

  fn try_from(XY { x, y }: XY<i16>) -> Result<Self, ()> {
    Ok(Self {
      x: NonZeroI16::new(x).ok_or(())?,
      y: NonZeroI16::new(y).ok_or(())?,
    })
  }
}

impl XY<NonZeroI16> {
  /// Cast each argument returns a new XY.
  pub fn try_into_non_zero_i16<From>(x: From, y: From) -> Option<Self>
  where
    From: ToPrimitive + Clone,
  {
    Some(Self {
      x: NonZeroI16::new(NumCast::from(x)?)?,
      y: NonZeroI16::new(NumCast::from(y)?)?,
    })
  }
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn try_from() {
    assert_eq!(XY::try_from(-1.2, -3.4).unwrap(), XY16 { x: -1, y: -3 })
  }

  #[test]
  fn try_into() {
    assert_eq!(
      XY { x: -1.2, y: -3.4 }.try_into().unwrap(),
      XY16 { x: -1, y: -3 }
    )
  }

  #[test]
  fn square() {
    assert_eq!(XY::square(1), XY16 { x: 1, y: 1 })
  }

  #[test]
  fn add() {
    assert_eq!(XY { x: 1, y: 2 } + XY { x: 3, y: 4 }, XY { x: 4, y: 6 })
  }

  #[test]
  fn add_assign() {
    let mut xy = XY { x: 1, y: 2 };
    xy += XY { x: 3, y: 4 };
    assert_eq!(xy, XY { x: 4, y: 6 })
  }

  #[test]
  fn sub() {
    assert_eq!(XY { x: 1, y: 2 } - XY { x: 3, y: 4 }, XY { x: -2, y: -2 })
  }

  #[test]
  fn sub_assign() {
    let mut xy = XY { x: 1, y: 2 };
    xy -= XY { x: 3, y: 4 };
    assert_eq!(xy, XY { x: -2, y: -2 })
  }

  #[test]
  fn mul_xy() {
    assert_eq!(XY { x: 1, y: 2 } * XY { x: 3, y: 4 }, XY { x: 3, y: 8 })
  }

  #[test]
  fn mul_scalar() {
    assert_eq!(XY { x: 1, y: 2 } * 3, XY { x: 3, y: 6 })
  }

  #[test]
  fn mul_assign_xy() {
    let mut xy = XY { x: 1, y: 2 };
    xy *= XY { x: 3, y: 4 };
    assert_eq!(xy, XY { x: 3, y: 8 })
  }

  #[test]
  fn mul_assign_scalar() {
    let mut xy = XY { x: 1, y: 2 };
    xy *= 3;
    assert_eq!(xy, XY { x: 3, y: 6 })
  }

  #[test]
  fn div_xy() {
    assert_eq!(XY { x: 3, y: 4 } / XY { x: 1, y: 2 }, XY { x: 3, y: 2 })
  }

  #[test]
  fn div_scalar() {
    assert_eq!(XY { x: 3, y: 4 } / 2, XY { x: 1, y: 2 })
  }

  #[test]
  fn div_assign_xy() {
    let mut xy = XY { x: 3, y: 4 };
    xy /= XY { x: 1, y: 2 };
    assert_eq!(xy, XY { x: 3, y: 2 })
  }

  #[test]
  fn div_assign_scalar() {
    let mut xy = XY { x: 3, y: 4 };
    xy /= 2;
    assert_eq!(xy, XY { x: 1, y: 2 })
  }

  #[test]
  fn area() {
    assert_eq!(XY { x: 10, y: 200 }.area(), 2000)
  }

  #[test]
  fn min() {
    [
      (XY { x: 1, y: 20 }, XY { x: 300, y: 4000 }, XY { x: 1, y: 20 }),
      (XY { x: 100, y: 20 }, XY { x: 3, y: 4000 }, XY { x: 3, y: 20 }),
      (XY { x: 1, y: 2000 }, XY { x: 300, y: 40 }, XY { x: 1, y: 40 }),
      (XY { x: 100, y: 2000 }, XY { x: 3, y: 40 }, XY { x: 3, y: 40 }),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (lhs, rhs, expected))| {
      assert_eq!(
        lhs.min(rhs),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (lhs, rhs, expected)
      )
    })
  }

  #[test]
  fn max() {
    [
      (XY { x: 1, y: 20 }, XY { x: 300, y: 4000 }, XY { x: 300, y: 4000 }),
      (XY { x: 100, y: 20 }, XY { x: 3, y: 4000 }, XY { x: 100, y: 4000 }),
      (XY { x: 1, y: 2000 }, XY { x: 300, y: 40 }, XY { x: 300, y: 2000 }),
      (XY { x: 100, y: 2000 }, XY { x: 3, y: 40 }, XY { x: 100, y: 2000 }),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (lhs, rhs, expected))| {
      assert_eq!(
        lhs.max(rhs),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (lhs, rhs, expected)
      )
    })
  }

  #[test]
  fn clamp() {
    [
      (
        XY { x: 10, y: 200 },
        XY { x: 11, y: 201 },
        XY { x: 1000, y: 1000 },
        XY { x: 11, y: 201 },
      ),
      (
        XY { x: 10, y: 200 },
        XY { x: 0, y: 0 },
        XY { x: 1000, y: 1000 },
        XY { x: 10, y: 200 },
      ),
      (
        XY { x: 10, y: 200 },
        XY { x: 0, y: 0 },
        XY { x: 9, y: 199 },
        XY { x: 9, y: 199 },
      ),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (val, min, max, expected))| {
      assert_eq!(
        val.clamp(min, max),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (val, min, max, expected)
      )
    })
  }

  #[test]
  pub fn abs_neg() {
    assert_eq!(XY { x: -1, y: -2 }.abs(), XY { x: 1, y: 2 })
  }

  #[test]
  pub fn abs_mix() {
    assert_eq!(XY { x: -1, y: 2 }.abs(), XY { x: 1, y: 2 })
  }

  #[test]
  pub fn abs_pos() {
    assert_eq!(XY { x: 1, y: 2 }.abs(), XY { x: 1, y: 2 })
  }

  #[test]
  pub fn magnitude_int() {
    assert_eq!(XY16 { x: 3, y: 4 }.magnitude(), 5)
  }

  #[test]
  pub fn magnitude_int_trunc() {
    assert_eq!(XY16 { x: 2, y: 2 }.magnitude(), 2)
  }

  #[test]
  pub fn magnitude_float() {
    assert_eq!(XY { x: 3f32, y: 4. }.magnitude(), 5.)
  }

  #[test]
  pub fn lerp_int() {
    assert_eq!(
      XY16 { x: 1, y: 2 }.lerp(&XY { x: 3, y: 4 }, 0.5),
      XY { x: 2, y: 3 }
    )
  }

  #[test]
  pub fn lerp_float() {
    assert_eq!(
      XY { x: 1f64, y: 2. }.lerp(&XY { x: 3., y: 4. }, 0.5),
      XY { x: 2., y: 3. }
    )
  }
}
