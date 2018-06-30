uniform struct Viewport { // change to Camera
  vec2 resolution; // In pixels. chage to wh
  vec2 camera; // In pixels. change to xy
} uViewport;

attribute vec3 aVertex; // In pixels except for z.
attribute vec2 aTextureCoords; // In units of 0 to 1.
uniform vec2 uScale;
uniform vec2 uTextureBounds; // In pixels.

varying vec2 vTextureBounds; // In pixels.
varying vec2 vScale;
varying vec2 vTextureCoords;

void main() {
  // Convert pixels to clipspace.
  vec2 ratio = (aVertex.xy + max(vec2(0, 0), uTextureBounds * aTextureCoords * (uScale - vec2(1., 1.))) + uViewport.camera) / uViewport.resolution; // Scale from pixels to 0 to 1.
  vec2 flipY = vec2(1, -1); // Invert the y-coordinate
  // Scale to 0 - 2 and translate to -1 to 1.
  vec2 clipspace = (2. * ratio - 1.) * flipY;
  gl_Position = vec4(clipspace, aVertex.z, 1); // less than 1 to zoom

  vTextureCoords = aTextureCoords;
  vScale = uScale;
  vTextureBounds = uTextureBounds;
}
