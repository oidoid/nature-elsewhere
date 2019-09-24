#version 300 es
precision mediump int;
precision highp float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // width (x), height (y) in pixels.

flat in ivec4 vSource;
in vec2 vOffset;
flat in ivec4 vColorSource;

out vec4 frag;

void main() {
  vec2 position = vec2(vSource) + trunc(mod(vOffset, vec2(vSource.zw)));
  vec4 mask = texture(atlas, position / vec2(atlasSize));
  vec4 color = texture(atlas, (vec2(vColorSource) + trunc(mod(vOffset, vec2(vColorSource.zw)))) / vec2(atlasSize));
  color.a *= sign(mask.a);
  frag = color;
}
