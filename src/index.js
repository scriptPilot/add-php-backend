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
const viteConfigFile = isDevMode
  ? path.resolve(appFolder, 'vite.config.js')
  : fs.readdirSync(appFolder).filter(f => f.startsWith('vite.config.')).map(f => path.resolve(appFolder, f))[0]
const gitIgnoreFile = path.resolve(appFolder, '.gitignore')

// Check folders and files
if (!isDevMode) {
  if (!fs.existsSync(publicFolder)) throw new Error(`❌ Folder not found "${publicFolder}"`)
  if (!fs.existsSync(packageFile)) throw new Error(`❌ File not found "${packageFile}"`)
  if (!viteConfigFile) throw new Error(`❌ File not found "vite.config.*"`)
}

// Copy template structure
shell.exec(`cp -Rn "${templateFolder}/" "${appFolder}/"`)

// Add vendor folder and credentials.php to the .gitignore file
const gitIgnoreFileStr = fs.existsSync(gitIgnoreFile) ? fs.readFileSync(gitIgnoreFile, { encoding: 'utf8' }) : ''  
const gitIgnoreFileLines = gitIgnoreFileStr.split('\n')
const gitIgnoreTemplateFileLines = ['vendor/', 'credentials.php']
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

// Add proxy settings to the vite config file
const viteConfigFileContent = fs.readFileSync(viteConfigFile, { encoding: 'utf8' })
if (!viteConfigFileContent.match('proxy:')) {
  if (!viteConfigFileContent.match('server:')) {
    const pluginsRegex = /(( *)plugins:(\n|.)*?\[(\n|.)*?\])/
    const proxyReplacement = `
$1,
$2server: {
$2$2// eslint-disable-next-line no-useless-escape
$2$2'^(.+)\\.(php)(?:[\\?#]|$)': 'http://localhost:8000/'
$2}
    `.trim()
    const nextViteConfigFileContent = viteConfigFileContent.replace(pluginsRegex, proxyReplacement)
    fs.writeFileSync(viteConfigFile, nextViteConfigFileContent)
  }
}

// Log success
console.log('✅ You can start your backend with "npm run backend"')