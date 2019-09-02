#version 300 es
precision mediump int;
precision highp float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // width (x), height (y) in pixels.

flat in ivec4 vSource;
in vec2 vOffset;

out vec4 frag;

void main() {
  vec2 position = vec2(vSource) + trunc(mod(vOffset, vec2(vSource.zw)));
  frag = texture(atlas, position / vec2(atlasSize));
}
