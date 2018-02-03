const fs = require('fs')
const program = require('commander')
const { parseCSS } = require('./parser')
const TelegramBot = require('html-telegram-bot-api/src/TelegramBot')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .arguments('<path/to/css/file>')
  .action(start)
  .parse(process.argv)

if (program.args.length === 0) {
  console.error('filename is required')
  process.exit(1)
}

function start (filename) {
  const css = fs.readFileSync(filename).toString()

  const { token, commands } = parseCSS(css)

  const bot = new TelegramBot(token)

  bot.addCommands(commands)
  bot.startPolling()
}
