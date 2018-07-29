#version 300 es
precision mediump int;
precision mediump float;

// x, y, z (width), and w (height) in pixels. This can be thought of as the
// camera's x and y coordinates and the render resolution (width and height).
uniform vec4 uViewport;

in vec2 aAtlasSize; // In pixels.
in vec4 aTextureRect; // x, y, z (width), and w (height) in pixels.
in vec2 aTextureScroll; // In pixels.
in vec2 aTextureScale; // Scalar.
in vec2 aTextureUV; // Scalar (0 - 1).
in vec3 aVertex; // In pixels except for z.

out vec2 vAtlasSize;
out vec4 vTextureRect;
out vec2 vTextureScroll;
out vec2 vTextureScale;
out vec2 vTextureUV;

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
