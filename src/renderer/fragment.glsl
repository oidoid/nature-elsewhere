#version 300 es
precision mediump int;
precision highp float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // width (x), height (y) in pixels.

flat in ivec4 vSource;
flat in ivec4 vImage;
flat in uint vComposition;
in vec2 vOffset;

const uint ALPHA_COMPOSITION_IMAGE = 0u;
const uint ALPHA_COMPOSITION_SOURCE_MASK = 1u;
const uint ALPHA_COMPOSITION_AND = 2u;

out vec4 frag;

void main() {
  vec2 sourcePosition = vec2(vSource) + trunc(mod(vOffset, vec2(vSource.zw)));
  vec4 sourcePx = texture(atlas, sourcePosition / vec2(atlasSize));
  vec2 imagePosition = vec2(vImage) + trunc(mod(vOffset, vec2(vImage.zw)));
  vec4 imagePx = texture(atlas, imagePosition / vec2(atlasSize));

  if (vComposition == ALPHA_COMPOSITION_IMAGE) {
    frag = vec4(imagePx.rgb, imagePx.a);
  } else if (vComposition == ALPHA_COMPOSITION_SOURCE_MASK) {
    frag = vec4(imagePx.rgb, sourcePx.a);
  } else if (vComposition == ALPHA_COMPOSITION_AND) {
    frag = vec4(imagePx.rgb, sign(sourcePx.a) * sign(imagePx.a));
  }
}
