sysPath = require('path')
swig = require('swig')

describe 'Plugin', ->
  
    plugin = null

    beforeEach ->
        plugin = new Plugin(paths: root: '.');

    it 'should be an object', ->
        expect(plugin).to.be.ok

    it 'should has #compile method', ->
        expect(plugin.compile).to.be.an.instanceof(Function)

    it 'should compile and produce valid result', (done)->
        content = 'Hi {{name}}!'
        expected = 'Hi Mark!'
        plugin.compile content, 'main', (error, data)->
            expect(error).not.to.be.ok
            tmpl = eval(data)
            expect(tmpl(name: 'Mark')).to.equal(expected)
            done()
