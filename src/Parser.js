const css = require('css')
const listHelpers = require('css-list-helpers')
const unquote = require('unquote')
const Method = require('html-telegram-bot-api/src/Method')
const Command = require('html-telegram-bot-api/src/Command')

const _ = {}

_.chunk = require('lodash.chunk')
_.fromPairs = require('lodash.frompairs')

class Parser {
  /**
   * Parser
   * @param {string} css
   */
  constructor (str) {
    const { stylesheet } = css.parse(str)

    if (stylesheet.parsingErrors.length) {
      console.error('Error!', stylesheet.parsingErrors)
      throw new Error('Parsing Error')
    }

    const rules = stylesheet.rules.filter(e => e.type === 'rule')

    this.rules = rules
  }

  /**
   * parseCSS
   * @method parseCSS
   * @return {{ token: string, commands: Array<Command> }}
   */
  parseCSS () {
    const { rules } = this

    let token = ''

    const commands = rules.reduce((commands, rule) => {
      const selector = rule.selectors[0]

      if (selector === '[tg-root]') {
        token = Parser.parseRoot(rule)
      }

      const match = selector.match(/\[tg-command="(.+?)"\]/)

      if (match) {
        const [, sTrigger] = match
        const isRegex = rule.selectors[1] === '.tg-regex'

        const trigger = isRegex ? new RegExp(sTrigger) : sTrigger
        const methods = Parser.parseMethods(rule)

        const command = new Command(trigger, methods)

        commands.push(command)
      }

      return commands
    }, [])

    if (!token) throw new Error('Token not specified')

    return { token, commands }
  }

  /**
   * parseRoot
   * @param {Object} rule
   * @return {string} token
   */
  static parseRoot (rule) {
    /** @type {Object|undefined} */
    const declaration = rule.declarations.find(e => e.property === 'tg-token')

    return declaration ? declaration.value : ''
  }

  /**
   * parseMethods
   * @param {Object} rule
   * @return {Array<Method>}
   */
  static parseMethods (rule) {
    return rule.declarations
      .filter(e => e.type === 'declaration' && e.property === 'tg-method')
      .map(e => {
        const list = listHelpers.splitBySpaces(e.value).map(unquote)
        const name = list[0]
        const pairs = _.chunk(list.slice(1), 2)
        const properties = _.fromPairs(pairs)

        return new Method(name, properties)
      })
  }
}

module.exports = Parser
