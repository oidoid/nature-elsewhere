export default `
#version 300 es
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;

in ivec2 uv; // x, y (0-1).
in ivec4 sourceCoord; // x, y, z (width), and w (height) in pixels.
in ivec4 targetCoord;  // x, y, z (width), and w (height) in pixels.
in ivec2 scrollPosition; // x, y (px).
in ivec2 scale; // x, y.
in int palette; // x, y. Only an int instead of a uint to simplify typing.

flat out ivec4 vSourceCoord;
out vec2 vScrollPosition;
flat out uint vPalette;

void main() {
  ivec2 wh = uv * targetCoord.zw * abs(scale);
  gl_Position = vec4(targetCoord.xy + wh, 0, 1) * projection;

  vSourceCoord = sourceCoord;
  vScrollPosition = vec2((scrollPosition + uv * targetCoord.zw) * sign(scale));
  vPalette = uint(palette);
}
`
