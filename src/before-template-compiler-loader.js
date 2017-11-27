'use strict'

const utils = require('loader-utils')
const parseXIcon = require('./libs/parse-x-icon')

module.exports = function (source) {
  this.cacheable()
  const _this = this
  const config = this.jrmf || utils.getLoaderConfig(this, 'jrmf')

  if (!config.plugins || !config.plugins.length) {
    return source
  }

  if (config.options.useJrmfUI && source.indexOf('</x-icon>') > -1) {
    source = parseXIcon(source, config)
  }

  config.plugins.forEach(function (plugin) {
    // style-parser
    if (plugin.name === 'before-template-compiler-parser') {
      if (plugin.fn) {
        source = plugin.fn.call(_this, source)
      }
    }
  })

  return source
}
