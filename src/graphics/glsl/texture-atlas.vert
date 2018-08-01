#version 300 es
precision mediump int;
precision mediump float;

// x, y, z (width), and w (height) in pixels. This can be thought of as the
// camera's x and y coordinates and the render resolution (width and height).
uniform vec4 viewport;

in vec2 uv; // x, y (0-1).
in vec4 texCoord; // x, y, z (width), and w (height) in pixels.
in vec2 texScroll; // x, y (px).
in vec2 texScale; // x, y.
in vec3 position;  // x, y in pixels and z (depth).

out vec4 vTexCoord;
out vec2 vTexScroll;

void main() {
  // Convert pixels to clipspace.
  vec2 px = position.xy + max(vec2(0, 0), texCoord.zw * uv * (texScale - vec2(1., 1.))) + viewport.xy; // Scale from pixels to 0 to 1.
  // Scale to 0 - 2 and translate to -1 to 1.
  vec2 clipspace = (2. * px  / viewport.zw - 1.) * vec2(1, -1);


  gl_Position = vec4(clipspace, position.z, 1); // less than 1 to zoom

  vTexCoord = texCoord;
  vTexScroll = (uv * texCoord.zw + texScroll) * sign(texScale);
}
