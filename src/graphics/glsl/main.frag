precision mediump float;

uniform vec2 uAtlasBounds;
uniform vec2 uScale;
uniform vec2 uTextureBounds;
uniform vec2 uTexturePosition;
uniform vec2 uTextureScroll;
uniform sampler2D uTexture;

varying vec2 vTextureCoords;

void main() {
  vec2 scroll = vTextureCoords * uTextureBounds * uScale + uTextureScroll;
  vec2 wrap = (uTexturePosition + mod(scroll, uTextureBounds)) / uAtlasBounds;
  gl_FragColor = texture2D(uTexture, wrap);
}
