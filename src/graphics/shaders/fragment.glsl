#version 300 es
precision mediump int;
precision highp float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // width (x), height (y) in pixels.

flat in ivec4 vSource;
flat in ivec4 vMask;
flat in uint vComposition;
in vec2 vOffset;

const uint ALPHA_COMPOSITION_SOURCE = 0u;
const uint ALPHA_COMPOSITION_MASK = 1u;
const uint ALPHA_COMPOSITION_AND = 2u;

out vec4 frag;

void main() {
  vec2 sourcePosition = vec2(vSource) + trunc(mod(vOffset, vec2(vSource.zw)));
  vec4 sourcePx = texture(atlas, sourcePosition / vec2(atlasSize));
  vec2 maskPosition = vec2(vMask) + trunc(mod(vOffset, vec2(vMask.zw)));
  vec4 maskPx = texture(atlas, maskPosition / vec2(atlasSize));

  if (vComposition == ALPHA_COMPOSITION_SOURCE) {
    frag = vec4(sourcePx.rgb, sourcePx.a);
  } else if (vComposition == ALPHA_COMPOSITION_MASK) {
    frag = vec4(sourcePx.rgb, maskPx.a);
  } else if (vComposition == ALPHA_COMPOSITION_AND) {
    frag = vec4(sourcePx.rgb, sign(sourcePx.a) * sign(maskPx.a));
  }
}
