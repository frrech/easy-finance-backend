export default {
  testEnvironment: "node",
  transform: {},
  globalTeardown: "./tests/teardown.js",
  setupFilesAfterEnv: ["./tests/setup.js"]
};
