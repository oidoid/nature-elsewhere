#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

// The maximum number of colors in a sub-texture / sub-image / tile.
const mediump int paletteBankSize = 8;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // x (width), y (height) (px).
uniform sampler2D palette;
uniform ivec2 paletteSize; // x (width), y (height) (px).

flat in ivec4 vSource;
flat in ivec4 vMaskSource;
in vec2 vMaskOffset;
in vec2 vOffset;
flat in uint vPaletteIndex;

out vec4 frag;

void main() {
  vec2 position = vec2(vSource) + mod(vOffset, vec2(vSource.zw));
  // Obtain the pixel for position. Its RGBA color encodes the color index.
  vec4 px = texture(atlas, position / vec2(atlasSize));

  // Each component of px is a fraction in [0, 1]. Multiply by 256 to convert to
  // the palette color index.
  vec2 index = vec2(int(256. * px.a) % paletteBankSize + int(vPaletteIndex), 0) / vec2(paletteSize);

  // Convert the index number to a renderable RGBA pixel color from the palette.
  vec4 color = texture(palette, index);

  // Multiply alpha by one (no-op) when inside mask, zero when outside.
  vec2 maskPosition = vec2(vMaskSource) + mod(vMaskOffset, vec2(vMaskSource.zw));
  vec4 maskPx = texture(atlas, maskPosition / vec2(atlasSize));
  color.a *= sign(maskPx.a);

  frag = color;
}
