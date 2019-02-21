#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // x (width), y (height) (px).
uniform sampler2D palettes;
uniform ivec2 palettesSize; // x (width), y (height) (px).

flat in ivec4 vSource;
in vec2 vMask;
in vec2 vOffset;
flat in uint vPalette;

out vec4 frag;

void main() {
  vec2 position = vec2(vSource) + mod(vOffset, vec2(vSource.zw));
  vec4 px = texture(atlas, position / vec2(atlasSize));
  vec4 maskPx = texture(atlas, vMask / vec2(atlasSize));
  // Each component of px is a fraction in [0, 1]. Multiply by 256 to convert to
  // the palette color index.
  vec2 index = vec2(int(256. * px.a) % 8 + int(vPalette), 0) / vec2(palettesSize);

  vec4 color = texture(palettes, index);
  // Multiply by one when inside mask, zero when outside.
  color.a *= sign(maskPx.a);

  frag = color;
}
