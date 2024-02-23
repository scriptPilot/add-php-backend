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
const appFolder = isDevMode ? path.resolve(scriptFolder, '../demo') : processFolder
const templateFolder = path.resolve(scriptFolder, 'templates')

// Define files
const packageFile = path.resolve(appFolder, 'package.json')
const gitIgnoreFile = path.resolve(appFolder, '.gitignore')
let viteConfigFile = null

// Copy template structure
shell.exec(`cp -Rn "${templateFolder}/" "${appFolder}/"`)

// Create package.json file if not exists
if (!fs.existsSync(packageFile)) fs.writeFileSync(packageFile, '{ "scripts": { "dev": "vite" } }')

// Search for vite config file
viteConfigFile =
  fs.readdirSync(appFolder)
  .filter(f => f.startsWith('vite.config.'))
  .map(f => path.resolve(appFolder, f))[0]

// Create vite.config.js file if not exists
if (!viteConfigFile) {
  viteConfigFile = path.resolve(appFolder, 'vite.config.js')
  fs.writeFileSync(viteConfigFile, 'export default {}')
}

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
    dev: 'npm run backend' + (packageFileJson.scripts?.dev ? ' && ' + packageFileJson.scripts.dev : ''),
    backend: '(docker stop $(docker ps -a -q) || true) && (docker rm -f $(docker ps -a -q) || true) && (docker volume rm $(docker volume ls -q) || true) && docker compose up -d --build',    
  }
}
fs.writeJsonSync(packageFile, nextPackageFileJson, { spaces: 2 })

// Add proxy settings to the vite config file
let viteConfigFileContent = fs.readFileSync(viteConfigFile, { encoding: 'utf8' })
const regexStartOfConfig = /(export(.*)(\{))/
const regexStartOfServer = /(server:( )*\{)/
const regexStartOfProxy = /(proxy:( )*\{)/
const serverStr = `
  server: {
  },`
const proxyStr = `
    proxy: {
      // eslint-disable-next-line no-useless-escape
      '^(.+)\\\\.php': 'http://localhost:8000/',
    },`
if (!viteConfigFileContent.match(regexStartOfServer)) {
  viteConfigFileContent = viteConfigFileContent.replace(regexStartOfConfig, `$1${serverStr}`)
}
if (!viteConfigFileContent.match(regexStartOfProxy)) {
  viteConfigFileContent = viteConfigFileContent.replace(regexStartOfServer, `$1${proxyStr}`)
}
fs.writeFileSync(viteConfigFile, viteConfigFileContent)

// Log success
console.log('✅ You can start your backend with "npm run backend"')