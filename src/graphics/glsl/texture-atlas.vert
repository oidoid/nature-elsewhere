#version 300 es
precision mediump int;
precision mediump float;

// x, y, z (width), and w (height) in pixels. This can be thought of as the
// camera's x and y coordinates and the render resolution (width and height).
uniform vec4 uViewport;

in vec4 aSubTexCoord; // x, y, z (width), and w (height) in pixels.
in vec2 aTexScroll; // In pixels.
in vec2 aSubTexScale; // Scalar.
in vec2 aTextureUV; // Scalar (0 - 1).
in vec3 aPosition; // In pixels except for z.

out vec4 vSubTexCoord;
out vec2 vTexScroll;

void main() {
  // Convert pixels to clipspace.
  vec2 ratio = (aPosition.xy + max(vec2(0, 0), aSubTexCoord.zw * aTextureUV * (aSubTexScale - vec2(1., 1.))) + uViewport.xy) / uViewport.zw; // Scale from pixels to 0 to 1.
  vec2 flipY = vec2(1, -1); // Invert the y-coordinate
  // Scale to 0 - 2 and translate to -1 to 1.
  vec2 clipspace = (2. * ratio - 1.) * flipY;
  gl_Position = vec4(clipspace, aPosition.z, 1); // less than 1 to zoom

  vSubTexCoord = aSubTexCoord;
  vTexScroll = aTextureUV * aSubTexCoord.zw * sign(aSubTexScale) + aTexScroll;
}
