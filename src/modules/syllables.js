const Word = require('./word')
const SyllablesProcessor = require('./syllables-processor')

/**
 * Separate passed word in syllables.
 * Rules: http://ponce.inter.edu/acad/cursos/ciencia/lasvi/modulo2.htm
 *
 * @param {string} wordString
 */
module.exports = class Syllables {

  constructor (wordString, lang) {
    this.wordString = wordString
    this.lang = lang || 'es'
    this.processor = new SyllablesProcessor(lang)
    this.word = new Word(wordString)
  }

  get () {
    if (this.wordString.length === 1) return [this.wordString]

    var syllables = []
    var syllable = ''

    // console.log('---- parts:', this.word.getAll())
    while (this.word.next()) {
      this.processor.run({
        syllable: syllable,
        part: this.word.current(),
        prevPart: this.word.lookBack(),
        nextPart: this.word.lookAhead(),
        hasNext: this.word.hasNext(),
        addSyllable: addSyllable,
        addToLastSyllable: addToLastSyllable,
        addPartial: addPartial,
        setPartial: setPartial,
        hasSpecialEnding: hasSpecialEnding
      })
    }

    return syllables

    function addPartial (str) {
      syllable += str
    }

    function setPartial (str) {
      syllable = str
    }

    function addSyllable (_syllable_, keepPartial) {
      if (!_syllable_) return
      syllables.push(_syllable_)
      if (!keepPartial) syllable = ''
    }

    function addToLastSyllable (str) {
      var totalSyllables = syllables.length
      syllables[totalSyllables - 1] += str
    }

    function hasSpecialEnding (str, ending) {
      var lastChar = str.slice(-1)
      return (ending.indexOf(lastChar) !== -1)
    }
  }
}
