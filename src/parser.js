const css = require('css')
const listHelpers = require('css-list-helpers')
const unquote = require('unquote')
const Method = require('html-telegram-bot-api/src/Method')
const Command = require('html-telegram-bot-api/src/Command')

const _ = {}

_.chunk = require('lodash.chunk')
_.fromPairs = require('lodash.frompairs')

/**
 * parseCSS
 * @param {string} str CSS
 * @return {{ token: string, commands: Array<Command> }} token and commands
 */
const parseCSS = str => {
  const rules = makeAST(str)

  if (rules === null) throw new Error('Parsing error')

  const { token, commands } = rules.reduce(({ token, commands }, rule) => {
    const selector = rule.selectors[0]

    if (selector === '[tg-root]') {
      token = parseRoot(rule)
    }

    const match = selector.match(/\[tg-command="(.+?)"\]/)

    if (match) {
      const sTrigger = match[1]
      const isRegex = rule.selectors[1] === '.tg-regex'

      const trigger = isRegex ? new RegExp(sTrigger) : sTrigger
      const methods = parseMethods(rule)

      const command = new Command(trigger, methods)

      commands.push(command)
    }

    return { token, commands }
  }, { token: '', commands: [] })

  if (!token) throw new Error('Token not specified')

  return { token, commands }
}

/**
 * makeAST
 * @param {string} str CSS
 * @return {?Object} AST
 */
const makeAST = str => {
  const { stylesheet } = css.parse(str)

  if (stylesheet.parsingErrors.length) return null

  const rules = stylesheet.rules.filter(e => e.type === 'rule')

  return rules
}

/**
 * parseRoot
 * @param {Object} rule css rule
 * @return {string} token
 */
const parseRoot = rule => {
  /** @type {Object|undefined} */
  const declaration = rule.declarations.find(e => e.property === 'tg-token')

  return declaration ? declaration.value : ''
}

/**
 * parseMethods
 * @param {Object} rule css rule
 * @return {Array<Method>} array of tg methods
 */
const parseMethods = rule => rule.declarations
  .filter(e => e.type === 'declaration' && e.property === 'tg-method')
  .map(e => {
    const list = listHelpers.splitBySpaces(e.value).map(unquote)
    const name = list[0]
    const pairs = _.chunk(list.slice(1), 2)
    const properties = _.fromPairs(pairs)

    return new Method(name, properties)
  })

module.exports = {
  parseCSS,
  makeAST,
  parseRoot,
  parseMethods
}
