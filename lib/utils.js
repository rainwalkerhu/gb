const fs = require("fs");
const path = require('path')

const getConfigFile = function () {
  let currentPath = process.cwd();
  while (currentPath !== "/") {
    if (fs.existsSync(path.resolve(currentPath, ".gitbranch"))) {
      break;
    } else {
      currentPath = path.resolve(currentPath, "../");
    }
  }

  return currentPath;
};

exports.getConfigFile = getConfigFile;
