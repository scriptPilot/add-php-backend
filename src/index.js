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
const viteConfigFile = isDevMode ? 'vite.config.js' : fs.readdirSync(appFolder).filter(f => f.startsWith('vite.config.'))[0]
const gitIgnoreFile = path.resolve(appFolder, '.gitignore')
const gitIgnoreTemplateFile = path.resolve(scriptFolder, 'templates/.gitignore')

// Check folders and files
if (!isDevMode) {
  if (!fs.existsSync(publicFolder)) throw new Error(`❌ Folder not found "${publicFolder}"`)
  if (!fs.existsSync(packageFile)) throw new Error(`❌ File not found "${packageFile}"`)
  if (!viteConfigFile) throw new Error(`❌ File not found "vite.config.*"`)
}

// Copy template structure
shell.exec(`cp -Rn "${templateFolder}/" "${appFolder}/"`)

// Add vendor folder and credentials.php to the .gitignore file
const gitIgnoreFileStr = fs.readFileSync(gitIgnoreFile, { encoding: 'utf8' })
const gitIgnoreFileLines = gitIgnoreFileStr.split('\n')
const gitIgnoreTemplateFileStr =  fs.readFileSync(gitIgnoreTemplateFile, { encoding: 'utf8' })
const gitIgnoreTemplateFileLines = gitIgnoreTemplateFileStr.split('\n')
gitIgnoreTemplateFileLines.forEach(term => {
  if (!gitIgnoreFileLines.includes(term)) gitIgnoreFileLines.push(term)
})
const nextGitIgnoreFileStr = gitIgnoreFileLines.join('\n')
fs.writeFileSync(gitIgnoreFile, nextGitIgnoreFileStr)

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