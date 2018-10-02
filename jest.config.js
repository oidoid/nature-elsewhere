module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {'.+\\.ts$': 'ts-jest'},
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['.*\\.expect\\.test\\.ts'],
  globals: {enableTsDiagnostics: true}
}
