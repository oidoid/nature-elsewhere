export const layout = {
  perVertex: {
    length: 2,
    stride: 4,
    divisor: 0,
    type: 'SHORT',
    attributes: [{name: 'uv', length: 2, offset: 0}]
  },
  perInstance: {
    length: 12,
    stride: 24,
    divisor: 1,
    type: 'SHORT',
    attributes: [
      {name: 'sourceCoord', length: 4, offset: 0},
      {name: 'targetCoord', length: 4, offset: 8},
      {name: 'scrollPosition', length: 2, offset: 16},
      {name: 'scale', length: 2, offset: 20}
    ]
  }
}
