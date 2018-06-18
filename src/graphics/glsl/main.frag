precision mediump float;

uniform vec2 uAtlasBounds; // In pixels.
uniform vec2 uScale;
uniform vec2 uTextureBounds; // In pixels.
uniform vec2 uTexturePosition; // In pixels.
uniform vec2 uTextureScroll; // In pixels.
uniform sampler2D uTexture;

varying vec2 vTextureCoords;

void main() {
  vec2 scroll = vTextureCoords * uTextureBounds * uScale + uTextureScroll;
  vec2 wrap = (uTexturePosition + mod(scroll, uTextureBounds)) / uAtlasBounds;
  gl_FragColor = texture2D(uTexture, wrap);
}
