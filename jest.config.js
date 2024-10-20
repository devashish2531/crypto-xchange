module.exports = {
  preset: "jest-preset-angular",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.ts"],
};
