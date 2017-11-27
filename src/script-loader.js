'use strict'

const utils = require('loader-utils')
const fs = require('fs')
const path = require('path')

module.exports = function (source) {
  this.cacheable()
  const _this = this
  const config = this.jrmf || utils.getLoaderConfig(this, 'jrmf')
  if (!config.plugins || !config.plugins.length) {
    return source
  }

  let isJrmfComponent = this.resourcePath.replace(/\\/g, '/').indexOf('/jrmf/src/components') > -1

  if (config.options.jrmfDev && this.resourcePath.replace(/\\/g, '/').indexOf('/src/components') > -1) {
    isJrmfComponent = true
  }

  if (config.plugins.length) {
    config.plugins.forEach(function (plugin) {
      // script-parser
      if (plugin.name === 'script-parser') {
        if (plugin.fn) {
          source = plugin.fn.call(_this, source)
        }
      }
    })
  }

  if (config.options.useJrmfUI && /}\s+from(.*?)('|")jrmf/.test(source)) {
    const maps = this.jrmfMaps || utils.getLoaderConfig(this, 'jrmfMaps')
    const parser = require('./libs/import-parser')
    source = parser(source, function (opts) {
      let str = ''
      opts.components.forEach(function (component) {
        let file = `jrmf/${maps[component.originalName]}`
        if (config.options.jrmfDev) {
          if (/App\.vue/.test(_this.resourcePath)) {
            file = file.replace(/jrmf\/src/g, '.')
          } else {
            let relative = '..'
            // component file import other functions
            if (isJrmfComponent && !/components/.test(file)) {
              relative = '../..'
            } else { // Component files imported into the SRC directory
              let pathstr = _this.resourcePath
              let start = pathstr.slice(0, pathstr.lastIndexOf('/'))
              let endstr = pathstr.slice(0, pathstr.lastIndexOf('src'))
              relative = path.relative(start, path.join(endstr, 'src'))
            }
            file = file.replace(/jrmf\/src/g, relative)
          }
        }
        str += `import ${component.newName} from '${file}'\n`
      })
      return str
    }, 'jrmf')
  }

  if (config.options.jrmfWriteFile === true) {
    fs.writeFileSync(this.resourcePath + '.jrmf.js', source)
  }

  return source
}
