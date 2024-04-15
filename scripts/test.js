const { execSync } = require("child_process");

const runTests = (servicePath) => {
  try {
    execSync(`mocha module/${servicePath}/test`, { stdio: "inherit" });
  } catch (error) {
    console.error("Error running tests:", error);
    process.exit(1);
  }
};

const servicePath = process.argv.pop();
runTests(servicePath);
