const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const Promise = global.Promise || require("bluebird");
const { getConfigFile } = require("./utils");
const spawn = child_process.spawn;

const init = function () {
  let configFilePath = getConfigFile();
  let gitRemoteBranch = spawn("git", ["branch", "-r"]);

  new Promise((resolve, reject) => {
    let branchString = "";
    gitRemoteBranch.stdout.on("data", (data) => {
      branchString += data.toString();
    });
    gitRemoteBranch.on("close", () => {
      resolve(branchString);
    });
  }).then((result) => {
    result = result.replace(/  origin\//g, "");
    fs.writeFileSync(
      path.resolve(configFilePath, ".gitbranch"),
      result,
      { flag: "a+" },
      (err) => {}
    );
  });
};

exports.init_gitbranch = init;
