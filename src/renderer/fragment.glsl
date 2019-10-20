#version 300 es
precision mediump int;
precision highp float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // width (x), height (y) in pixels.

flat in ivec4 vSource;
flat in ivec4 vConstituent;
flat in uint vComposition;
in vec2 vOffset;

const uint COMPOSITION_SOURCE = 0u;
const uint COMPOSITION_SOURCE_MASK = 1u;
const uint COMPOSITION_SOURCE_IN = 2u;

out vec4 frag;

void main() {
  vec2 sourcePosition = vec2(vSource) + trunc(mod(vOffset, vec2(vSource.zw)));
  vec4 sourcePx = texture(atlas, sourcePosition / vec2(atlasSize));
  vec2 constituentPosition = vec2(vConstituent) + trunc(mod(vOffset, vec2(vConstituent.zw)));
  vec4 constituentPx = texture(atlas, constituentPosition / vec2(atlasSize));

  if (vComposition == COMPOSITION_SOURCE) {
    frag = vec4(constituentPx.rgb, sourcePx.a);
  } else if (vComposition == COMPOSITION_SOURCE_MASK) {
    frag = vec4(constituentPx.rgb, sourcePx.a);
  } else if (vComposition == COMPOSITION_SOURCE_IN) {
    frag = vec4(constituentPx.rgb, sign(sourcePx.a) * sign(constituentPx.a));
  }
}
