#version 300 es
precision mediump int;
precision highp float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // width (x), height (y) in pixels.

flat in ivec4 vSourceAlpha;
flat in ivec4 vSourceColor;
in vec2 vOffset;

out vec4 frag;

void main() {
  vec2 alphaPosition = vec2(vSourceAlpha) + trunc(mod(vOffset, vec2(vSourceAlpha.zw)));
  vec4 alphaPx = texture(atlas, alphaPosition / vec2(atlasSize));
  vec2 colorPosition = vec2(vSourceColor) + trunc(mod(vOffset, vec2(vSourceColor.zw)));
  vec4 colorPx = texture(atlas, colorPosition / vec2(atlasSize));
  frag = vec4(colorPx.rgb, alphaPx.a);
}
