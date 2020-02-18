use num::traits::{cast::FromPrimitive, real::Real};

/// Returns the minimal integer multiple >= val.
pub fn ceil_multiple<T: Real>(val: T, multiple: T) -> T {
  if multiple.is_zero() {
    return multiple;
  }
  (val / multiple).ceil() * multiple
}

pub trait CeilMultiple {
  fn ceil_multiple(self, multiple: Self) -> Self;
}

macro_rules! impl_CeilMultiple_float {
  ($($t:ty)*) => ($(
    impl CeilMultiple for $t {
      fn ceil_multiple(self, multiple: Self) -> Self {
        ceil_multiple(self, multiple)
      }
    }
  )*)
}
impl_CeilMultiple_float!(f32 f64);

macro_rules! impl_CeilMultiple_f32 {
  ($($t:ty)*) => ($(
    impl CeilMultiple for $t {
      fn ceil_multiple(self, multiple: Self) -> Self {
        Self::from_f32(ceil_multiple(self.into(), multiple.into())).expect(&format!("Conversion from f32 to {} failed.", stringify!($t)))
      }
    }
  )*)
}
impl_CeilMultiple_f32!(u8 u16 i8 i16);

macro_rules! impl_CeilMultiple_f64 {
  ($($t:ty)*) => ($(
    impl CeilMultiple for $t {
      fn ceil_multiple(self, multiple: Self) -> Self {
        Self::from_f64(ceil_multiple(self.into(), multiple.into())).expect(&format!("Conversion from f64 to {} failed.", stringify!($t)))
      }
    }
  )*)
}
impl_CeilMultiple_f64!(u32 i32);

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn zero_multiple() {
    assert_eq!(0i16.ceil_multiple(0), 0);
    assert_eq!(0u32.ceil_multiple(0), 0);
    assert_eq!(0f64.ceil_multiple(0.), 0.);
  }

  #[test]
  fn zero_val() {
    assert_eq!(0i16.ceil_multiple(10), 0);
    assert_eq!(0u32.ceil_multiple(10), 0);
    assert_eq!(0f64.ceil_multiple(10.), 0.);
  }

  #[test]
  fn large_multiple() {
    assert_eq!(5i16.ceil_multiple(100), 100);
    assert_eq!(5u32.ceil_multiple(100), 100);
    assert_eq!(5f64.ceil_multiple(100.), 100.);
  }

  #[test]
  fn nonzero_nonmultiple() {
    assert_eq!(1i16.ceil_multiple(2), 2);
    assert_eq!(1u32.ceil_multiple(2), 2);
    assert_eq!(1f64.ceil_multiple(2.), 2.);
  }

  #[test]
  fn equal_multiple() {
    assert_eq!(3i16.ceil_multiple(3), 3);
    assert_eq!(3u32.ceil_multiple(3), 3);
    assert_eq!(3f64.ceil_multiple(3.), 3.);
  }

  #[test]
  fn nonequal_multiple() {
    assert_eq!(4i16.ceil_multiple(3), 6);
    assert_eq!(4u32.ceil_multiple(3), 6);
    assert_eq!(4f64.ceil_multiple(3.), 6.);
  }
}
