// import type { Config } from "jest"

// const config: Config = {
// 	preset: "ts-jest",
// 	testEnvironment: "node",
// 	testMatch: ["<rootDir>/test/**/*.test.ts"],
// 	moduleFileExtensions: ["ts", "js", "json", "node"],
// 	collectCoverage: true,
// 	coverageDirectory: "coverage",
// 	coverageProvider: "v8",
// }

// export default config

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["<rootDir>/test/**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json", "node"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
}
