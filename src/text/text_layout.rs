use super::font::Font;
use crate::math::R16;
use crate::math::{XY, XY16};

// todo: any opportunity for collaboration with sprite_layout?
#[derive(Debug, PartialEq)]
pub struct TextLayout {
  /// The length of this array matches the string length.
  letters: Vec<Option<R16>>,
  /// The offset in pixels. todo: should this be passed in?
  cursor: XY16,
}

impl TextLayout {
  /// width The allowed layout width in pixels.
  pub fn layout(font: &Font, string: &str, width: i16, scale: &XY16) -> Self {
    let chars: Vec<_> = string.chars().collect();
    let mut letters = vec![];
    let mut cursor = XY::new(0, 0);
    let mut i = 0;
    while i < chars.len() {
      let mut layout;
      if chars[i] == '\n' {
        layout = layout_newline(font, &cursor, scale)
      } else if chars[i].is_whitespace() {
        layout = layout_space(
          font,
          &cursor,
          width,
          tracking(font, chars[i], scale, chars.get(i + 1)),
          scale,
        );
      } else {
        layout = layout_word(font, &cursor, width, &chars, i, scale);
        if cursor.x != 0
          && layout.cursor.y == next_line(font, cursor.y, &scale).y
        {
          let word_width = width - cursor.x + layout.cursor.x;
          if word_width <= width {
            // Word can fit on one line if cursor is reset to the start of the
            // line.
            cursor = next_line(font, cursor.y, &scale);
            layout = layout_word(font, &cursor, width, &chars, i, scale);
          }
        }
      }
      i += layout.letters.len();
      letters.extend(layout.letters);
      cursor.x = layout.cursor.x;
      cursor.y = layout.cursor.y;
    }
    Self { letters, cursor }
  }
}

/// {x,y} The cursor offset in pixels.
/// width The allowed layout width in pixels.
fn layout_word(
  font: &Font,
  &XY { x, y }: &XY16,
  width: i16,
  chars: &Vec<char>,
  index: usize,
  scale: &XY16,
) -> TextLayout {
  let mut x = x;
  let mut y = y;
  let mut letters = vec![];
  for index in index..chars.len() {
    if chars[index].is_whitespace() {
      break;
    }

    let span = tracking(font, chars[index], &scale, chars.get(index + 1));
    if x != 0 && (x + span) > width {
      let xy = next_line(font, y, &scale);
      x = xy.x;
      y = xy.y;
    };
    // Width is not span since, with kerning, that may exceed the actual
    // width of the letter's sprite. For example, if w has the maximal letter
    // width of five pixels and a one pixel kerning for a given pair of
    // letters, it will have a span of six pixels which is greater than the
    // maximal five pixel sprite that can be rendered.
    let w = scale.x * font.letter_width(chars[index]);
    let h = scale.y * font.letter_height;
    letters.push(Some(R16::new_wh(x, y, w, h)));
    x += span;
  }
  TextLayout { letters, cursor: XY::new(x, y) }
}

fn next_line(font: &Font, y: i16, scale: &XY16) -> XY16 {
  XY::new(0, y + scale.y * font.line_height)
}

/// cursor The cursor offset in pixels.
fn layout_newline(
  font: &Font,
  &XY { y, .. }: &XY16,
  scale: &XY16,
) -> TextLayout {
  TextLayout { letters: vec![None], cursor: next_line(font, y, scale) }
}

/// {x,y} The cursor offset in pixels.
/// width The allowed layout width in pixels.
/// span  The distance in pixels from the start of the current letter to the
///         start of the next including scale.
fn layout_space(
  font: &Font,
  &XY { x, y }: &XY16,
  width: i16,
  span: i16,
  scale: &XY16,
) -> TextLayout {
  let cursor = if x != 0 && (x + span) >= width {
    next_line(font, y, scale)
  } else {
    XY::new(x + span, y)
  };
  TextLayout { letters: vec![None], cursor }
}

/// Returns the distance in pixels from the start of lhs to the start of rhs.
fn tracking(font: &Font, lhs: char, scale: &XY16, rhs: Option<&char>) -> i16 {
  scale.x * (font.letter_width(lhs) + font.kerning(lhs, rhs))
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn layout() {
    let font: Font = include_json!("mem_font.json").unwrap();

    [
      (
        "",
        i16::max_value(),
        TextLayout {
          letters: vec![],
          cursor: XY::new(0, 0 * font.line_height),
        },
      ),
      (
        " ",
        i16::max_value(),
        TextLayout {
          letters: vec![None],
          cursor: XY::new(3, 0 * font.line_height),
        },
      ),
      (
        "\n",
        i16::max_value(),
        TextLayout {
          letters: vec![None],
          cursor: XY::new(0, 1 * font.line_height),
        },
      ),
      (
        "abc def ghi jkl mno",
        i16::max_value(),
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 0 * font.line_height, 3, font.letter_height)),
            None,
            Some(R16::new_wh(14, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(18, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(22, 0 * font.line_height, 3, font.letter_height)),
            None,
            Some(R16::new_wh(28, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(32, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(36, 0 * font.line_height, 1, font.letter_height)),
            None,
            Some(R16::new_wh(40, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(44, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(48, 0 * font.line_height, 1, font.letter_height)),
            None,
            Some(R16::new_wh(52, 0 * font.line_height, 5, font.letter_height)),
            Some(R16::new_wh(58, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(62, 0 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(65, 0 * font.line_height),
        },
      ),
      (
        "abc def ghi jkl mno",
        10,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            None,
            Some(R16::new_wh(6, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 2 * font.line_height, 3, font.letter_height)),
            None,
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 3 * font.line_height, 1, font.letter_height)),
            None,
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 4 * font.line_height, 1, font.letter_height)),
            None,
            Some(R16::new_wh(0, 5 * font.line_height, 5, font.letter_height)),
            Some(R16::new_wh(6, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 6 * font.line_height),
        },
      ),
      (
        "abc def ghi jkl mno",
        20,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 0 * font.line_height, 3, font.letter_height)),
            None,
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 1 * font.line_height, 3, font.letter_height)),
            None,
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 2 * font.line_height, 1, font.letter_height)),
            None,
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 3 * font.line_height, 1, font.letter_height)),
            None,
            Some(R16::new_wh(0, 4 * font.line_height, 5, font.letter_height)),
            Some(R16::new_wh(6, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(10, 4 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(13, 4 * font.line_height),
        },
      ),
      (
        "abc def ghi jkl mno",
        21,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 0 * font.line_height, 3, font.letter_height)),
            None,
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 1 * font.line_height, 3, font.letter_height)),
            None,
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 2 * font.line_height, 1, font.letter_height)),
            None,
            Some(R16::new_wh(12, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(16, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(20, 2 * font.line_height, 1, font.letter_height)),
            None,
            Some(R16::new_wh(0, 3 * font.line_height, 5, font.letter_height)),
            Some(R16::new_wh(6, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(10, 3 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(13, 3 * font.line_height),
        },
      ),
      (
        "a  b",
        4,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            None,
            None,
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 2 * font.line_height),
        },
      ),
      (
        "a  b ",
        4,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            None,
            None,
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            None,
          ],
          cursor: XY::new(0, 3 * font.line_height),
        },
      ),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (string, width, expected))| {
      assert_eq!(
        TextLayout::layout(&font, string, *width, &XY::new(1, 1)),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (string, width)
      )
    });
  }

  #[test]
  fn layout_word() {
    let font: Font =
      serde_json::from_str(include_str!("mem_font.json")).unwrap();

    [
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        " ",
        0,
        TextLayout {
          letters: vec![],
          cursor: XY::new(0, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "",
        0,
        TextLayout {
          letters: vec![],
          cursor: XY::new(0, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "\n",
        0,
        TextLayout {
          letters: vec![],
          cursor: XY::new(0, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "a",
        0,
        TextLayout {
          letters: vec![Some(R16::new_wh(
            0,
            0 * font.line_height,
            3,
            font.letter_height,
          ))],
          cursor: XY::new(3, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        ".",
        0,
        TextLayout {
          letters: vec![Some(R16::new_wh(
            0,
            0 * font.line_height,
            1,
            font.letter_height,
          ))],
          cursor: XY::new(1, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "a ",
        0,
        TextLayout {
          letters: vec![Some(R16::new_wh(
            0,
            0 * font.line_height,
            3,
            font.letter_height,
          ))],
          cursor: XY::new(3, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "a\n",
        0,
        TextLayout {
          letters: vec![Some(R16::new_wh(
            0,
            0 * font.line_height,
            3,
            font.letter_height,
          ))],
          cursor: XY::new(3, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "a a",
        0,
        TextLayout {
          letters: vec![Some(R16::new_wh(
            0,
            0 * font.line_height,
            3,
            font.letter_height,
          ))],
          cursor: XY::new(3, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "a.",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 1, font.letter_height)),
          ],
          cursor: XY::new(5, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "aa",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "aa\n",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "aa aa",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "g",
        0,
        TextLayout {
          letters: vec![Some(R16::new_wh(
            0,
            0 * font.line_height,
            3,
            font.letter_height,
          ))],
          cursor: XY::new(3, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(12, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(16, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(20, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(24, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(28, 0 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(31, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "abcdefgh",
        1,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(12, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(16, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(20, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(24, 0 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(27, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        i16::max_value(),
        "abcdefgh",
        8,
        TextLayout {
          letters: vec![],
          cursor: XY::new(0, 0 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        0,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 7 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 7 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        1,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 7 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 7 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        3,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 7 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 7 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        5,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 7 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 7 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        6,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 7 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 7 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        7,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 6 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 6 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        8,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 3 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 3 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        9,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 3 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 3 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        10,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 3 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 3 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        11,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 3 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 3 * font.line_height),
        },
      ),
      (
        XY::new(0, 0 * font.line_height),
        12,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(8, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(4, 2 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(7, 2 * font.line_height),
        },
      ),
      (
        XY::new(1, 0 * font.line_height),
        5,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(1, 0 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 7 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 7 * font.line_height),
        },
      ),
      (
        XY::new(2, 0 * font.line_height),
        5,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(0, 1 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 2 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 3 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 4 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 5 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 6 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 7 * font.line_height, 3, font.letter_height)),
            Some(R16::new_wh(0, 8 * font.line_height, 3, font.letter_height)),
          ],
          cursor: XY::new(3, 8 * font.line_height),
        },
      ),
      (
        XY::new(2, 1 + 0 * font.line_height),
        5,
        "abcdefgh",
        0,
        TextLayout {
          letters: vec![
            Some(R16::new_wh(
              0,
              1 + 1 * font.line_height,
              3,
              font.letter_height,
            )),
            Some(R16::new_wh(
              0,
              1 + 2 * font.line_height,
              3,
              font.letter_height,
            )),
            Some(R16::new_wh(
              0,
              1 + 3 * font.line_height,
              3,
              font.letter_height,
            )),
            Some(R16::new_wh(
              0,
              1 + 4 * font.line_height,
              3,
              font.letter_height,
            )),
            Some(R16::new_wh(
              0,
              1 + 5 * font.line_height,
              3,
              font.letter_height,
            )),
            Some(R16::new_wh(
              0,
              1 + 6 * font.line_height,
              3,
              font.letter_height,
            )),
            Some(R16::new_wh(
              0,
              1 + 7 * font.line_height,
              3,
              font.letter_height,
            )),
            Some(R16::new_wh(
              0,
              1 + 8 * font.line_height,
              3,
              font.letter_height,
            )),
          ],
          cursor: XY::new(3, 1 + 8 * font.line_height),
        },
      ),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (xy, width, string, index, expected))| {
      assert_eq!(
        super::layout_word(
          &font,
          xy,
          *width,
          &string.chars().collect::<Vec<_>>(),
          *index,
          &XY::new(1, 1)
        ),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (xy, width, string, index)
      )
    });
  }
}
