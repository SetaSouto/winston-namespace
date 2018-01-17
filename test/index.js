/* global describe it */
const expect = require('chai').expect

describe('Logger namespaces', () => {
  it('Should pass the check for a normal namespace', done => {
    const namespaces = require('../namespaces')
    expect(namespaces._populated).to.be.equal(false)
    let namespace = 'namespace'
    process.env.LOGGER_NAMESPACES = namespace
    expect(namespaces.check(namespace)).to.be.equal(true)
    expect(namespaces._populated).to.be.equal(true)
    done()
  })
  it('Should pass the wildcards at different levels', done => {
    const namespaces = require('../namespaces')
    process.env.LOGGER_NAMESPACES = 'level1:level2:*'
    namespaces._populate()
    expect(namespaces.check('level1:level2:level3')).to.be.equal(true)
    expect(namespaces.check('level1:level2:level3:level4')).to.be.equal(true)
    expect(namespaces.check('level1:level2:level3:level4:level5')).to.be.equal(true)
    expect(namespaces.check('level1:level2:level3:level4:level5:level6')).to.be.equal(true)
    expect(namespaces.check('level1')).to.be.equal(false)
    process.env.LOGGER_NAMESPACES = '*'
    namespaces._populate()
    expect(namespaces.check('level1')).to.be.equal(true)
    expect(namespaces.check('level1:level2')).to.be.equal(true)
    expect(namespaces.check('level1:level2:level3')).to.be.equal(true)
    expect(namespaces.check('anything')).to.be.equal(true)
    done()
  })
  it('Should not pass anything if the env variable is not defined', done => {
    const namespaces = require('../namespaces')
    delete process.env.LOGGER_NAMESPACES
    namespaces._populate()
    expect(namespaces.check('level1')).to.be.equal(false)
    expect(namespaces.check('level1:level2:level3')).to.be.equal(false)
    expect(namespaces.check('level1:level2:level3:level4')).to.be.equal(false)
    expect(namespaces.check('level1:level2:level3:level4:level5')).to.be.equal(false)
    expect(namespaces.check('level1:level2:level3:level4:level5:level6')).to.be.equal(false)
    done()
  })
})
