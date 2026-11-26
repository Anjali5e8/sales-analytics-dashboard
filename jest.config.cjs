module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx", module: "commonjs", esModuleInterop: true, strict: true, moduleResolution: "node" } }],
  },
  moduleNameMapper: { "\\.css$": "identity-obj-proxy" },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
};
