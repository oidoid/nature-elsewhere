module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {'.+\\.ts$': 'ts-jest'},
  testMatch: ['**/*.test.ts'],
  globals: {enableTsDiagnostics: true}
}
