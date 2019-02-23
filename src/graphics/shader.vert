#version 300 es
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;

in ivec2 uv; // x, y (0-1).
in ivec4 source; // x, y, z (width), and w (height) in pixels.
in ivec4 target; // x, y, and scaled z (width), and w (height) in pixels.
in ivec2 offset; // x, y (px).
in ivec2 scale; // x, y. Divide target width and height by scale to obtain
                // prescaled dimensions.
in ivec4 maskSource;  // x, y, z (width), and w (height) in pixels.
in ivec2 maskOffset; // x, y (px).
in uint palette;

flat out ivec4 vSource;
out vec2 vOffset;
flat out ivec4 vMaskSource;
out vec2 vMaskOffset;
flat out uint vPalette;

void main() {
  ivec2 wh = uv * target.zw;
  gl_Position = vec4(target.xy + wh, 0, 1) * projection;

  vSource = source;
  vOffset = vec2(offset + uv * target.zw / scale);
  vMaskSource = maskSource;
  vMaskOffset = vec2(maskOffset + uv * target.zw / scale);
  vPalette = palette;
}
