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
    if (plugin.name === 'style-parser') {
      if (plugin.fn) {
        source = plugin.fn.call(_this, source)
      }
    }
  })

  if (config.options.jrmfDev) {
    if (/App\.vue$/.test(this.resourcePath)) {
      source = source.replace(/~jrmf\/src/g, '.')
    } else {
      source = source.replace(/~jrmf\/src/g, '..')
    }
  }

  return source
}
