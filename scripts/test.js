const { execSync } = require("child_process");

const runTests = (argv) => {
  try {
    execSync(`mocha module/${argv[2]}/test${argv[3] ? `/${argv[3]}.js` : ""}`, {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Error running tests:", error);
    process.exit(1);
  }
};

const argv = process.argv;
runTests(argv);
