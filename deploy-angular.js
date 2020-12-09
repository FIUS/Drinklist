/*
 * Script for handling angular build output correctly
 * ------------------------------------
 * Author: Raphael Kienhöfer
 */

// Imports
const rimraf = require("rimraf");
const copyfiles = require("copyfiles");

// Constants
const rootDir = __dirname;
const outDir = "./dist/frontend";
const deployDir = "./src/frontend-server/wwwroot";

// Make sure we are operating in the project root
if (process.cwd() !== rootDir) {
  process.chdir(rootDir);
}

// Clear old deployment
rimraf(deployDir, (err) => {
  if (err) {
    throw err;
  }
  console.info("Cleared old deployment. Copying new files...");
  // Copy newly built files into deployDir
  copyfiles([outDir +  "/**/*", deployDir], {up: 2}, (err) => {
    if (err) {
      throw err;
    }
    console.info("Deployment successful.");
  });
});



