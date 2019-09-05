# Nature Elsewhere

An isometric adventure in an idealized state of nature.

## Development

### Install and Execute

`npm -s i && npm -s start`

### Rounding Errors

All integral variables passed from JavaScript to WebGL are inherently truncated.
When passing an independent variable, this implicit truncation by converting to
shader input is acceptable. However, when deriving a renderable variable from
another variable, the first must be truncated independently to avoid possible
jitter.

E.g., consider deriving camera position at an offset from the player's position.
The player may be at 0.1 and the camera follows at an offset of 100.9. The
rendered player's position is implicitly truncated to 0. Depending on
formulation, the rendered camera's position may be:

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

#### Shader Floating Point Limits

My Pixel XL's [`mediump` precision is noticeably
lower](https://stackoverflow.com/a/4430934/970346) than my laptop. Since the
program's execution time is fed into the shader as a floating point, this was
quickly overflowing causing calculations to become quite out of sync. I've
since increased the request to `highp`.

#### Floating Point Modulo

I also had some floating point errors when taking relatively small modulos of
very large numbers. [The following] seemed to work ok and is [the definition for
OpenGL's `mod`](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mod.xhtml):

```
// 0x4000 is 2^14 (mediump).
val = val - Math.trunc(val / 0x4000) \* 0x4000
```

[the following]: https://wikipedia.org/wiki/Modulo_operation#Remainder_calculation_for_the_modulo_operation

### Scaling

It took me way too long to figure this out but only integer scaling with a
minimum size works the way I wanted.

- Noninteger scaling produces odd pixels that are inconsistently sized. This is
  especially noticeable for such large, low-resolution virtual pixels. Either
  they're slightly larger than their neighbors or, if I recall correctly,
  missing.
- Given an ideal viewport size, integer scaling usually generates an image
  that's either too large or too small. I found that picking the maximum integer
  scale that shows a minimum viewport size works well. The result is either a
  viewport that is scaled to exactly the document size or the next size smaller.
  In the (frequent) latter case, the result is simply to show larger viewport
  than ideal.

The scaling transformation can be done in a number of ways. I think the best is
probably to change the canvas and viewport size to match the document every
frame, and then do all the scaling in WebGL. This keeps all the math as a
projection in WebGL which keeps things much simpler than diving into the world
of CSS.

This was all quite a frustration when combined with updating all the different
Phaser framework subsystems and eventually led me to pursue WebGL.

### Renderer State Machine

The game is paused when the player backgrounds the game either by selecting a
different window or tab. This is accomplished by subscribing to window focus,
blur, and GL context change events, not Document.hidden. The game loop is
suspended when possible so events, which are necessary to resume looping, are
used consistently.

The [Khronos website has microscopic examples on how to properly manage a
renderer](https://www.khronos.org/webgl/wiki/HandlingContextLost).
Of course, I seemed to have neverending difficulties in writing a slim manager.
Its design was encumbered by other systemic factors but I just couldn't seem to
wrap my head around how to handle the states nicely in TypeScript and the code
was a disheartening disaster for a long time. I eventually stripped everything
away and wrote a synchronous version. I then realized the loop couldn't "wake"
back up once suspended, and mimicked the simple synchronous version so much as
possible using EventListeners which seems to work pretty well.

### Isometric

The original vision for Nature Elsewhere was always a 2D Mario-like
side-scroller. That is, a flat as in paper, no depth, wallpaper-like game. It
was very easy for me to envision and reason about conceptually, both technically
and visually, and I never thought of it any other way. However, I don't think it
fit in well with the themes of adventure and exploration nearly so well. I had a
hard time picturing exploration without adding the usual platform mechanics of
jumping from place to place. I love pre-scripted content but it felt much too
linear. My feelings were that I wanted to avoid platformer mechanics if possible
because there are many such games and I think it could distract from a sense of
wandering. Maybe it wouldn't have been bad if I had been able to do some kind of
enjoyable water physics but bah.

So eventually I worked my way towards an isometric style which has been very
difficult for me to visualize but has the atmosphere I was seeking. I played a
lot of Diablo II and a little SimCity 2000 but throughout development and long
before, I always come back to "a simple good game would be a nature-y take on
Super Mario Bros. 3." Nature Elsewhere is kind of a mix of them all, I suppose.

I drew a lot of contrast, pixeling, and inspiration in general from
[Arne's website]. I also really like their humble way of writing which changed
how I think about things. I spent quite some hours during a week long vacation
just reading through their copious and sprawling materials. [Pixel Joint] and
numerous creators on [Twitter] have also been a fantastic reference and source
of inspirado but sometimes equally make me feel inadequate.

[arne's website]: https://androidarts.com/
[pixel joint]: http://pixeljoint.com/
[twitter]: https://twitter.com/

### Palettes

Early palettes had a very washed-out look. The intent was to give that Colorado
bleached look you see on a blindingly bright day, or maybe my recollections of
the bloom effect in Ico and Shadow of the Colossus, but it wasn't so enjoyable
in practice. I focused on giving the palette more saturation and contrast with
fewer colors over _many_ iterations including several rewrites. I think this
works much better for a pixel game.

I struggled a lot with palette swapping too. Old versions of the engine
supported many complex visual operations, including palette swapping. Not in
itself complex, but the system I built around the feature, in combination with
other features, really made development a lot more complex and slower than it
needed to be and I just had a hard time grasping how multiple palettes should
work.

### Entities

I've had something of an identity crisis while working on Nature Elsewhere. Is
it an object-oriented or functional project? Back and forth I go! More so than
with other parts of the system, I've had trouble expressing entities nicely in
a functional style. Perhaps it's the way I was taught, but I consistently find
object-oriented systems much easier to write, but not easier to read or modify,
than functional. The former comes naturally to me and the latter is easier to
usually easier reason about after its written. I'm not sure I could generalize
which is easier to conceptualize a system for.

I am quite pleased to have finally extracted a lot of the data into JSON
configuration files, as opposed to code, which has a number of benefits: 1)
reasoning about data is closer to reasoning a picture than code (much easier and
fewer bugs) 2) dumb data is easier to serialize and deserialize than dynamic
code. That number is more than two, I think, but that's all I have at the
moment.

I had a lot of trouble understanding what the responsibilities of images should
be and what their relationship is to entities. All of these concerns were
compounded by managing groups of images and entities and how they correlated to
the Aseprite format.

### Other Engines

I tried a few other engines and tools, notably Phaser v2.x and Tiled. I found it
very challenging to achieve "pixel perfect" AND responsive sizing in Phaser
v2.x. I even bought a book! Phaser felt like it had glued a whole bunch of
different tools together and it was an ultimately extremely frustrating
experience but I imagine v3 is much better. Tiled gave me similar feelings of
frustration where a lot worked and was very promising and useful but the devil
was in the details and when little things didn't work, it was a great unfun.

I also tried using the plain web Canvas API but the performance was very poor on
my Linux machine. WebGL is pretty flakey on my NVIDIA GPU too, but felt like the
best approach to me. The reason is that I get far less upset having to learn how
to do something in WebGL than I do in a non-standard engine. For me, it is kind
of like how learning the C programming language is a good investment since it's
probably not going to disappear any time soon and has concepts that can be built
upon in any other language, but learning (redacted) may be shortsighted and
offer poor returns.

Three.js was much more complicated than I wanted for a side-scroller.

### Work

As a personal passion project, it's been a challenge to maintain my motivation,
project vision, and to work earnestly. I mostly struggle with: 1) project value
to anyone 2) the immense gobs of time this project eats up 3) whether the project
is completable by me. I question myself pretty regularly about it all. For
instance, the pixel art style may be hard to appreciate. Even in the best case
scenario that I manage to finish development, will anyone actually want to play
it much? The construction quality and open-source approach has also been a great
burden. I read some Gamasutra article about the Venn diagram of "games you can
make," "games you want to make," and "games others want to play." I think about
it often.

One precursor project I pursued was "Once and Future Cactus" but I was pouring
so much time into it that I wanted a more serious idea to pursue. I also had
another "simple" game called "Sound of Water" that I just never had enough
momentum to follow-through on.

I don't know why it's taking me so long.

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

#### WebGL

WebGL v2 is used because it supports instancing, which seemed very convenient.
v1 also supports instancing but only when the ANGLE_instanced_arrays extension
is available. I may need to readdress this decision as iOS somehow only supports
v1.

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

Functional programming conventions are preferred. That is:

- Return new immutable types instead of modifying parameters.
- Avoid classes and closures.

Despite:

- Difficulty with polymorphic behavior
- Privates are not encapsulated. This mostly requires reframing and extra care
  when handling results.
- Keep code and data separate to avoid serializing woes

For me, I think object-oriented code is easier to write but functional code is
easier to read and modify. The former comes naturally to me and the latter is
usually easier to reason about after its written. I'm not sure I could
generalize which is easier to conceptualize a system for.

#### Formatting

Prettier does such consistent formatting that braceless if and loops seem to be
perfectly fine. No matter how guttural the input, the indentation is never
misleading. Code isn't always formatted to my ideal, but I think that
guaranteeing code will never be misleading is magnificent and opens up the
syntax.

#### Parts of JavaScript / TypeScript to Avoid

I guess, in general, I just try to stick to fat arrow functions, the base
JavaScript API, and composition. There's lot of JavaScript to know but I don't
and it doesn't seem to be much of a problem when sticking to a modern subset of
it with modern tools. I think of older JavaScript versions as almost a
different language entirely and can understand why some avoided it. ES6+ is
something entirely different (in a good way). However, I try specifically to
avoid:

- `bind` and `this`. Just use arrows, generally.
- The prototype chain and inheritance. Any time I look online at some
  distinguished but slightly historical JavaScript documentation, they go on and
  on about the prototype chain and inheritance. It sounds really complicated and
  scares the potatoes out of me. For me, the important thing to recognize is
  that this prototypal inheritance is still inheritance and should be used with
  care or even avoided entirely. I really don't want a bunch of implicit stuff
  where everything I do is nuanced and has to be considered up and down the
  chain. In my opinion, the cost outweighs the value. I would have to know a lot
  more to work with code like that and I probably wouldn't want to. I think
  that in ES6 if you're touching the prototype you're probably doing something
  wrong (or someone else touched it first) or maybe I'm missing the point.
- Prototypal inheritance over classical inheritance. When I first started
  JavaScripting, I was sad to learn that classes were being added given how
  highly prototypal inheritance was touted by some. The old school guard of
  legends seemed to think that prototypes were the bee's knees and maybe even
  more. That was a different time and thankfully the extensive foundational
  framework that is installed at the beginning of "JavaScript: The Good Parts"
  no longer seems necessary. I now think that proper class support is a big
  improvement for taking an inheritance approach. I just don't want to think
  about any kind of inheritance though, generally, but most especially custom
  frameworks mixed with weird language quirks. Further, I think a lot of pre-ES6
  materials are examples of what _not_ to do in modern JavaScript,
  unfortunately.
- Getters and setters (via get / set keywords). I just don't know much about
  them. They seem kind of limited over traditional functions. I would most
  probably try to favor a plain object unless coding standards required
  otherwise.
- I don't know enough about the details of modules, scope, and hoisting.
  Fortunately, I don't seem to need to by sticking to const, let, class, and
  import. It kind of all just works as expected without any arcane knowledge.
- I try to avoid loops. Although the syntax is less appealing to me,
  Array.forEach() provides updated variables for the current value, index, and
  array under iteration. I also think it's nice to be able to forget about the
  for..in / for..of distinction, and Object.hasOwnProperty() which is an
  inheritance smell.
- I try not to use null. I think there's a whole article about why it's
  generally unnecessary by the TypeScript folks that I agreed with. Regardless,
  I don't even like that an object can have undefined values for key values and
  would prefer the key just be omitted which is the approach I've tried to take
  but support in TypeScript isn't robust enough yet.
- I always use strict equality checking (`===`) to avoid thinking about type
  coercion. I wish there were nicer built-in mechanisms for deep operations.
- I want to use ESLint. It's useful. However, it needs and allows too much
  configuration to make it worthwhile for me. I want an ESLint config that
  draws red lines under likely bugs and lets Prettier do the rest without any
  muss. It feels like almost a Webpack level of complexity and requires a much
  deeper understanding of JavaScript and the ESLint ecosystem than I want to
  have.
- I try to stick to Promises and async / await for anything asynchronous. I wish
  there was better built-in cancelation support.

#### Naming

##### Abbreviations

The following abbreviations are used regardless of context:

- cfg, config: configuration
- dat: data
- doc: document
- ev: event
- fn: function
- init: initialize, initial value
- len: length
- obj: object
- rect: rectangle
- state (state bundle)

(generally not used for types)

The following abbreviations are only used for function locals:

- ret: unambiguous return value or result, especially test subject (actual)
  result
- rnd: unambiguous random value
- val: unambiguous input value
- i: unambiguous index
- img: image

##### Terminology

- atlas: a composite texture
- bounds: having a position and size (usually a `Rect`)
- length: usually number of elements
- location: a WebGL shader program variable index
- new / make: like the `new` operator; new is preferred where the language
  allows
- position: an _x_ and _y_ cartesian location (usually a `XY`)
- size: an area (usually a `WH`) or size in bytes like `sizeof` in the C
  programming language
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
