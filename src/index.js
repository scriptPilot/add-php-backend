#!/usr/bin/env node

// Import modules
import path from 'path'
import url from 'url'
import shell from 'shelljs'
import fs from 'fs-extra'

// Define folders
const scriptFolder = path.dirname(url.fileURLToPath(import.meta.url))
const processFolder = process.cwd()
const isDevMode = processFolder === path.resolve(scriptFolder, '..')
const appFolder = isDevMode ? path.resolve(scriptFolder, '../temp') : processFolder
const templateFolder = path.resolve(scriptFolder, 'templates')
const publicFolder = path.resolve(appFolder, 'public')

// Define files
const packageFile = path.resolve(appFolder, 'package.json')
const viteConfigFile = path.resolve(appFolder, 'vite.config.js')

// Create folder and files in dev mode
if (isDevMode) {
  fs.ensureDirSync(publicFolder)
  if (!fs.existsSync(packageFile)) fs.writeJsonSync(packageFile, {})
  if (!fs.existsSync(viteConfigFile)) fs.writeFileSync(viteConfigFile, 'export default {}')
}

// Check requirements
if (!fs.existsSync(publicFolder)) throw new Error(`❌ Folder not found "${publicFolder}"`)
if (!fs.existsSync(packageFile)) throw new Error(`❌ File not found "${packageFile}"`)
if (!fs.existsSync(viteConfigFile)) throw new Error(`❌ File not found "${viteConfigFile}"`)

// Copy template structure
shell.exec(`cp -Rn "${templateFolder}/" "${appFolder}/"`)

// Add vendor folder and credentials.php to the .gitignore file
// TODO

// Add backend script to the package.json file
const packageFileJson = fs.readJsonSync(packageFile)
const nextPackageFileJson = {
  ...packageFileJson,
  scripts: {
    ...packageFileJson.scripts,
    backend: 'docker stop $(docker ps -a -q) && docker rm -f $(docker ps -a -q) && docker volume rm $(docker volume ls -q) && docker compose up -d --build',    
  }
}
fs.writeJsonSync(packageFile, nextPackageFileJson, { spaces: 2 })

// Add proxy settings to the vite.config.js file
// TODO

// Log success
console.log('✅ You can start your backend with "npm run backend"')