const fs = require("fs")
const { exec } = require("child_process")

const mountPoint = "[[IRA]]"
const ira = fs.readFileSync(`${__dirname}/../src/index.js`, "utf-8")
const template = fs.readFileSync(`${__dirname}/template.html`, "utf-8")
fs.writeFileSync(`${__dirname}/index.html`, template.replace(mountPoint, `<script>${ira}</script>`))

exec(`firefox ${__dirname}/index.html`)
