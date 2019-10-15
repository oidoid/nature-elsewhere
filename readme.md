# nature elsewhere

An isometric adventure in an idealized state of nature. Play at
[ne.netlify.com](https://ne.netlify.com/).

## Table of Contents

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

- [Table of Contents](#table-of-contents)
- [Development](#development)
  - [Install and Execute](#install-and-execute)
  - [Versioning](#versioning)
  - [Tracking Work](#tracking-work)
  - [Rounding Errors](#rounding-errors)
    - [Shader Floating Point Limits](#shader-floating-point-limits)
    - [Floating Point Modulo](#floating-point-modulo)
  - [Scaling](#scaling)
  - [Renderer State Machine](#renderer-state-machine)
  - [Language](#language)
  - [Device Support](#device-support)
  - [Content](#content)
    - [Isometric](#isometric)
    - [Palettes](#palettes)
    - [Pixel Perfect](#pixel-perfect)
    - [Style](#style)
    - [Font](#font)
  - [Atlas](#atlas)
  - [Collisions](#collisions)
  - [The Entity Subsystem](#the-entity-subsystem)
    - [Serialization](#serialization)
  - [Other Engines](#other-engines)
  - [Work](#work)
  - [Implicit Coupling](#implicit-coupling)
  - [Favicons and Manifest](#favicons-and-manifest)
  - [WebGL](#webgl)
  - [Conventions](#conventions)
    - [Readonly as Needed](#readonly-as-needed)
    - [Imports](#imports)
    - [Deep-ish Objects](#deep-ish-objects)
    - [Types vs Interfaces](#types-vs-interfaces)
    - [Classes and Utilities](#classes-and-utilities)
    - [Closures vs Classes](#closures-vs-classes)
    - [Parts of JavaScript and TypeScript to Avoid](#parts-of-javascript-and-typescript-to-avoid)
    - [Typing](#typing)
    - [Formatting](#formatting)
    - [Naming](#naming)
      - [Abbreviations](#abbreviations)
      - [Terminology](#terminology)
- [Known Issues](#known-issues)
- [License](#license)
  - [GPL-3.0-only](#gpl-30-only)
  - [CC-BY-SA-4.0](#cc-by-sa-40)

<!-- /code_chunk_output -->

## Development

### Install and Execute

`npm i && npm start`

### Versioning

Before publishing a new version, grep for the `[version]` tag.

### Tracking Work

Work is tracked loosely in [text](toDo.txt).

### Rounding Errors

All integral variables passed from JavaScript to WebGL are inherently truncated.
When passing an independent variable, this implicit truncation by converting to
shader input is acceptable. However, when deriving a renderable variable from
another variable, the first must be truncated independently to avoid possible
jitter. I.e., inconsistent results.

E.g., consider deriving camera position at an offset from the player's position.
The player may be at 0.1 and the camera follows at an offset of 100.9. The
rendered player's position is implicitly truncated to 0. Depending on
formulation, the rendered camera's position may be (inconsistencies in bold):

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

It's also possible to see intense jittering when moving diagonally. E.g., moving
an image left one pixel on one frame and then up another pixel on the next
frame. It is often better to instead synchronize the movements in each direction
to occur on the same frame.

Fractional numbers are unfriendly to pixel art. A recurring problem in the
project has been weird pixel glitches and these have often been rooted in
rounding errors. Since JavaScript only supports BigInt and typed arrays
natively, the [XY](src/math/XY.ts) and [WH](src/math/WH.ts) classes help
encapsulate some of the truncation inherent when working with strictly integers.

#### Shader Floating Point Limits

My Pixel XL phone's [`mediump` precision is noticeably
lower](https://stackoverflow.com/a/4430934/970346) than my laptop's. Since the
program's execution time is fed into the shader as a floating point, this was
quickly overflowing causing calculations to become quite out of sync. I've
since increased the request to `highp`.

#### Floating Point Modulo

Floating point errors can occur when taking relatively small divisors of very
large numbers. [The following] seemed to work ok and is [the definition for
OpenGL's `mod`](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mod.xhtml):

```
// 0x4000 is 2^14 (mediump).
val = val - Math.trunc(val / 0x4000) \* 0x4000
```

[the following]: https://wikipedia.org/wiki/Modulo_operation#Remainder_calculation_for_the_modulo_operation

### Scaling

Integer scaling with a minimum size seems to work best.

- Maximum integer scaling to the minimum dimension (width or height) can leave
  large empty areas. For example, these might be rendered as vacant black bars
  on the left and right.
- Noninteger scaling produces odd pixels that are inconsistently sized. This is
  especially noticeable for such large, low-resolution virtual pixels. Either
  they're slightly larger than their neighbors, missing, or rendered incorrectly
  (e.g., black or glitchy) due to integer assumptions elsewhere.
- Given an ideal viewport size, integer scaling usually generates an image
  that's either too large or too small. Picking the maximum integer scale that
  shows a minimum viewport size works well. The result is either a
  viewport that is scaled exactly to the document size or the next size larger.
  In the (frequent) latter case, the result is simply to show larger viewport
  than ideal. If different minimum viewport sizes are used, the scaling may
  vary which means that pixels will vary in size between levels. This is a
  compromise but seems to work visually. Even with integral scaling, both
  dimensions (which are likely disproportionate) must be considered and rounding
  up must be performed. Otherwise, strange and often subtle visual artifacts
  will creep in.

The scaling transformation can be done in a number of ways. The best approach
may be to change the canvas and viewport size to match the document every frame,
and then do all the scaling in WebGL. This keeps all the math as a projection
in WebGL which keeps things much simpler than diving into the world of CSS. Note
also that the width and height Canvas attributes are changed, not the style
width and height properties. The latter is a scaling operation.

Listening for window size events asynchronously seems to be a common pitfall as
well, which I stumbled into while working with Phaser.

There are many configurations that mostly work but I only found a couple that
worked well. This was all quite a frustration when combined with synchronizing
all the different Phaser framework subsystems and eventually led me to pursue
WebGL.

### Renderer State Machine

The game is paused when the player backgrounds the game either by selecting a
different window or tab. This is accomplished by subscribing to window focus,
blur, and GL context change events, not Document.hidden. The game loop is
suspended when possible so events, which are necessary to resume looping, are
used consistently.

The [Khronos website has microscopic examples on how to properly manage a
renderer](https://www.khronos.org/webgl/wiki/HandlingContextLost).
Of course, I seemed to have unending difficulties in writing a slim manager. Its
design was encumbered by other systemic factors but I just couldn't seem to wrap
my head around how to handle the states nicely in TypeScript and the code was a
disheartening disaster for a long time. I eventually stripped everything away
and wrote a synchronous version. I then realized the loop couldn't "wake" back
up once suspended, and mimicked the simple synchronous version so much as
possible using EventListeners which seems to work pretty well.

### Language

TypeScript has been an indispensable improvement over JavaScript and, in
general, the following faculties have been valuable:

- Node.js Package Manager. It is far, far from perfect but the easiest package
  manager I've used. I don't have to wreck my system installing dependencies or
  lean too heavily on virtalization for trusted projects.
- Lingua franca: ubiquitous support on desktop web browsers, native desktop apps
  via Electron, mobile web browsers, and mobile native apps via WebViews.
- A technology intersection with my profession.
- Pretty simple most of the time.
- A stunning ecosystem of examples and resources. I remember at the tail end of
  school seeing Java applets on the way out but people had done so many cool
  things with them. I think JavaScript has since supplanted applets and has a
  great wealth of neat stuff.
- Reasonable typing. Nice duck typing and inference have also been powerful.
- Platform support for GL, DOM, and application development.
- Very good IDE support and tooling. The refactors are ok, not as good as in the
  C++ or Java toolchains, but I couldn't be happier to not be using a Java
  powered IDE or build tools, or a makefile.
- Great JSON support.

I dislike the Webpack craziness, and the fast, immature, and sprawling nature of
the entire stack. I think my code is verbose and not so nice but it can be easy
to reason about and change. I often think of other languages but TypeScript
offers lots.

I think TypeScript has a big learning curve, for someone as dumb as me at least,
working on a scratch project without a preexisting framework to lean on for how
to pattern the code without rethinking everything. I've wasted so many days
trying different approaches and I'm still unsatisfied. Part of the issue is that
there are some inherent limitations in the language that are not obvious and are
big time sinks where one tries to figure out if they're truly misusing the
language or not. Combined with the other complexities of a game and it's proven
quite difficult at times.

### Device Support

A big recent change in project vision has been to focus on pointers as a common
denominator that will work on mobile and desktop. This has big design and
technical implications.

### Content

#### Isometric

I've been extremely pleased with the unexpected isometric direction the game
has taken but continue to find it challenging to draw. I think it really helps
solve the atmosphere problems I anticipated and works really well.

The original vision for Nature Elsewhere was always a 2D Mario-like
side-scroller. That is, a flat as in paper, no depth, wallpaper-like game. It
was very easy for me to envision and reason about conceptually, both technically
and visually, and I never thought of it any other way. However, I don't think it
fit in well with the themes of adventure and exploration nearly so well. I had a
hard time picturing exploring without adding the usual platform mechanics of
jumping from place to place. I love pre-scripted content but it felt much too
linear. My feelings were that I wanted to avoid platformer mechanics if possible
because there are many such games and I think it could distract from a sense of
wandering. Maybe it wouldn't have been bad if I had been able to do some kind of
enjoyable water physics but I didn't try.

So eventually I worked my way towards an isometric style which has been very
difficult for me to visualize but has the atmosphere I was seeking. I played a
lot of Diablo II and a little SimCity 2000 but throughout development and long
before, I always came back to "a simple good game would be a nature-y take on
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

#### Palettes

Early palettes had a very washed-out look. The intent was to give that Colorado
bleached look you see on a blindingly bright day, or maybe my recollections of
the bloom effect in Ico and Shadow of the Colossus, but it wasn't so enjoyable
in practice. I focused on giving the palette more saturation and contrast with
fewer colors over _many_ iterations including several rewrites. I think this
works much better for a pixel game and reminds of the palettes used in the NES
Teenage Mutant Ninja Turtles games or some of the X-Men arcade games.

I struggled a lot with palette swapping too. Old versions of the engine
supported many complex visual operations, including palette swapping. Not in
itself complex, but the system I built around the feature, in combination with
other features, really made development a lot more complicated and slower than
it needed to be and I just had a hard time grasping how multiple palettes should
work. I am striving for a minimal palette for the forseeable future.

Translucent colors used to be present and were used foremost for rain. They
increased the complexity of the palette though because it wasn't always clear
when to use a translucent color and a similar opaque color in all contexts and
that caused the palette to grow. I've since omitted all translucency and I think
the consistent hard pixel look is better fitting. Lately, I've been extremely
guarded about adding new colors as in previous iterations I lost control of the
palette and never really got it back. I just started over.

I worry a lot about color calibration and its been a recurring problem for the
project. I notice subtle differences across my devices that make me sad and I
have to force sRGB in Chromium.

Any change to the palette takes ages but at least it's easy to test. I just take
a screen capture of a given scene, convert it to indexed color, and change the
colors.

Color is such a strange, fluctuating, relative perception. It's been challenging
to make good choices by eye. My goal is "tremendous colors." I'm trying to focus
on an optimal overall palette rather than a optimizing each specific character's
palette with respect to itself alone.

#### Pixel Perfect

In general, keeping a responsive and as close to pixel perfect as possible
render has been very important to my vision for the project. That is, make full
use of the screen space available but honor the pixel. Just knowing which
approach to pursue has been challenging but it was largely due to this strong
interest that drove me to build my own engine.

Many modern retro games take a different approach which is often to render large
blocky pixel art sprites in a very high resolution scene and I think the feeling
is very different. For me, I think pixel art is quite unique in that pixels are
digital, on or off and nowhere in between, and there's no blurriness unlike the
real world. I think this perfect clarity is profound and so have endeavored to
keep true to this wonderful property as much as possible for all visual matters.

The latest consequence is that the camera really snaps from pixel to pixel and
it feels quite toothy. I think I'm comfortable with that. However, one thing I
found was that keeping diagonal camera movements in sync across x and y axes was
important to avoid a very jarring experience so there is special code for it.

I remain uncertain whether scaling should vary from level to level. I think it
will work.

Those are my feelings so far anyway. I hope it plays well and compromises can be
avoided. I am still crafting my vision for what are good and bad design choices.

#### Style

Initially, I wanted to pursue a minimalismistic style as much as possible
because I'm not a good artist and I hoped that the constraints would help me be
more efficient and eliminate some opportunities for my shortcomings to show.
This style choice went all the way back to "Once and Future Cactus" and, to an
even greater extent, "Sound of Water." Well, after working on Nature Elsewhere
for some long time, I just wanted more. The backpacker avatar was about as
minimal as you can get, seven black pixels when idle:

```
 x
xx
xx
 x
 x
```

There were some things I really liked about it. Well, I was doodling one evening
and came up with some designs I thought I might like much better if I could
animate them. Another night, I had the walking animation and I thought it was
quite an improvement. I'm still pursuing minimalism but less aggressively so.

#### Font

"mem-font" has grown from the most minimalist possible, monospaced, barely
legible font to a five pixels wide by six pixels tall (plus one pixel leading)
balanced proportional compromise. It's kind of a silly waste of time but often
an enjoyable fuss.

Most letterforms are three-by-three pixels. A few characters, such as the m's
and w's, are now a whopping five-by-five pixels (wow!) in pursuit of
readability. I've also tried to favor smoother forms and avoid diagonal pixels
for overall word clarity at the expense of a little personality and optimal
isolated form.

I hope to upstream the changes to the now quite divergent
[mem-font GitHub project](https://github.com/rndmem/mem-font), which is the
predecessor to the letter forms used in the game and to which I haven't made
changes to in over two years.

### Atlas

The sprite sheet logic lives in
[aseprite-atlas](https://github.com/oddoid/aseprite-atlas) and has the following
properties:

- The Atlas is immutable.
- The Animator is dumb.

### Collisions

- Avoid changing an entity's collision footprint across frames or states as it
  can create a collision unexpectedly and cause entities to get stuck.
- Minimize collision areas. It's nicer for the player to move uninhibited.
- Minimize rectangle cavities. The draw sort works by height and caverns often
  must be "roped off" by invisible collision bodies to prevent the player from
  unexpectedly snapping behind the entity they're exploring. This can be avoided
  by using multiple images instead of one big one. For example, on an isometric
  fence post corner, use a front facing image along the x-axis and one or more
  _short_ diagonal images.
- If the speed exceeds one pixel per update cycle (expected to be about 60
  pixels per second), the collision will not be resolved accurately.

### The Entity Subsystem

I've had something of an identity crisis while working on Nature Elsewhere. Is
it an object-oriented or functional project? Back and forth I go! More so than
with other parts of the system, I've had trouble expressing entities nicely in
a functional style. Perhaps it's the way I was taught, but I consistently find
object-oriented systems much easier to write.

I was quite pleased to have finally extracted a lot of the data into JSON
configuration files, as opposed to code, which had a number of benefits: 1)
reasoning about data is closer to reasoning about a picture than code (much
easier and fewer bugs) 2) dumb data is easier to serialize and deserialize than
dynamic code 3) JSON is vastly more declarative and a lot less implementation
heavy than JavaScript. Unfortunately, without a tightly coupled mechanism like
JSX, it's not really possible to construct any object without either parsing or
redundantly embedding all of the same defaults into the constructors of
JavaScript equivalents. Parsing post-construction phase is heavy, and feels kind
of lame not to be able just new up an object, and a binding phase will be
needed. I also lost TypeScript type checking (which was a huge compilation speed
boost but) sucked. For these reasons, I dumped everything but the most high-
level JSON, levels.

I had a lot of trouble understanding what the responsibilities of images should
be and what their relationship is to entities. All of these concerns were
compounded by managing groups of images and entities, parsing, construction,
binding, and subtype behavior overlapping complications, and how they correlated
to the Aseprite format.

The level editor and UI in general highlighted a number of design limitations
in the entity subsystem. For example, grouping entities and positioning them
relative to each other.

This prior functionality was pretty important for very basic UI, such as the
toolbar and even the simple title screen, but was left behind when migrating to
an entity subsystem that better separated configuration data from code.
Similarly, the prior system had better support for composing entities (via code
not configuration) while the replacement system only had good support image
compositions. For me, the parallels in requirements for even toy UI and modern
UI libraries were striking.

The solution I pursued was to implement an entity subsystem with recursive
support. That is, each entity can have children that are also entities and when
an entity is moved, all of its children move too. This functionality is
available from the configurations that are parsed through transformations,
updates, state changes, the collision subsystem, and more.

The entity subsystem quite unsurprisingly is at the heart of the natural engine,
but it wasn't something I gave serious enough consideration to previously. I
guess because it felt more implementation agnostic than other features like
graphics, audio, or physics and I figured in my little brain that if I could
program data structures, it would just come together naturally without too much
thinking. I was so wrong. This is _the_ architecture.

The entity subsystem will need lots more work but it's been quite interesting
now that I recognize its importance and understand some of the problems it needs
to solve.

I'm still struggling with system design in a big way. However, given the number
of rewrites I've done so far, I've increasingly valued rather plain and blunt
implementations, that are extensible, written as simply as possible, and easy to
read and reason about. I've never been very good at holding a project in my head
overnight so I've increasingly been writing for the idiot that comes in in the
morning. It's worse now that I only work evenings and weekends. Easier said than
done but making new features obvious is the hope for the new entity subsystem
especially.

This is going to take a while so high readability is a must.

#### Serialization

Default state is omitted. Serializations aren't much more than diff from the
defaults. The thinking is:

1. If the default changes, the serialized type will get the new default unless
   it explicitly deviated.
1. The JSON configurations will be terse.

### Other Engines

I tried a few other engines and tools, notably Phaser v2.x and Tiled. I found it
very challenging to achieve "pixel perfect" AND responsive sizing in Phaser
v2.x. I even bought a book! Phaser felt like it had glued a whole bunch of
different tools together and it was an ultimately extremely frustrating
experience but I imagine v3 is much better. Tiled gave me similar feelings of
frustration where a lot worked and was very promising and useful but the devil
was in the details and when little things didn't work, it was a very great
unfun.

I also tried using the plain web Canvas API but the performance was very poor on
my Linux machine. WebGL is pretty flakey on my NVIDIA GPU too, but felt like the
best approach to me. The reason is that I get far less upset having to learn how
to do something in WebGL than I do in a non-standard engine. For me, it is kind
of like how learning the C programming language is a good investment since it's
probably not going to disappear any time soon and has concepts that can be built
upon in any other language, but learning (redacted) may be shortsighted and
offer poor returns.

Three.js was much more complicated than I wanted for a side-scroller which was
what I was building at the time.

### Work

As a personal passion project, it's been a continual challenge to maintain my
motivation, project vision, and to work earnestly. I most oft struggle with: 1)
project value to anyone 2) the immense quantities of time this project
consumes 3) whether the project is completable by me. I question myself pretty
regularly about it all. For instance, the pixel art style may be hard to
appreciate. Even in the best case scenario that I manage to finish development,
will anyone actually want to play it much? Will it be fun?

My grandfather always told me that the secret to life is work. Even for fun, I
think that's so true for many reasons. There is such a big difference between
talking about all the neat things one would like to build and actually doing it.
The former is nearly effortless. The latter can really take some doing and hard
work. Even then, it may not work. I've found it difficult to work in earnest but
that's all part of it.

Further, by nature, I am a lazy and intuitive thinker but I am slowly changing.
In technical school, a classmate told me they could visualize a picture so
perfectly but couldn't put it paper once it came time to draw it. I felt the
same way until I was tasked to draw a human nose and finally realized, despite
this feeling of perfect visage, I had no idea what a nose _really_ looked like.
So I worked at it. I can't draw noses or much else any more but for a time it
was my specialty if so ever I had one. I think this level of clarity can only be
found in work and there's no substitute for it. Everything else in life is
theoretical. Success is work's great achievement.

The construction quality and open-source approach has also been a great burden.
Is the code too lousy even for a hobbyist or
[lover of](https://wikipedia.org/wiki/Amateur)? Will the project be stolen?

I've also found it difficult to wear every hat, to balance the planning and the
doing, and to furnish a real project vision. Even effective notekeeping has been
a challenge. It's hard to know the difference between doodling and planning some
times. Working smart is hard work.

I read some
[Gamasutra article](https://www.gamasutra.com/blogs/JakeBirkett/20181008/328091/How_to_choose_what_game_to_make_next.php) about the Venn diagram of "games you
can make," "games you want to make," and "games others want to play." I think
about it often.

One precursor project I pursued was "Once and Future Cactus" but I was pouring
so much time into it that I wanted a more serious idea to pursue. I also had
another "simple" game called "Sound of Water" that I just never had enough
momentum to follow-through on.

As a project entirely of my own volition, my failures are my own and there is no
recompense for self-deception.

I don't know why it's taking me so long.

#### Planning

Detailed mocks have been among the most valuable plans.

### Implicit Coupling

Some files are implicitly coupled using bracketed tags which can be grepped:

- [version] - Implicitly tied to the package.json version field.
- [palette] - Implicitly tied to palette.
- [strings] - Implicitly tied to translatable strings.

### Favicons and Manifest

The cache for each can be busted by incrementing the version.

### WebGL

WebGL v2 is used because it supports instancing, which seemed very convenient.
v1 also supports instancing but only when the ANGLE_instanced_arrays extension
is available. I may need to readdress this decision as I was surprised to
discover that [iOS only supports v1](#known-issues).

I think Impact uses the Canvas API for rendering. Since their premier (now
dated, I believe) [demo](https://playbiolab.com/) does not run well on my Linux
systems even windowed, I assume that it's not a good idea to pursue canvas
rendering.

Some games also use UI frameworks creatively for rendering. For example, moving
HTMLImageElements around in the DOM. I think this most probably doesn't scale
far and usually shows its seams so I didn't seriously consider it.

### Conventions

#### Readonly as Needed

Specifying everything as readonly by default works great when a type is always
immutable. However, for types that are mutable in certain circumstances or
composed as mutable in other objects, it ends up being a huge hassle and makes
it challenging to see which types are truly immutable. For this reason, unless a
type is always immutable, types and their properties are mutable by default and
opportunistically immutable and readonly.

#### Imports

Namespaces are favored because they:

- Give a pattern to every module that prevents naming conflicts and reduces
  cognitive load.
- Significantly improve automated refactors. VS Code understands namespaces well
  and reliably supports renaming as opposed to wildcard and default imports.
- Define grouping at declaration time and encourage its usage by consumers. This
  allows export naming to be terser given the context provided by the namespace
  name and doesn't require naming by the consumer.

PascalCase naming is used for namespaces and classes to avoid collision with
variables.

I wish TypeScript supported a syntax for declaring the current file to be within
a namespace without the burden of a file level indent.

When order is irrelevant, case-insensitive alphabetical is used.

#### Deep-ish Objects

Flat objects are often nice to work with, especially when writing configuration
files by hand. However, they seem to be harder to compose:

- TypeScript's type checker will accept any superset of a type for better and
  worse. E.g., a Rect type with x, y, w, and h members will match an XY or WH
  type with x and y or w and h members which can introduce extra properties
  unexpectedly by the spread and rest operators in particular. Grab-bag flat
  objects make this potential issue more prevalent.
- Flat objects prevent composing references for better and worse. For example, a
  a WH object cannot be composed by reference into a flat Rect object. This can
  be nice when you don't accidentally want to use a reference but pretty
  limiting when you do. E.g., perhaps all images should share the same size.
  This state management is trivial with a single reference but can be involved
  when using distinct value copies.
- Flat types seem more like inheritance than composed members. E.g., a flat Rect
  should probably be expressed as `interface Rect extends XY, WH {}` as opposed
  to a composition `interface Rect {readonly size: WH; readonly position: XY}`.

For these reasons, compositions are favored. The downsides seem to be:

- Verbose property accessors.
- Poor built-in support for deep immutable types.
- Greater opportunity to accidentally use mutable references.

#### Types vs Interfaces

The `type` syntax looks nicer than `interface` and allows `Readonly` wrappers.
Prettier also formats `interface` types more verbosely than single line `type`
types. However, VS Code presents types declared with `type` as property
collections. Types declared with `interface` syntax are presented as proper
named types. Given the lengthy printouts of types by TypeScript, interfaces are
preferred.

#### Classes and Utilities

Classes are used where polymorphic behavior or strong encapsulation is required.
Otherwise, functional utilities are used because they're far easier to compose
and tend to be more explicit and simpler.

For example, consider the following class:

```ts
export class Random {
  private _seed: number

  constructor(seed: number) {
    this._seed = seed % 0x7fff_ffff
    if (this._seed <= 0) this._seed += 0x7fff_ffff
  }

  float(): number {
    return this.int() / 0x7fff_fffe
  }

  int(): number {
    this._seed = (this._seed * 16_807) % 0x7fff_ffff
    return this._seed - 1
  }
}
```

And its usage:

```ts
import {Random} from './random'

function randomPoint(random: Random): XY {
  return {x: random.int(), y: random.int()}
}

const random = new Random(0)
let val = random.float()
console.log(val)
const point = randomPoint(random)
console.log(point)
val = random.int()
console.log(val)
```

Now the functional implementation:

```ts
export interface Random {
  readonly seed: number
  readonly val: number
}

export namespace Random {
  export function init(seed: number): number {
    seed = seed % 0x7fff_ffff
    if (seed <= 0) seed += 0x7fff_ffff
    return seed
  }

  export function float(seed: number): Random {
    return int(seed) / 0x7fff_fffe
  }

  export function int(seed: number): Random {
    seed = (seed * 16_807) % 0x7fff_ffff
    return {seed, val: seed - 1}
  }
}
```

And its usage:

```ts
import {Random} from './random'

function randomPoint(seed: number): Random {
  let x
  ;({seed, val: x} = Random.int(seed))
  let y
  ;({seed, val: y} = Random.int(seed))
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

Comparison:

- The number of lines of code and readability are similar.
- The usual tradeoff of explicit (functional) vs implicit (object-oriented)
  state is present but the object is quite tightly scoped so the negative impact
  of the latter is minimal.
- The functional approach requires a special seed-only state since there's no
  valid value at construction. The object-orient approach does a little bit of
  work in the constructor to avoid the intermediate seed-only state.
- A Random interface is provided for clients wishing to encapsulate the `val`
  and `seed` states in the functional version.
- `val` is used for the random number generated in the functional version.
  `random` was considered but a client may call their result object `random` and
  `random.random` doesn't read as nicely as `random.val`.
- In the functional version, it's extremely easy to forget to mutate Random's
  state. There's no encapsulation of seed and it must be managed explicitly. In
  my view, manually threading the seed in and out of _every_ function that
  depends on it is verbose, clumsy, fallible, and thoroughly unfun. It's easy to
  misuse functions like these when the programmer isn't in a "thinking about
  random" space.
- It is easy to misplace a number seed in a typed parameter less, less so a
  Random class. This reduces a great benefit of TypeScript.

The Random interface object could be passed as a mutable state bundle to each
function. These state parameters feel very object-oriented and remind me of
passing around a void pointer in the C language instead of using classes in C++,
doesn't have much distinction in TypeScript from actual classes, and may be an
indicator that a class syntax should be considered.

In this case, I would favor the class. For a stateless parser, for example, I
would favor a utility.

#### Closures vs Classes

It may be contentious but I think the distinctions between closure-built objects
and classes in TypeScript are too similar to be a major factor:

```ts
function newFoo(bar: number) {
  return {
    bar() {
      return bar
    }
  }
}
```

```ts
class Foo {
  constructor(private readonly bar: number) {}
  bar() {
    return this.bar
  }
}
```

Although easier in functional programming, I can usually make a class immutable
and I favor composition over inheritance. I prefer the class.

#### Parts of JavaScript and TypeScript to Avoid

- I try not to use null. I think there's a whole article about why it's
  generally unnecessary by the TypeScript folks that I agreed with.
- I always use strict equality checking (`===`) to avoid thinking about type
  coercion.
- I want to use ESLint. It's useful. However, it needs and allows too much
  configuration to make it worthwhile for me. I want an ESLint config that
  draws red lines under almost certain bugs and lets Prettier do the rest
  without any muss. It feels like almost a Webpack level of complexity and
  requires a much deeper understanding of JavaScript and the ESLint ecosystem
  than I want to have.
- Don't build intricately. Build for the idiot that comes in next day, tired,
  clueless, and not too sharp. That idiot is future me.
- Prototypal inheritance over classical inheritance. When I first started
  JavaScripting, I was sad to learn that classes were added given how highly
  prototypal inheritance was touted by some. The old school guard of legends
  seemed to think that prototypes were the bee's knees and maybe even more. That
  was a different time and thankfully the extensive foundational framework that
  is installed at the beginning of "JavaScript: The Good Parts" no longer seems
  necessary. I now think that proper class support is a big improvement for
  taking an inheritance approach. I just don't want to think about any kind of
  inheritance though, generally, but most especially custom frameworks mixed
  with weird language quirks. Further, I think a lot of pre-ES6 materials are
  examples of what _not_ to do in modern JavaScript, unfortunately.
- I avoid inheritance in general in favor of composition. Entities inherit but
  I think it's worth it in that case.
- I try to avoid touching the prototype chain except through classes. It sounds
  complicated and I want to avoid inheritance.

#### Typing

I try to type at the seams. Everything at file scope.

#### Formatting

Prettier does such consistent formatting that braceless ifs and loops are
perfectly fine. No matter how guttural the input, the indentation is never
misleading. Code isn't always formatted ideally, especially given that
TypeScript typing is more verbose than untyped JavaScript, but I think that
guaranteeing code will never be misleading is magnificent and opens up the
syntax available to the full capacity of the language's apparent design intents.

I've also appreciated that Prettier supports related languages likely to appear
in a JavaScript project, such as HTML and Markdown.

I generally wish their was a way to favor a more compact formatting. In some
cases, I've changed my writing to favor a particular formatting. On occasion,
using types instead of interfaces, arrow functions instead of functions, and
trying to minimize the verbosity of typing by aliasing the subject type to "t"
or adding extra locals. I've opened [allow function parameters to share the next
newline](https://github.com/prettier/prettier/issues/6573) which tracks one of
the most common issues I encounter.

Overall, Prettier is an amazing tool, changes the way I write for the better,
and improves my quality of life.

#### Naming

Previously, I tried to use as generic naming as possible with the idea that the
program's pattern would read more clearly, no updates would be necessary on copy
and paste, and I wouldn't have to think too much about naming any more. I also
had the probably misguided idea that somehow this style would be a bit more
clinical or consistently purer, and that it had some relation to tacit
programming / point-free style.

For example, instead of calling an array of books, `books`, I might have called
it, `arr`. Three more examples: always call the return value `ret`, the
accumulator argument to reduce `sum`, and the subject of a test, `subject`.

I think this consistency can work ok for a single variable like `ret` or
`subject` but that it's a terrible idea when applied broadly to a program:

- Names frequently clash, especially when nesting.
- Even when names don't clash, identical names pointing to different data often
  neighbor each other. This creates confusion and would be hopeless to sort out
  without typing.
- Understanding the context of a given piece of code requires reading a larger
  passage of it.

For these reasons, I now favor the natural habit of calling things what they are
instead of more abstract terms.

##### Abbreviations

The following abbreviations are used regardless of context except for types:

- config: a configuration, usually JSON imported from a local file.
- dat: data.
- doc: document, usually the Web global.
- ev: event, usually from the Web API.
- fn: function.
- init: initialize, initial value.
- len: length.
- max: maximum.
- min: minimum.
- obj: object.
- rect: rectangle.
- win: window, usually the Web global.

The following abbreviations are only used for function parameters and locals:

- lhs: left-hand side (of an operand)
- rhs: right-hand side (of an operand)
- val: unambiguous input, bundle state, or primary input value
- i: unambiguous index

##### Terminology

- atlas: a composite texture.
- bounds: having a position and size (usually a [`Rect`](src/math/Rect.ts)).
- length: usually the number of elements in a collection.
- location: a WebGL shader program variable index.
- new / make: like the `new` operator; new is preferred where the language
  allows.
- position: an _x_ and _y_ cartesian location (usually an
  [`XY`](src/math/XY.ts)).
- size: an area (usually a [`WH`](src/math/WH.ts)) or size in bytes like
  `sizeof` in the C programming language.
- WH: having width and height.
- XY: having _x_- and _y_-coordinate dimensions such as a position.

## Known Issues

- iOS devices are unsupported presently as they cannot run WebGL v2 without
  enabling an experimental setting. I don't think it would be too difficult to
  downgrade Nature Elsewhere to v1 with the ANGLE_instanced_arrays extension but
  who knows so I'm going to race Apple. If everything else in Nature Elsewhere
  is done, or I just want to procrastinate, I'll do the downgrade. If I do it
  before Apple releases default support for v2, I win the race.
- [Switching apps on Android may show a big white bar on the bottom of the
  screen](https://crbug.com/1013888). If this is still an issue when Nature
  Elsewhere is otherwise complete, I'll consider removing the landscape request
  in the web manifest so that an orientation change will fix the issue. Or maybe
  I can keep looking for a workaround.

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

```
╭>°╮┌─╮┌─╮╭─╮┬┌─╮
│  ││ ││ ││ │││ │
╰──╯└─╯└─╯╰─╯┴└─╯
```
