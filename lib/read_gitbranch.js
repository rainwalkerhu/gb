const fs = require('fs')
const path = require('path')
const { getConfigFile } = require('./utils')
let gitBranch = ''

let configFilePath = getConfigFile()

try {
  gitBranch = fs.readFileSync(path.resolve(configFilePath, '.gitbranch')).toString()
} catch (e) {
  if (e.code === 'ENOENT') {
    process.stdout.write('Can\'t found .gitbranch file,below is git branch:')
  }
}

gitBranch.replace(/\r\n|\n/g, '\n')

let branchs = {}
let branch = /^([^ ]*) (.*)(?=\n|$)\n*/

while (gitBranch.length > 0) {
  let g = gitBranch.match(branch)
  gitBranch = gitBranch.substring(g[0].length)
  branchs[g[1]] = g[2]
}

exports.branchs = branchs