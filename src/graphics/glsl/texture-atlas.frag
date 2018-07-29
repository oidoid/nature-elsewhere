#version 300 es
precision mediump int;
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uSampler;

in vec2 vAtlasSize;
in vec4 vTextureRect;
in vec2 vTextureUV;

in vec2 vTextureScroll;
in vec2 vTextureScale;

out vec4 frag;

void main() {
  vec2 scroll = vTextureUV * vTextureRect.zw * vTextureScale / abs(vTextureScale) + vTextureScroll;
  vec2 wrap = (vTextureRect.xy + mod(scroll, vTextureRect.zw)) / vAtlasSize;
  frag = texture(uSampler, wrap);
}
