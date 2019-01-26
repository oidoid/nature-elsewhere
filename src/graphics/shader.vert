#version 300 es
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;

in ivec2 uv; // x, y (0-1).
in ivec4 source; // x, y, z (width), and w (height) in pixels.
in ivec4 target; // x, y, z (width), and w (height) in pixels.
in ivec4 mask;  // x, y, z (width), and w (height) in pixels.
in ivec2 offset; // x, y (px).
in ivec2 scale; // x, y.
in uint palette;

flat out ivec4 vSource;
out vec2 vMask;
out vec2 vOffset;
flat out uint vPalette;

void main() {
  ivec2 wh = uv * target.zw * abs(scale);
  gl_Position = vec4(target.xy + wh, 0, 1) * projection;

  vSource = source;
  vMask = vec2(mask.xy + uv * mask.zw);
  vOffset = vec2((offset + uv * target.zw) * sign(scale));
  vPalette = palette;
}
