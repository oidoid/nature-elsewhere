# nature elsewhere

## Development

### Installation

`npm -s i`

### Execution

`npm -s start`

### Rounding Errors

All variables passed from JavaScript to WebGL are integral by truncation.
When passing an independent variable, this implicit truncation by converting to
shader input is acceptable. However, when deriving a renderable variable from
another variable, the first must be truncated independently to avoid possible
jitter.

E.g., consider deriving camera position at an offset from the player's position.
The player may be at 0.1 and the camera at an offset of 100.9. The rendered
player's position is implicitly truncated to 0. Depending on calculation choice,
the rendered camera's position may be:

| Formula Type                  | Formula                  | Result   | Rendered player | Rendered camera | Rendered distance |
| ----------------------------- | ------------------------ | -------- | --------------- | --------------- | ----------------- |
| Implicit truncation.          | 0.1 px + 100.9 px        | 101.0 px | 0 px            | 101 px          | **101 px**        |
| Truncate before player input. | trunc(0.1 px) + 100.9 px | 100.9 px | 0 px            | 100 px          | 100 px            |
| Truncate after player input.  | trunc(0.1 px + 100.9 px) | 101.0 px | 0 px            | 101 px          | **101 px**        |

Now when the player's position has increased to 1.0 and the rendered position is
1 px, one pixel forward. The rendered distance between the camera and the player
should be constant and not change regardless of where the player is.

| Formula Type                  | Formula                  | Result   | Rendered player | Rendered camera | Rendered distance |
| ----------------------------- | ------------------------ | -------- | --------------- | --------------- | ----------------- |
| Implicit truncation.          | 1.0 px + 100.9 px        | 101.9 px | 1 px            | 101 px          | **100 px**        |
| Truncate before player input. | trunc(1.0 px) + 100.9 px | 101.9 px | 1 px            | 101 px          | 100 px            |
| Truncate after player input.  | trunc(1.0 px + 100.9 px) | 101.0 px | 1 px            | 101 px          | **100 px**        |

As shown above, when truncation is not performed or it occurs afterwards on the
sum, rounding errors can cause the rendered distance between the camera and the
position to vary under different inputs instead of remaining at a constant
offset from the player. This causes a jarring jitter effect.

Because truncation is always implied, any intermediate truncation is strongly
preferred to rounding, flooring, or ceiling. Consider when the player is at 0.1
px:

| Formula Type | Formula                  | Result   | Rendered player | Rendered camera | Rendered distance |
| ------------ | ------------------------ | -------- | --------------- | --------------- | ----------------- |
| Truncate.    | trunc(0.1 px) + 100.9 px | 100.9 px | 0 px            | 100 px          | 100 px            |
| Round.       | round(0.1 px) + 100.9 px | 100.9 px | 0 px            | 100 px          | **100 px**        |
| Floor.       | floor(0.1 px) + 100.9 px | 100.9 px | 0 px            | 100 px          | **100 px**        |
| Ceil.        | ceil(0.1 px) + 100.9 px  | 101.9 px | 0 px            | 101 px          | **101 px**        |

Now that the player has moved to 0.5 px:

| Formula Type | Formula                  | Result   | Rendered player | Rendered camera | Rendered distance |
| ------------ | ------------------------ | -------- | --------------- | --------------- | ----------------- |
| Truncate.    | trunc(0.5 px) + 100.9 px | 100.9 px | 0 px            | 100 px          | 100 px            |
| Round.       | round(0.5 px) + 100.9 px | 101.9 px | 0 px            | 101 px          | **101 px**        |
| Floor.       | floor(0.5 px) + 100.9 px | 100.9 px | 0 px            | 100 px          | **100 px**        |
| Ceil.        | ceil(0.5 px) + 100.9 px  | 101.9 px | 0 px            | 101 px          | **101 px**        |

Now that the player has moved to 1.0 px:

| Formula Type | Formula                  | Result   | Rendered player | Rendered camera | Rendered distance |
| ------------ | ------------------------ | -------- | --------------- | --------------- | ----------------- |
| Truncate.    | trunc(1.0 px) + 100.9 px | 101.9 px | 1 px            | 101 px          | 100 px            |
| Round.       | round(1.0 px) + 100.9 px | 101.9 px | 1 px            | 101 px          | **100 px**        |
| Floor.       | floor(1.0 px) + 100.9 px | 101.9 px | 1 px            | 101 px          | **100 px**        |
| Ceil.        | ceil(1.0 px) + 100.9 px  | 101.9 px | 1 px            | 101 px          | **100 px**        |

Now that the player has moved to -0.5 px:

| Formula Type | Formula                   | Result   | Rendered player | Rendered camera | Rendered distance |
| ------------ | ------------------------- | -------- | --------------- | --------------- | ----------------- |
| Truncate.    | trunc(-0.5 px) + 100.9 px | 100.9 px | 0 px            | 100 px          | 100 px            |
| Round.       | round(-0.5 px) + 100.9 px | 100.9 px | 0 px            | 100 px          | **100 px**        |
| Floor.       | floor(-0.5 px) + 100.9 px | 99.9 px  | 0 px            | 99 px           | **99 px**         |
| Ceil.        | ceil(-0.5 px) + 100.9 px  | 100.9 px | 0 px            | 100 px          | **100 px**        |

### Implicit Coupling

Some files are implicitly coupled using tags which can be grepped:

- #version - Implicitly tied to package.json.
- #palette - Implicitly tied to palette.
- #strings - Implicitly tied to assets/strings.json.

### Favicons and Manifest

The cache for each can be busted by incrementing the version.

### Versioning

Be sure to grep for the `#version` tag.

### Conventions

#### Types vs Interfaces

The type syntax looks nicer but interfaces are preferred because VS Code uses
their names instead of the full declaration.

#### Imports

Wildcard imports are used to better support a functional programming style. When
order is irrelevant, case-insensitive alphabetical is used.

For comparison, consider the following class:

```lang=ts
export class Random {
  constructor(private seed: number) { this.seed &= 0xff }
  next(): number { this.seed = (this.seed + 1) & 0xff; return 1 }
}
```

And its usage:

```lang=ts
import {Random} from './random'

const random = new Random(0)
console.log(random.next())
```

Now the functional implementation:

```lang=ts
export function init(seed: number) { return seed & 0xff }
export function next(seed: number) { return {seed: (seed + 1) & 0xff, val: 1 } }
```

And its usage with wildcard imports:

```lang=ts
import * as Random from './random'

let random = Random.next(random.init(0))
console.log(random.val)
```

The named imports could be used but they lack the context of dotting off Random.

A proper TypeScript namespace could also be used, which VS Code has better
refactor support for and it may also encourage more consistent usage, but this
adds an extra level of indentation to every file.

PascalCase is used to avoid collision with variables.

#### Functional vs Object-Oriented Programming

Functional is favored.

#### Naming

##### Abbreviations

The following abbreviations are used regardless of context:

- init: Initialize
- rect: rectangle
- config: configuration

The following abbreviations are only used for function locals:

- len: length
- ret: unambiguous return value
- val: unambiguous input value
- i: unambiguous index

##### Terminology

- atlas: a composite texture
- bounds: having a position and size
- coord: a texture coordinate
- length: usually number of elements
- location: a WebGL shader program variable index
- new / make: like the `new` operator; new is preferred where the language
  allows
- position: an X and Y cartesian location
- size: an area or size in bytes like `sizeof` in C
- WH: having width and height
- XY: having x- and y-coordinate dimensions such as a position

## License

© Stephen Niedzielski.

### GPL-3.0-only

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, version 3.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.

### CC-BY-SA-4.0

This work, excluding source code, is licensed under the Creative Commons
Attribution-ShareAlike 4.0 International License. To view a copy of this
license, visit https://creativecommons.org/licenses/by-sa/4.0/ or send a letter
to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
