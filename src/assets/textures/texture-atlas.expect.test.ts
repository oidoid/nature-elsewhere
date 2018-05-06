export default {
  size: {w: 256, h: 128},
  animations: {
    'cactus s': {
      cels: [
        {
          bounds: {x: 221, y: 19, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 8, y: 12, w: 2, h: 3}]
        }
      ],
      direction: 'forward'
    },
    'cactus m': {
      cels: [
        {
          bounds: {x: 91, y: 55, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 7, y: 11, w: 3, h: 4}]
        }
      ],
      direction: 'forward'
    },
    'cactus l': {
      cels: [
        {
          bounds: {x: 73, y: 55, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 7, y: 10, w: 3, h: 5}]
        }
      ],
      direction: 'forward'
    },
    'cactus xl': {
      cels: [
        {
          bounds: {x: 55, y: 55, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 7, y: 9, w: 3, h: 6}]
        }
      ],
      direction: 'forward'
    },
    'char walk': {
      cels: [
        {
          bounds: {x: 37, y: 55, w: 16, h: 16},
          duration: 100,
          collision: [{x: 6, y: 8, w: 4, h: 7}]
        },
        {
          bounds: {x: 19, y: 55, w: 16, h: 16},
          duration: 100,
          collision: [{x: 6, y: 9, w: 4, h: 6}]
        },
        {
          bounds: {x: 1, y: 55, w: 16, h: 16},
          duration: 100,
          collision: [{x: 6, y: 10, w: 4, h: 5}]
        },
        {
          bounds: {x: 239, y: 37, w: 16, h: 16},
          duration: 100,
          collision: [{x: 6, y: 9, w: 4, h: 6}]
        },
        {
          bounds: {x: 221, y: 37, w: 16, h: 16},
          duration: 100,
          collision: [{x: 6, y: 8, w: 4, h: 7}]
        }
      ],
      direction: 'pingpong'
    },
    'cloud xs': {
      cels: [
        {
          bounds: {x: 203, y: 37, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 4, y: 12, w: 7, h: 3}]
        }
      ],
      direction: 'forward'
    },
    'cloud s': {
      cels: [
        {
          bounds: {x: 185, y: 37, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 4, y: 11, w: 9, h: 4}]
        }
      ],
      direction: 'forward'
    },
    'cloud m': {
      cels: [
        {
          bounds: {x: 167, y: 37, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 3, y: 11, w: 10, h: 4}]
        }
      ],
      direction: 'forward'
    },
    'cloud l': {
      cels: [
        {
          bounds: {x: 149, y: 37, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 3, y: 10, w: 9, h: 5}]
        }
      ],
      direction: 'forward'
    },
    'cloud xl': {
      cels: [
        {
          bounds: {x: 131, y: 37, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 3, y: 9, w: 9, h: 6}]
        }
      ],
      direction: 'forward'
    },
    'flag ': {
      cels: [
        {
          bounds: {x: 239, y: 19, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 7, y: 10, w: 3, h: 5}]
        }
      ],
      direction: 'forward'
    },
    'grass ': {
      cels: [
        {
          bounds: {x: 131, y: 1, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 15, w: 16, h: 1}]
        }
      ],
      direction: 'forward'
    },
    'palette 0': {
      cels: [
        {
          bounds: {x: 203, y: 19, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 1': {
      cels: [
        {
          bounds: {x: 185, y: 19, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 2': {
      cels: [
        {
          bounds: {x: 167, y: 19, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 3': {
      cels: [
        {
          bounds: {x: 149, y: 19, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 4': {
      cels: [
        {
          bounds: {x: 131, y: 19, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 5': {
      cels: [
        {
          bounds: {x: 239, y: 1, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 6': {
      cels: [
        {
          bounds: {x: 221, y: 1, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 7': {
      cels: [
        {
          bounds: {x: 203, y: 1, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 8': {
      cels: [
        {
          bounds: {x: 185, y: 1, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'palette 9': {
      cels: [
        {
          bounds: {x: 167, y: 1, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 0, w: 16, h: 16}]
        }
      ],
      direction: 'forward'
    },
    'pond mask': {
      cels: [
        {
          bounds: {x: 1, y: 37, w: 128, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: []
        }
      ],
      direction: 'forward'
    },
    'pond water': {
      cels: [
        {
          bounds: {x: 1, y: 19, w: 128, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: []
        }
      ],
      direction: 'forward'
    },
    'pond reflections': {
      cels: [
        {
          bounds: {x: 1, y: 1, w: 128, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 0, y: 11, w: 128, h: 1}]
        }
      ],
      direction: 'forward'
    },
    'rain ': {
      cels: [
        {
          bounds: {x: 149, y: 1, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 4, y: 0, w: 7, h: 16}]
        }
      ],
      direction: 'forward'
    }
  }
}
