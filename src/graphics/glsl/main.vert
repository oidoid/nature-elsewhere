uniform vec2 uResolution; // In pixels.
uniform vec2 uCamera; // In pixels.

attribute vec2 aVertex; // In pixels.
attribute vec2 aTextureCoords;

varying vec2 vTextureCoords;

void main() {
  // Convert pixels to clipspace.
  vec2 ratio = (aVertex + uCamera) / uResolution; // Scale from pixels to 0 to 1.
  vec2 flipY = vec2(1, -1); // Invert the y-coordinate
  // Scale to 0 - 2 and translate to -1 to 1.
  vec2 clipspace = (2. * ratio - 1.) * flipY;
  gl_Position = vec4(clipspace, 0, 1);

  vTextureCoords = aTextureCoords;
}