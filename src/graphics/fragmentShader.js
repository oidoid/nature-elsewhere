export default `
#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

uniform sampler2D sampler;
uniform ivec2 atlasSize; // x, y (px).

flat in ivec4 vCoord;
in vec2 vScrollPosition;

out vec4 frag;

void main() {
  vec2 px = vec2(vCoord.xy) + mod(vScrollPosition, vec2(vCoord.zw));
  frag = texture(sampler, px / vec2(atlasSize));
}
`
