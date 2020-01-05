use num_traits::{cast::FromPrimitive, Float};

/// Returns the minimal integer multiple >= val.
pub fn ceil_multiple<T: Float>(val: T, multiple: T) -> T {
  if multiple.is_zero() {
    multiple
  } else {
    (val / multiple).ceil() * multiple
  }
}

pub trait CeilMultiple {
  fn ceil_multiple(self, multiple: Self) -> Self;
}

macro_rules! impl_CeilMultiple_f32 {
  ($($t:ty)*) => ($(
    impl CeilMultiple for $t {
      fn ceil_multiple(self, multiple: Self) -> Self {
        Self::from_f32(ceil_multiple(self.into(), multiple.into())).unwrap()
      }
    }
  )*)
}
impl_CeilMultiple_f32!(u8 u16 i8 i16 f32);

macro_rules! impl_CeilMultiple_f64 {
  ($($t:ty)*) => ($(
    impl CeilMultiple for $t {
      fn ceil_multiple(self, multiple: Self) -> Self {
        Self::from_f64(ceil_multiple(self.into(), multiple.into())).unwrap()
      }
    }
  )*)
}
impl_CeilMultiple_f64!(u32 i32 f64);

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn zero_multiple() {
    assert_eq!(0i16.ceil_multiple(0), 0);
    assert_eq!(0u32.ceil_multiple(0), 0);
    assert_eq!(ceil_multiple(0., 0.), 0.);
  }

  #[test]
  fn zero_val() {
    assert_eq!(0i16.ceil_multiple(10), 0);
    assert_eq!(0u32.ceil_multiple(10), 0);
    assert_eq!(ceil_multiple(0., 10.), 0.);
  }

  #[test]
  fn large_multiple() {
    assert_eq!(5i16.ceil_multiple(100), 100);
    assert_eq!(5u32.ceil_multiple(100), 100);
    assert_eq!(ceil_multiple(5., 100.), 100.);
  }

  #[test]
  fn nonzero_nonmultiple() {
    assert_eq!(1i16.ceil_multiple(2), 2);
    assert_eq!(1u32.ceil_multiple(2), 2);
    assert_eq!(ceil_multiple(1., 2.), 2.);
  }

  #[test]
  fn equal_multiple() {
    assert_eq!(3i16.ceil_multiple(3), 3);
    assert_eq!(3u32.ceil_multiple(3), 3);
    assert_eq!(ceil_multiple(3., 3.), 3.);
  }

  #[test]
  fn nonequal_multiple() {
    assert_eq!(4i16.ceil_multiple(3), 6);
    assert_eq!(4u32.ceil_multiple(3), 6);
    assert_eq!(ceil_multiple(4., 3.), 6.);
  }
}
