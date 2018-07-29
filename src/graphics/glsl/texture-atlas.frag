#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uSampler;
uniform vec2 uAtlasSize; // x, y in pixels.

in vec4 vSubTexCoord;
in vec2 vTexScroll;

out vec4 frag;

void main() {
  vec2 px = vSubTexCoord.xy + mod(vTexScroll, vSubTexCoord.zw);
  frag = texture(uSampler, px / uAtlasSize);
}
