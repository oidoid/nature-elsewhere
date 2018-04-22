module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {'.+\\.ts$': 'ts-jest'},
  testMatch: ['<rootDir>/**.test.ts'],
  globals: {enableTsDiagnostics: true}
}
