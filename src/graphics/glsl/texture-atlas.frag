#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

uniform sampler2D sampler;
uniform vec2 atlasSize; // x, y (px).

in vec4 vTexCoord;
in vec2 vTexScroll;

out vec4 frag;

void main() {
  vec2 px = vTexCoord.xy + mod(vTexScroll, vTexCoord.zw);
  frag = texture(sampler, px / atlasSize);
}
