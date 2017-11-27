'use strict'

const utils = require('loader-utils')
// const path = require('path')
// const pkg = require('../package')

module.exports = function (source) {
  this.cacheable()
  const _this = this
  const jrmfConfig = this.jrmf || utils.getLoaderConfig(this, 'jrmf')
  if (jrmfConfig.options.useJrmfUI && /}\s+from(.*?)('|")jrmf/.test(source)) {
    const parser = require('./libs/import-parser')
    const maps = this.jrmfMaps || utils.getLoaderConfig(this, 'jrmfMaps')
    source = parser(source, function (opts) {
      let str = ''
      opts.components.forEach(function (component) {
        let file = `jrmf/${maps[component.originalName]}`
        if (jrmfConfig.options.jrmfDev) {
          file = file.replace('jrmf/src/', './')
        }
        str += `import ${component.newName} from '${file}'\n`
      })
      return str
    }, 'jrmf')
  }

  if (jrmfConfig.options.jrmfDev && /main\.js/.test(this.resourcePath)) {
    source = source.replace(/!jrmf\/src/g, '!.')
  }

  if (jrmfConfig.plugins.length) {
    jrmfConfig.plugins.forEach(function (plugin) {
      // js-parser
      if (plugin.name === 'js-parser') {
        if (plugin.fn) {
          if (plugin.test && plugin.test.test(_this.resourcePath)) {
            source = plugin.fn.call(_this, source)
          } else if (!plugin.test) {
            source = plugin.fn.call(_this, source)
          }
        }
      }
    })
  }

  return source
}
