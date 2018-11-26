export default `
#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // x, y (px).
uniform sampler2D palettes;
uniform ivec2 palettesSize; // x, y (px).

flat in ivec4 vSourceCoord;
in vec2 vScrollPosition;
flat in uint vPalette;

out vec4 frag;

void main() {
  vec2 position = vec2(vSourceCoord.xy) + mod(vScrollPosition, vec2(vSourceCoord.zw));
  vec4 px = texture(atlas, position / vec2(atlasSize));
  // Each component of px is a fraction in [0, 1]. Multiply by 256 to convert to
  // the palette color index.
  vec2 index = vec2(px.a * 256., float(vPalette)) / vec2(palettesSize);
  frag = texture(palettes, index);
}
`
