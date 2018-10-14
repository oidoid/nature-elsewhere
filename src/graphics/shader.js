export const layout = {
  perVertex: {
    length: 2,
    stride: 4,
    divisor: 0,
    type: 'SHORT',
    attributes: [{name: 'uv', length: 2, offset: 0}]
  },
  perInstance: {
    length: 10,
    stride: 20,
    divisor: 1,
    type: 'SHORT',
    attributes: [
      {name: 'coord', length: 4, offset: 0},
      {name: 'scrollPosition', length: 2, offset: 8},
      {name: 'position', length: 2, offset: 12},
      {name: 'scale', length: 2, offset: 16}
    ]
  }
}
