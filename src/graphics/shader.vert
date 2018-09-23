#version 300 es
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;

in ivec2 uv; // x, y (0-1).
in ivec4 coord; // x, y, z (width), and w (height) in pixels.
in ivec2 scrollPosition; // x, y (px).
in ivec2 scale; // x, y.
in ivec2 position;  // x, y (px).

flat out ivec4 vCoord;
out vec2 vScrollPosition;

void main() {
  ivec2 wh = uv * coord.zw * abs(scale);
  gl_Position = vec4(position + wh, 0, 1) * projection;

  vCoord = coord;
  vScrollPosition = vec2((scrollPosition + uv * coord.zw) * sign(scale));
}
