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

Some files are implicitly coupled using bracketed tags which can be grepped:

- [version] - Implicitly tied to package.json.
- [palette] - Implicitly tied to palette.
- [strings] - Implicitly tied to assets/strings.json.

### Favicons and Manifest

The cache for each can be busted by incrementing the version.

### Versioning

Be sure to grep for the `[version]` tag.

### Conventions

#### Types vs Interfaces

The `type` syntax looks nicer than `interface` and allows `Readonly` wrappers.
Prettier also formats `interface` types more verbosely than single line `type`
types. However, VS Code presents types declared with `type` as property
collections. Types declared with `interface` syntax are presented as proper
named types. Given these tradeoffs, when a type can fit on one line, use `type`,
otherwise use `interface`.

#### Imports

Wildcard imports are used to better support a functional programming style. When
order is irrelevant, case-insensitive alphabetical is used.

For comparison, consider the following class:

```ts
export class Random {
  constructor(private seed: number) {
    this.seed &= 0xff
  }
  next(): number {
    this.seed = (this.seed + 1) & 0xff
    return this.seed ^ 0xff
  }
}
```

And its usage:

```ts
import {Random} from './random'

const random = new Random(0)
console.log(random.next())
```

Now the functional implementation:

```ts
export function init(seed: number) {
  return seed & 0xff
}
export function next(seed: number) {
  return {seed: (seed + 1) & 0xff, val: seed ^ 0xff}
}
```

And its usage with wildcard imports:

```ts
import * as Random from './random'

let random = Random.next(random.init(0))
console.log(random.val)
```

The named imports could be used but they lack the context of dotting off Random.

A proper TypeScript namespace could also be used, which VS Code has better
refactor support for and it may also encourage more consistent usage, but this
adds an extra level of indentation to every file.

PascalCase is used to avoid collision with variables.

#### Divide State and Code

Don't mix data and functions. With care, plain state can be de/serialized. It's
harder when code is data. Regardless, there is often tight implicit coupling
between data and behavior but it's simpler reviving from state that is clearly
separated from code.

Dynamic functions should be avoided because they're difficult to inflate.
E.g.:

```ts
function newFlipper(state: number) {
  let flipped = 0
  return {
    state(): number {
      return state
    },
    flip(): void {
      ++flipped
      state ^= 0xff
    },
    flipped(): number {
      return flipped
    }
  }
}
// How to preserve and restore a Flipper?
```

Even without the closure, unmarshalling the state back into a Flipper is clumsy
and requires creating potentially invalid objects:

```ts
function newFlipper(state: number) {
  return {
    _flipped: 0,
    state(): number {
      return state
    },
    flip(): void {
      ++this._flipped
      state ^= 0xff
    },
    flipped(): number {
      return this._flipped
    }
  }
}

const flipper = newFlipper(1)
flipper.flip()
flipper.flip()
const clone = newFlipper(flipper.state()) // An Indeterminate state is created.
clone._flipped = flipper.flipped() // Forbidden.
```

Favor an alternative approach. E.g.:

```ts
type Flipper = Readonly<{state: number; flipped: number}>
function flip({state, flipped}: Flipper): Flipper {
  return {state: state ^ 0xff, flipped: flipped + 1}
}
// State is always returned and code lives in the repo, not in the state.
```

#### Functional vs Object-Oriented Programming

When I think of functional programming, I have the following coarse
conceptualization:

- No closure object factories.
- Avoid state context parameters.
- Avoid mutations.
- Use data and functions instead of classes.

It may be contentious but I think the distinctions between closure-built objects
and classes in TypeScript are too similar to be a major factor:

```ts
// "Functional" closure

function newFoo(val: number) {
  return {
    getFoo() {
      return val
    }
  }
}
```

```ts
// Object-oriented class

class Foo {
  constructor(private readonly val: number) {}
  getFoo() {
    return this.val
  }
}
```

State parameters feel very object-oriented, replacing an overarching class state
with pieces of an overarching context. I don't think there's often much
distinction in TypeScript:

```ts
// "Functional" state parameter

namespace Random {
  type State = Readonly<{seed: number; val: number}>

  function int({seed}: State): State {
    return {seed: seed + 1, val: seed ^ 0xff}
  }
}
```

```ts
// Object-oriented class

class Random {
  constructor(private seed: number) {}
  int(): number {
    this.seed += 1
    return seed ^ 0xff
  }
}
```

It's almost just different syntaxes for the same thing and kind of reminds me of
passing around a void pointer in the C language instead of using classes in C++.

Although easier in functional programming, I can usually make a class immutable
and I favor composition over inheritance. So, for me, the primary benefit of
functional programming is mostly about minimizing function scope. There can be a
lot of implicit state baggage that comes with a class. A function is only given
scope to what it needs.

Functional implementations are easy to reason about in isolation. I'm drawn to
them for their readability, although I tend to have a harder time expressing
them. I think it's usually easier for me to write a cohesive class that operates
on a common state than to write several functions that operate on common data.
Some calculations lend themselves well to a functional style with minimal
overhead.

However, there's no encapsulation in functional programming. State management is
explicit, manual, and there are no privates. In my view, this is clumsy and
error-prone in TypeScript for client usage in the whole program.

I think a pseudorandom number generator is a fine example. Consider the
functional and object-oriented implementations:

```ts
// Functional

export function seed(seed: number): number {
  seed = seed % 0x7fff_ffff
  if (seed <= 0) seed += 0x7fff_fffe
  return seed
}

export function float(seed: number, min = 0, max = 1) {
  seed = (seed * 16807) % 0x7fff_ffff
  const val = min + ((max - min) * (seed - 1)) / 0x7fff_fffe
  return {seed, val}
}

export function int(seed: number, min = 0, max = Number.MAX_SAFE_INTEGER) {
  let val
  ;({seed, val} = float(seed, min, max))
  return {seed, val: Math.floor(val)}
}
```

```ts
// Object-oriented

export class Random {
  constructor(private _seed: number) {
    this._seed = _seed % 0x7fff_ffff
    if (this._seed <= 0) this._seed += 0x7fff_fffe
  }

  float(min: number = 0, max: number = 1): number {
    this._seed = (this._seed * 16807) % 0x7fff_ffff
    return min + ((max - min) * (this._seed - 1)) / 0x7fff_fffe
  }

  int(min = 0, max = Number.MAX_SAFE_INTEGER): number {
    return Math.floor(this.float(min, max))
  }
}
```

Both look ok to me:

- The number of lines of code and readability are similar.
- The functional approach has a lesser level of indent but that would be lost if
  it were wrapped in a namespace.
- The usual tradeoff of explicit (functional) vs implicit (object-oriented)
  state is present but the object is quite tightly scoped so the negative impact
  of the latter is minimal.
- The functional approach requires a special seed-only state since there's no
  valid value at construction. The object-orient approach does a little bit of
  work in the constructor to avoid the intermediate seed-only state.
- I've omitted return types for the functional result objects. For more complex
  code, I may need them.
- "val" is used for the random number generated. "random" was considered but
  a client may call their result object "random" and `random.random` doesn't
  read as nicely as `random.val`.

The usage of each implementation is more decisive though. Real issues arise when
threading state through the system. For instance, the seed:

```ts
// Functional

function randomPoint(seed: number): Readonly<{seed: number; point: XY}> {
  let x
  ;({seed, val: x} = Random.int(seed, 0, 10))
  let y
  ;({seed, val: y} = Random.int(seed, 0, 20))
  return {seed, point: {x, y}}
}

let val,
  point,
  seed = Random.seed(0)
;({seed, val} = Random.float(seed))
console.log(val)
;({seed, point} = randomPoint(seed))
console.log(point)
;({seed, val} = Random.int(seed))
console.log(val)
```

```ts
// Object-oriented

function randomPoint(random: Random): XY {
  return {x: random.int(0, 10), y: random.int(0, 20)}
}

const random = new Random(0)
let val = random.float()
console.log(val)
const point = randomPoint(random)
console.log(point)
val = random.int()
console.log(val)
```

The functional approach requires manually threading the seed in and out of
_every_ function that depends on it. Managing that seed externally (outside of
Random) is verbose and fallible:

- It's easy to forget to return the new seed.
- It's easy to misuse functions when the programmer isn't in a "thinking about
  random" space. E.g., the following functional implementation is incorrect but
  compiles:
  ```ts
  function randomPoint(seed: number): Readonly<{seed: number; point: XY}> {
    return {
      seed,
      point: {x: Random.int(seed, 0, 10).val, y: Random.int(seed, 0, 20).val}
    }
  }
  ```
- It's verbose and unfun to manually manage seed state for every interaction.
- A seed is easy to construct but numbers are so common it's easy to misplace in
  function parameter lists. In this case, it's a recipe for disaster given the
  default values min and max. E.g., the following is incorrect but compiles:
  ```ts
  function randomPoint(seed: number): Readonly<{seed: number; point: XY}> {
    let x
    ;({seed, val: x} = Random.int(0, 10))
    let y
    ;({seed, val: y} = Random.int(0, 20))
    return {seed, point: {x, y}}
  }
  ```

I love how plain and readable the functional implementation is but using it is a
drudgery and entirely unfun. The object-oriented implementation isn't
appreciably worse, is easy to write and painless to use. I also think that
certain expressions, such as polymorphic behavior, can be more natural in
object-oriented designs.

#### Naming

##### Abbreviations

The following abbreviations are used regardless of context:

- init: Initialize
- rect: rectangle
- config: configuration
- fn: function
- len: length

The following abbreviations are only used for function locals:

- ret: unambiguous return value
- rnd: unambiguous random value
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
- position: an _x_ and _y_ cartesian location
- size: an area or size in bytes like `sizeof` in the C programming language
- WH: having width and height
- XY: having _x_- and _y_-coordinate dimensions such as a position

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
