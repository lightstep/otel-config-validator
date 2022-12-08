// @ts-check
"use strict";

// via https://github.com/microsoft/vscode-platform-specific-sample

const os = require("os");
const fs = require("fs");
const path = require("path");
const util = require("util");
const child_process = require("child_process");

const download = require("./download");

const fsExists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const exec = util.promisify(child_process.exec);

const forceInstall = process.argv.includes("--force");
if (forceInstall) {
  console.log("--force, ignoring caches");
}

const VERSION = "v0.0.1";
const BIN_PATH = path.join(__dirname, "../bin");

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled rejection: ", promise, "reason:", reason);
});

async function isMusl() {
  let stderr;
  try {
    stderr = (await exec("ldd --version")).stderr;
  } catch (err) {
    stderr = err.stderr;
  }
  if (stderr.indexOf("musl") > -1) {
    return true;
  }
  return false;
}

async function getTarget() {
  const arch = process.env.npm_config_arch || os.arch();

  switch (os.platform()) {
    case "darwin":
      return arch === "arm64" ? "darwin_arm64" : "darwin_amd64";
    case "win32":
      return arch === "x64"
        ? "windows_amd64"
        : arch === "arm"
        ? "windows_arm"
        : "i686-pc-windows-msvc";
    case "linux":
      return arch === "x64"
        ? "linux_amd64"
        : arch === "arm"
        ? "linux_arm"
        : arch === "arm64"
        ? "aarch64-unknown-linux-gnu"
        : "i686-unknown-linux-musl";
    default:
      throw new Error("Unknown platform: " + os.platform());
  }
}

async function main() {
  const binExists = await fsExists(BIN_PATH);
  if (!forceInstall && binExists) {
    console.log("bin/ folder already exists, exiting");
    process.exit(0);
  }

  if (!binExists) {
    await mkdir(BIN_PATH);
  }

  const opts = {
    version: VERSION,
    token: process.env["GITHUB_TOKEN"],
    target: await getTarget(),
    destDir: BIN_PATH,
    force: forceInstall,
  };
  try {
    await download(opts);
  } catch (err) {
    console.error(`Downloading otel-config-validator failed: ${err.stack}`);
    process.exit(1);
  }
}

main();
