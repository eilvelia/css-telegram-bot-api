const fs = require('fs')
const program = require('commander')
const Parser = require('./Parser')
const TelegramBot = require('html-telegram-bot-api/src/TelegramBot')
const pkg = require('../package.json')

let filename = ''

program
  .version(pkg.version)
  .arguments('<path/to/css/file>')
  .action(arg => (filename = arg))
  .parse(process.argv)

const css = fs.readFileSync(filename).toString()

const { token, commands } = Parser.parseCSS(css)

const bot = new TelegramBot(token)

bot.addCommands(commands)
bot.startPolling()
