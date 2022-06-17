#!/usr/bin/env node

"use strict";
const yArgsParser = require("yargs-parser");
const child_process = require("child_process");
const { branchs } = require("./lib/read_gitbranch");
const { init_gitbranch } = require("./lib/init_gitbranch");
const colors = require("colors");
const spawn = child_process.spawn;
const Promise = global.Promise || require("bluebird");
const args = yArgsParser(process.argv.slice(2));

let gitBranch = spawn("git", ["branch"]);
let output = "";
let nativeBranch = /^(?:  |\n*\* |\n) {0,2}(.*)(?=\n|$)/;

if (args.init) {
  init_gitbranch()
}

new Promise((resolve, reject) => {
  let branchString = "";
  gitBranch.stdout.on("data", (data) => {
    branchString += data.toString();
  });
  gitBranch.on("close", () => {
    resolve(branchString);
  });
}).then((result) => {
  while (result.length > 0) {
    let arr = result.match(nativeBranch);
    const branch_name = arr[1];
    const branch_desc = branchs[branch_name]
    if (branch_name && args.note) {
      child_process.exec(
        `git config branch.${branch_name}.description`,
        {},
        (err, stdout, stderr) => {
          console.log(`get branch ${branch_name} description：`, stdout);
          if (!stdout && branch_desc) {
            console.log(`set branch ${branch_name} description： ${branchs[branch_name]}`)
            child_process.exec(
              `git config branch.${branch_name}.description ${branchs[branch_name]}`,
              {},
              (err, stdout, stderr) => {
                console.log(stderr);
              }
            );
          }
        }
      );
    }
    result = result.substring(arr[0].length);
    if (~arr[0].indexOf("*")) {
      output += `\n* ${arr[1].green}${
        branchs[arr[1]] ? " - " + branchs[arr[1]].bold.underline : ""
      }`;
    } else {
      output += `${arr[0]}${
        branchs[arr[1]] ? " - " + branchs[arr[1]].bold : ""
      }`;
    }
  }

  process.stdout.write(output);
});
