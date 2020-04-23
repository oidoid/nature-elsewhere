use super::{lerp, TryLerp};
use num::{
  integer::Roots,
  traits::{
    cast::{NumCast, ToPrimitive},
    clamp,
    real::Real,
    Signed,
  },
};
use serde::Serialize;
use std::{
  convert::{From, TryFrom},
  fmt,
  num::{
    NonZeroI128, NonZeroI16, NonZeroI32, NonZeroI64, NonZeroI8, NonZeroIsize,
    NonZeroU128, NonZeroU16, NonZeroU32, NonZeroU64, NonZeroU8, NonZeroUsize,
  },
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
  pub fn cast_from<From>(x: From, y: From) -> Option<Self>
  where
    T: NumCast,
    From: ToPrimitive,
  {
    Some(Self { x: T::from(x)?, y: T::from(y)? })
  }

  /// Cast each component of self and returns a new XY.
  pub fn cast_into<Into>(self) -> Option<XY<Into>>
  where
    T: ToPrimitive,
    Into: NumCast,
  {
    Some(XY { x: Into::from(self.x)?, y: Into::from(self.y)? })
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

  pub fn lerp(&self, to: &Self, ratio: T) -> Self
  where
    T: Real,
  {
    Self { x: lerp(self.x, to.x, ratio), y: lerp(self.y, to.y, ratio) }
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

macro_rules! impl_try_lerp {
  ($ratio:ty: $($t:ty),*) => ($(
    impl XY<$t> {
      pub fn try_lerp(&self, to: &Self, ratio: $ratio) -> Option<Self> {
        Some(Self {
          x: self.x.try_lerp(to.x, ratio)?, y: self.y.try_lerp(to.y, ratio)?
        })
      }
    }
  )*)
}
impl_try_lerp!(f32: u8, i8, u16, i16);
impl_try_lerp!(f64: u32, i32);

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

macro_rules! impl_From_int_to_float {
  ($T:ty: $($t:ty),*) => ($(
    impl From<XY<$t>> for XY<$T> {
      fn from(XY { x, y }: XY<$t>) -> Self {
        Self { x: From::from(x), y: From::from(y) }
      }
    }
  )*)
}
impl_From_int_to_float!(f32: u8, i8, u16, i16);
impl_From_int_to_float!(f64: u8, i8, u16, i16, u32, i32, f32);

macro_rules! impl_TryFrom_float {
  ($t:ty: $($T:ty),*) => ($(
    impl TryFrom<XY<$t>> for XY<$T> {
      type Error = ();
      fn try_from(XY { x, y }: XY<$t>) -> Result<Self, ()> {
        Ok(Self { x: NumCast::from(x).ok_or(())?, y: NumCast::from(y).ok_or(())? })
      }
    }
  )*)
}
impl_TryFrom_float!(
  f32: usize,
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
  f64: usize,
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

macro_rules! impl_From_non_zero_to_int {
  ($T:ty: $t:ty) => {
    impl From<XY<$t>> for XY<$T> {
      fn from(XY { x, y }: XY<$t>) -> Self {
        Self { x: x.get(), y: y.get() }
      }
    }
  };
}
impl_From_non_zero_to_int!(usize: NonZeroUsize);
impl_From_non_zero_to_int!(isize: NonZeroIsize);
impl_From_non_zero_to_int!(u8: NonZeroU8);
impl_From_non_zero_to_int!(i8: NonZeroI8);
impl_From_non_zero_to_int!(u16: NonZeroU16);
impl_From_non_zero_to_int!(i16: NonZeroI16);
impl_From_non_zero_to_int!(u32: NonZeroU32);
impl_From_non_zero_to_int!(i32: NonZeroI32);
impl_From_non_zero_to_int!(u64: NonZeroU64);
impl_From_non_zero_to_int!(i64: NonZeroI64);
impl_From_non_zero_to_int!(u128: NonZeroU128);
impl_From_non_zero_to_int!(i128: NonZeroI128);

macro_rules! impl_TryFrom_int_to_non_zero {
  ($T:ty: $t:ty) => {
    impl TryFrom<XY<$t>> for XY<$T> {
      type Error = ();
      fn try_from(XY { x, y }: XY<$t>) -> Result<Self, ()> {
        Ok(Self { x: <$T>::new(x).ok_or(())?, y: <$T>::new(y).ok_or(())? })
      }
    }
  };
}
impl_TryFrom_int_to_non_zero!(NonZeroUsize: usize);
impl_TryFrom_int_to_non_zero!(NonZeroIsize: isize);
impl_TryFrom_int_to_non_zero!(NonZeroU8: u8);
impl_TryFrom_int_to_non_zero!(NonZeroI8: i8);
impl_TryFrom_int_to_non_zero!(NonZeroU16: u16);
impl_TryFrom_int_to_non_zero!(NonZeroI16: i16);
impl_TryFrom_int_to_non_zero!(NonZeroU32: u32);
impl_TryFrom_int_to_non_zero!(NonZeroI32: i32);
impl_TryFrom_int_to_non_zero!(NonZeroU64: u64);
impl_TryFrom_int_to_non_zero!(NonZeroI64: i64);
impl_TryFrom_int_to_non_zero!(NonZeroU128: u128);
impl_TryFrom_int_to_non_zero!(NonZeroI128: i128);

macro_rules! impl_From_non_zero_to_float {
  ($T:ty: $($t:ty),*) => ($(
    impl From<XY<$t>> for XY<$T> {
      fn from(XY { x, y }: XY<$t>) -> Self {
        Self { x: From::from(x.get()), y: From::from(y.get()) }
      }
    }
  )*)
}
impl_From_non_zero_to_float!(f32: NonZeroU8, NonZeroI8, NonZeroU16, NonZeroI16);
impl_From_non_zero_to_float!(
  f64: NonZeroU8,
  NonZeroI8,
  NonZeroU16,
  NonZeroI16,
  NonZeroU32,
  NonZeroI32
);

macro_rules! impl_TryFrom_float_to_non_zero {
  ($t:ty: $($T:ty),*) => ($(
    impl TryFrom<XY<$t>> for XY<$T> {
      type Error = ();
      fn try_from(XY { x, y }: XY<$t>) -> Result<Self, ()> {
        Ok(Self { x: <$T>::new(NumCast::from(x).ok_or(())?).ok_or(())?, y: <$T>::new(NumCast::from(y).ok_or(())?).ok_or(())? })
      }
    }
  )*)
}
impl_TryFrom_float_to_non_zero!(
  f32: NonZeroUsize,
  NonZeroIsize,
  NonZeroU8,
  NonZeroI8,
  NonZeroU16,
  NonZeroI16,
  NonZeroU32,
  NonZeroI32,
  NonZeroU64,
  NonZeroI64,
  NonZeroU128,
  NonZeroI128
);
impl_TryFrom_float_to_non_zero!(
  f64: NonZeroUsize,
  NonZeroIsize,
  NonZeroU8,
  NonZeroI8,
  NonZeroU16,
  NonZeroI16,
  NonZeroU32,
  NonZeroI32,
  NonZeroU64,
  NonZeroI64,
  NonZeroU128,
  NonZeroI128
);

impl XY<NonZeroI16> {
  /// Cast each argument returns a new XY.
  pub fn cast_into_non_zero<From>(x: From, y: From) -> Option<Self>
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

  // [todo] other conversion tests.

  #[test]
  fn cast_from() {
    assert_eq!(XY::cast_from(-1.2, -3.4).unwrap(), XY16 { x: -1, y: -3 });
  }

  #[test]
  fn cast_into() {
    assert_eq!(
      XY { x: -1.2, y: -3.4 }.cast_into().unwrap(),
      XY16 { x: -1, y: -3 }
    );
  }

  #[test]
  fn square() {
    assert_eq!(XY::square(1), XY16 { x: 1, y: 1 });
  }

  #[test]
  fn add() {
    assert_eq!(XY { x: 1, y: 2 } + XY { x: 3, y: 4 }, XY { x: 4, y: 6 });
  }

  #[test]
  fn add_assign() {
    let mut xy = XY { x: 1, y: 2 };
    xy += XY { x: 3, y: 4 };
    assert_eq!(xy, XY { x: 4, y: 6 });
  }

  #[test]
  fn sub() {
    assert_eq!(XY { x: 1, y: 2 } - XY { x: 3, y: 4 }, XY { x: -2, y: -2 });
  }

  #[test]
  fn sub_assign() {
    let mut xy = XY { x: 1, y: 2 };
    xy -= XY { x: 3, y: 4 };
    assert_eq!(xy, XY { x: -2, y: -2 });
  }

  #[test]
  fn mul_xy() {
    assert_eq!(XY { x: 1, y: 2 } * XY { x: 3, y: 4 }, XY { x: 3, y: 8 })
  }

  #[test]
  fn mul_scalar() {
    assert_eq!(XY { x: 1, y: 2 } * 3, XY { x: 3, y: 6 });
  }

  #[test]
  fn mul_assign_xy() {
    let mut xy = XY { x: 1, y: 2 };
    xy *= XY { x: 3, y: 4 };
    assert_eq!(xy, XY { x: 3, y: 8 });
  }

  #[test]
  fn mul_assign_scalar() {
    let mut xy = XY { x: 1, y: 2 };
    xy *= 3;
    assert_eq!(xy, XY { x: 3, y: 6 });
  }

  #[test]
  fn div_xy() {
    assert_eq!(XY { x: 3, y: 4 } / XY { x: 1, y: 2 }, XY { x: 3, y: 2 });
  }

  #[test]
  fn div_scalar() {
    assert_eq!(XY { x: 3, y: 4 } / 2, XY { x: 1, y: 2 });
  }

  #[test]
  fn div_assign_xy() {
    let mut xy = XY { x: 3, y: 4 };
    xy /= XY { x: 1, y: 2 };
    assert_eq!(xy, XY { x: 3, y: 2 });
  }

  #[test]
  fn div_assign_scalar() {
    let mut xy = XY { x: 3, y: 4 };
    xy /= 2;
    assert_eq!(xy, XY { x: 1, y: 2 });
  }

  #[test]
  fn area() {
    assert_eq!(XY { x: 10, y: 200 }.area(), 2000);
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
      );
    });
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
      );
    });
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
      );
    });
  }

  #[test]
  pub fn abs_neg() {
    assert_eq!(XY { x: -1, y: -2 }.abs(), XY { x: 1, y: 2 });
  }

  #[test]
  pub fn abs_mix() {
    assert_eq!(XY { x: -1, y: 2 }.abs(), XY { x: 1, y: 2 });
  }

  #[test]
  pub fn abs_pos() {
    assert_eq!(XY { x: 1, y: 2 }.abs(), XY { x: 1, y: 2 });
  }

  #[test]
  pub fn magnitude_int() {
    assert_eq!(XY16 { x: 3, y: 4 }.magnitude(), 5);
  }

  #[test]
  pub fn magnitude_int_trunc() {
    assert_eq!(XY16 { x: 2, y: 2 }.magnitude(), 2);
  }

  #[test]
  pub fn magnitude_float() {
    assert_eq!(XY { x: 3f32, y: 4. }.magnitude(), 5.);
  }

  #[test]
  pub fn lerp() {
    assert_eq!(
      XY { x: 1., y: 2. }.lerp(&XY { x: 3., y: 4. }, 0.5),
      XY { x: 2., y: 3. }
    );
  }

  #[test]
  pub fn try_lerp() {
    assert_eq!(
      XY16 { x: 1, y: 2 }.try_lerp(&XY { x: 3, y: 4 }, 0.5).unwrap(),
      XY { x: 2, y: 3 }
    );
  }
}
