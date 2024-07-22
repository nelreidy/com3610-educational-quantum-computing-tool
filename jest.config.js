module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/', '/local-cdn/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/local-cdn/', '<rootDir>/frontend/src/circuit_area.mjs'],
};
  