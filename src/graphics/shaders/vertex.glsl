#version 300 es
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;
uniform float time;

in ivec2 uv; // x, y (0 or 1).
in ivec4 source; // x, y, width (z), and height (w) in pixels.
in ivec4 target; // x, y, scaled width (z) and height (w) in pixels.
in ivec2 scale; // x, y in pixels.
in ivec4 translate; // Translation (x, y) and translation velocity (z, w) in pixels.

flat out ivec4 vSource;
out vec2 vOffset;

void main() {
  // Offset flipped images by their width or height.
  gl_Position = vec4(target.xy + uv * target.zw, 0, 1) * projection;
  vSource = source;
  vec2 offset = vec2(translate.xy - uv * target.zw) / vec2(-scale) + vec2(translate.zw) * time / vec2(-1000 * scale);
  offset = offset - mod(offset, 1. / vec2(abs(scale)));
  vOffset = offset;
}
