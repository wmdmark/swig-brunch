fs = require "fs"
swig = require 'swig'
sysPath = require 'path'

module.exports = class SwigCompiler
  brunchPlugin: yes
  type: 'template'
  extension: 'html'
  pattern: /(\.(html|swig))$/

  compile: (data, path, callback) ->
    try
      filename = sysPath.basename(path).split(".")[0]
      result = "module.exports = swig.compile(#{JSON.stringify(data)}, { filename: '#{filename}'});";
    catch err
      error = err
    finally
      callback error, result

  include: [
    (sysPath.join __dirname, '..', 'vendor',
      'swig.min.js')
  ]  