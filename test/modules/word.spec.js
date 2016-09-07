const chai = require('chai')
const expect = chai.expect

// ------------------------------

const Word = require('./../../src/modules/word')

describe('Word', function (done) {
  it('should be defined', function () {
    expect(Word).to.not.be.undefined
  })

  it('should return hyphenated word', function () {
    expect(new Word('hola').getHyphenated()).to.equal('h-o-l-a')
    expect(new Word('obstrucción').getHyphenated()).to.equal('o-bstr-u-cc-i-ó-n')
  })

  it('should iterate word parts', function () {
    var word1 = new Word('hola')
    expect(word1.next()).to.equal('h')
    expect(word1.next()).to.equal('o')
    expect(word1.next()).to.equal('l')
    expect(word1.next()).to.equal('a')

    var word2 = new Word('obstrucción')
    expect(word2.next()).to.equal('o')
    expect(word2.next()).to.equal('bstr')
    expect(word2.next()).to.equal('u')
    expect(word2.next()).to.equal('cc')
    expect(word2.next()).to.equal('i')
    expect(word2.next()).to.equal('ó')
    expect(word2.next()).to.equal('n')
  })

  it('should properly use prev and next flags', function () {
    var word = new Word('hola')
    expect(word.hasPrev()).to.equal(false)
    expect(word.hasNext()).to.equal(true)

    word.next() // h
    expect(word.hasPrev()).to.equal(false)
    expect(word.hasNext()).to.equal(true)

    word.next() // o
    expect(word.hasPrev()).to.equal(true)
    expect(word.hasNext()).to.equal(true)

    word.next() // l
    expect(word.hasPrev()).to.equal(true)
    expect(word.hasNext()).to.equal(true)

    word.next() // a
    expect(word.hasPrev()).to.equal(true)
    expect(word.hasNext()).to.equal(false)
  })
})
