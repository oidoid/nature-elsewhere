precision mediump float;

uniform vec2 uAtlasBounds;
uniform vec2 uTextureBounds;
uniform vec2 uTexturePosition;
uniform vec2 uTextureOffset;
uniform sampler2D uTexture;

varying vec2 vTextureCoords;

void main() {
  vec2 offset = vTextureCoords * uTextureBounds + uTextureOffset;
  vec2 wrap = (uTexturePosition + mod(offset, uTextureBounds)) / uAtlasBounds;
  gl_FragColor = texture2D(uTexture, wrap);
}
