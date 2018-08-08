#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

uniform sampler2D sampler;
uniform vec2 atlasSize; // x, y (px).

in vec4 vCoord;
in vec2 vScrollPosition;

out vec4 frag;

void main() {
  vec2 px = vCoord.xy + mod(vScrollPosition, vCoord.zw);
  frag = texture(sampler, px / atlasSize);
}
