#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // width (x), height (y) in pixels.

in vec2 vSource;

out vec4 frag;

void main() {
  frag = texture(atlas, vSource / vec2(atlasSize));
}
