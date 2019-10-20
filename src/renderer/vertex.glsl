#version 300 es
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;
uniform uint time;

in ivec2 uv; // x, y (0 or 1).
// The subimage location and dimensions within the atlas given in pixel
// coordinates. x, y, width (z), and height (w) in pixels. Alpha (or masking) is
// taken from sourceAlpha and coloring (RGB) is taken from sourceColor. For
// unmasked images, sourceAlpha and sourceColor are the same.
in ivec4 source;
in ivec4 constituent;
in uint composition;
// The rendered destination and dimensions in level pixel coordinates. x, y,
// scaled width (z) and scaled height (w) in pixels. When the destination width
// and height is not equal to the source width and height times scale, the
// rendered result is the source truncated or repeated.
in ivec4 target;
in ivec2 scale;
in ivec4 translate; // Translation (x, y) and translation velocity (z, w) in
                    // units of 1/10000 pixels.

flat out ivec4 vSource;
flat out ivec4 vConstituent;
flat out uint vComposition;
out vec2 vOffset;

void main() {
  // Offset flipped images by their width or height.
  gl_Position = vec4(target.xy + uv * target.zw, 1, 1) * projection;
  vSource = source;
  vConstituent = constituent;
  vComposition = composition;
  vOffset = (vec2(-translate.xy + uv * target.zw) - vec2(translate.zw) * float(time) / 10000.) / vec2(scale);
  vOffset = vOffset - mod(vOffset, 1. / vec2(abs(scale)));
}
