#version 100

#define COMPOSITION_SOURCE 0.
#define COMPOSITION_SOURCE_MASK 1.
#define COMPOSITION_SOURCE_IN 2.

precision mediump int;
precision highp float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlasSize; // width (x), height (y) in pixels.

varying vec4 vSource;
varying vec4 vConstituent;
varying float vComposition;
varying vec2 vOffset;

void main() {
  vec2 sourcePosition = vSource.xy + vec2(ivec2(mod(vOffset, vec2(vSource.zw))));
  vec4 sourcePx = texture2D(atlas, sourcePosition / vec2(atlasSize));
  vec2 constituentPosition = vConstituent.xy + vec2(ivec2(mod(vOffset, vec2(vConstituent.zw))));
  vec4 constituentPx = texture2D(atlas, constituentPosition / vec2(atlasSize));

  if (vComposition == COMPOSITION_SOURCE) {
    gl_FragColor = vec4(sourcePx.rgb, sourcePx.a);
  } else if (vComposition == COMPOSITION_SOURCE_MASK) {
    gl_FragColor = vec4(constituentPx.rgb, sourcePx.a);
  } else /*if (vComposition == COMPOSITION_SOURCE_IN)*/ {
    gl_FragColor = vec4(sourcePx.rgb, sign(sourcePx.a) * sign(constituentPx.a));
  }
}
