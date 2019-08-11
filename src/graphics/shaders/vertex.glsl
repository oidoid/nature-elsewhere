#version 300 es
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;
uniform float time;

in ivec2 uv; // x, y (0 or 1).
in ivec4 source; // x, y, width (z), and height (w) in pixels.
in ivec2 position; // x, y in pixels.
in ivec2 scale; // x, y in pixels.
in ivec4 translate; // Translation (x, y) and translation velocity (z, w) in pixels.

flat out ivec4 vSource;
out vec2 vOffset;

void main() {
  // Offset flipped images by their width or height.
  ivec2 flip = -min(scale, 0) * source.zw;
  gl_Position = vec4(position + flip + uv * scale * source.zw, 0, 1) * projection;
  vSource = source;
  vOffset = trunc(vec2(translate) + vec2(translate.zw) * time / 1000. + vec2(uv * source.zw));
}
