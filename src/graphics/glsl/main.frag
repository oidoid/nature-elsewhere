precision mediump float;

uniform sampler2D uTexture;

varying vec2 vAtlasBounds;
varying vec4 vTextureRect;
varying vec2 vTextureUV;

varying vec2 vTextureScroll;
varying vec2 vTextureScale;

void main() {
  vec2 scroll = vTextureUV * vTextureRect.zw * vTextureScale / abs(vTextureScale) + vTextureScroll;
  vec2 wrap = (vTextureRect.xy + mod(scroll, vTextureRect.zw)) / vAtlasBounds;
  gl_FragColor = texture2D(uTexture, wrap);
}
