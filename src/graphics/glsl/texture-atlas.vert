#version 300 es
precision mediump int;
precision mediump float;

const int MAX_DEPTH = 1000;

// The camera's position (x, y) and width and height (z, w) in pixels.
uniform ivec4 cam;

in ivec2 uv; // x, y (0-1).
in ivec4 coord; // x, y, z (width), and w (height) in pixels.
in ivec2 scrollPosition; // x, y (px).
in ivec2 scale; // x, y.
in ivec3 position;  // x, y in pixels and z (depth).

flat out ivec4 vCoord;
out vec2 vScrollPosition;

void main() {
  ivec2 px = cam.xy + position.xy + uv * coord.zw * abs(scale);

  // Convert the pixels to clipspace by taking them as a fraction of the cam
  // resolution, scaling to 0-2, translating to -1 to 1, and flipping the y
  // -coordinate so that positive y is downward.
  vec2 clipspace = (2. * vec2(px)  / vec2(cam.zw) - 1.) * vec2(1, -1);

  gl_Position = vec4(clipspace, position.z / MAX_DEPTH, 1);

  vCoord = coord;
  vScrollPosition = vec2((scrollPosition + uv * coord.zw) * sign(scale));
}
