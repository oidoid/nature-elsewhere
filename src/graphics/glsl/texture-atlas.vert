#version 300 es
precision mediump int;
precision mediump float;

// The camera's position (x, y) and width and height (z, w) in pixels.
uniform vec4 cam;

in vec2 uv; // x, y (0-1).
in vec4 coord; // x, y, z (width), and w (height) in pixels.
in vec2 scrollPosition; // x, y (px).
in vec2 scale; // x, y.
in vec3 position;  // x, y in pixels and z (depth).

out vec4 vCoord;
out vec2 vScrollPosition;

void main() {
  vec2 px = cam.xy + position.xy + uv * coord.zw * abs(scale);

  // Describe the pixels as ratio of the resolution, scale to 0-2, translate to
  // -1 to 1, and flip the y.
  vec2 clipspace = (2. * px  / cam.zw - 1.) * vec2(1, -1);

  gl_Position = vec4(clipspace, position.z, 1);

  vCoord = coord;
  vScrollPosition = (scrollPosition + uv * coord.zw) * sign(scale);
}
