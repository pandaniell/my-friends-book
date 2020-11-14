const { readFileSync } = require("fs");
const { transform } = require("@babel/core");

module.exports = (filename) => {
  const sourceFile = readFileSync(filename, "utf-8");

  const { code } = transform(sourceFile, {
    filename,
    presets: ["@babel/preset-typescript", "@babel/preset-env"],
  });

  return eval(code);
};
