#version 100

#define COMPOSITION_SOURCE 0.
#define COMPOSITION_SOURCE_MASK 1.
#define COMPOSITION_SOURCE_IN 2.
#define COMPOSITION_CONSTITUENT_MASK 3.

precision mediump int;
precision highp float;
precision mediump sampler2D;

uniform sampler2D atlas;
uniform ivec2 atlas_size; // width (x), height (y) in pixels.

varying vec4 v_source;
varying vec4 v_constituent;
varying float v_composition;
varying vec2 v_offset;
varying vec2 v_constituent_offset;

void main() {
  vec2 source_position = v_source.xy + vec2(ivec2(mod(v_offset, vec2(v_source.zw - v_source.xy))));
  vec4 source_px = texture2D(atlas, source_position / vec2(atlas_size));
  vec2 constituentPosition = v_constituent.xy + vec2(ivec2(mod(v_constituent_offset, vec2(v_constituent.zw - v_constituent.xy))));
  vec4 constituentPx = texture2D(atlas, constituentPosition / vec2(atlas_size));

  if (v_composition == COMPOSITION_SOURCE) {
    gl_FragColor = vec4(source_px.rgb, source_px.a);
  } else if (v_composition == COMPOSITION_SOURCE_MASK) {
    gl_FragColor = vec4(constituentPx.rgb, source_px.a);
  } else if (v_composition == COMPOSITION_SOURCE_IN) {
    gl_FragColor = vec4(source_px.rgb, sign(source_px.a) * sign(constituentPx.a));
  } else /*if (v_composition == COMPOSITION_CONSTITUENT_MASK)*/ {
    gl_FragColor = vec4(source_px.rgb, constituentPx.a);
  }
}
