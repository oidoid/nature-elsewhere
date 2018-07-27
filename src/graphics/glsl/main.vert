// x, y, z (width), and w (height) in pixels. This can be thought of as the
// camera's x and y coordinates and the render resolution (width and height).
uniform vec4 uViewport;

attribute vec2 aAtlasSize; // In pixels.
attribute vec4 aTextureRect; // x, y, z (width), and w (height) in pixels.
attribute vec2 aTextureScroll; // In pixels.
attribute vec2 aTextureScale; // Scalar.
attribute vec2 aTextureUV; // Scalar (0 - 1).
attribute vec3 aVertex; // In pixels except for z.

varying vec2 vAtlasSize;
varying vec4 vTextureRect;
varying vec2 vTextureScroll;
varying vec2 vTextureScale;
varying vec2 vTextureUV;

void main() {
  // Convert pixels to clipspace.
  vec2 ratio = (aVertex.xy + max(vec2(0, 0), aTextureRect.zw * aTextureUV * (aTextureScale - vec2(1., 1.))) + uViewport.xy) / uViewport.zw; // Scale from pixels to 0 to 1.
  vec2 flipY = vec2(1, -1); // Invert the y-coordinate
  // Scale to 0 - 2 and translate to -1 to 1.
  vec2 clipspace = (2. * ratio - 1.) * flipY;
  gl_Position = vec4(clipspace, aVertex.z, 1); // less than 1 to zoom

  vAtlasSize = aAtlasSize;
  vTextureRect = aTextureRect;
  vTextureScroll = aTextureScroll;
  vTextureScale = aTextureScale;
  vTextureUV = aTextureUV;
}
