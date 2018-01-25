# [WIP] css-telegram-bot-api

[![npm](https://img.shields.io/npm/v/css-telegram-bot-api.svg)](https://www.npmjs.com/package/css-telegram-bot-api)
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/Bannerets/css-telegram-bot-api.svg)](https://github.com/Bannerets/css-telegram-bot-api)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/Bannerets/css-telegram-bot-api.svg)](https://github.com/Bannerets/css-telegram-bot-api/blob/master/LICENSE)

Now you can write Telegram bots in CSS.

## Installation

#### Requirements

- node v6.0.0+

```console
$ [sudo] npm i -g css-telegram-bot-api
```

## Usage

```console
$ css-telegram-bot [options] <path/to/css/file>
```

**or**

```console
$ css-telegram-bot-api [options] <path/to/css/file>
```

## Example

```css
[tg-root] {
  /* Replace the value below with the API token you receive from Bot Father */
  tg-token: 254259451:AA5cAlGQj51K9AD37v_522HC-5lFgB;
}

[tg-command="/start"] {
  tg-method: sendMessage text Start;
  /* example: */
  /* tg-method: methodName param1 value1 param2 value2; */
}

[tg-command="/help"] {
  tg-method: sendMessage text Help;
}

[tg-command="/echo (.+)"], .tg-regex {
  /* echobot */
  tg-method: sendMessage text $1
}

[tg-command="/photo"] {
  tg-method: sendPhoto photo https://www.w3.org/html/logo/downloads/HTML5_Badge_64.png;
}
```

## Related

* [html-telegram-bot-api](https://github.com/Bannerets/html-telegram-bot-api)

## CLI Options

- `-V`, `--version` - output the version number

- `-h`, `--help` - output usage information
