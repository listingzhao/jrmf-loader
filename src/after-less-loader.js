'use strict'

const utils = require('loader-utils')

module.exports = function (source) {
  this.cacheable()
  const _this = this
  const config = this.jrmf || utils.getLoaderConfig(this, 'jrmf')

  if (!config.plugins || !config.plugins.length) {
    return source
  }

  config.plugins.forEach(function (plugin) {
    // style-parser
    if (plugin.name === 'after-less-parser') {
      if (plugin.fn) {
        source = plugin.fn.call(_this, source)
      }
    }
  })

  return source
}
