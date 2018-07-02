// x, y, z (width), and w (height) in pixels. This can be thought of as the
// camera's x and y coordinates and the render resolution (width and height).
uniform vec4 uViewport;

uniform vec2 uAtlasBounds; // In pixels.
uniform vec4 uTextureRect; // x, y, z (width), and w (height) in pixels.
attribute vec2 aTextureUV; // Scalar (0 - 1).

attribute vec3 aVertex; // In pixels except for z.
uniform vec2 uTextureScroll; // In pixels.
uniform vec2 uTextureScale; // Scalar.

varying vec2 vAtlasBounds;
varying vec4 vTextureRect;
varying vec2 vTextureUV;

varying vec2 vTextureScroll;
varying vec2 vTextureScale;

void main() {
  // Convert pixels to clipspace.
  vec2 ratio = (aVertex.xy + max(vec2(0, 0), uTextureRect.zw * aTextureUV * (uTextureScale - vec2(1., 1.))) + uViewport.xy) / uViewport.zw; // Scale from pixels to 0 to 1.
  vec2 flipY = vec2(1, -1); // Invert the y-coordinate
  // Scale to 0 - 2 and translate to -1 to 1.
  vec2 clipspace = (2. * ratio - 1.) * flipY;
  gl_Position = vec4(clipspace, aVertex.z, 1); // less than 1 to zoom

  vAtlasBounds = uAtlasBounds;
  vTextureRect = uTextureRect;
  vTextureUV = aTextureUV;

  vTextureScroll = uTextureScroll;
  vTextureScale = uTextureScale;
}
