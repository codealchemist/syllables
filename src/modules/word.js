const vocalsGetter = require('./vocals')

module.exports = class Word {
  constructor (word, lang) {
    lang = lang || 'es'

    this.word = word
    this.hyphenated = ''
    this.vocalsRegex = vocalsGetter(lang).all
    this.parts = []
    this.partsCount = 0
    this.currentIndex = -1
    this.hasNextFlag = false
    this.hasPrevFlag = false
    this.init()
  }

  init () {
    if (this.word.length === 1) return

    // separate all vocals
    var temp = this.word.replace(this.vocalsRegex, '-$1-')

    // remove first hyphen
    if (temp[0] === '-') {
      temp = temp.slice(1)
    }

    // remove final hyphen
    if (temp.slice(-1) === '-') temp = temp.slice(0, -1)

    // remove consecutive hyphens
    temp = temp.replace(/--/g, '-')
    this.hyphenated = temp

    // use an array with all syllable separations
    this.parts = temp.split('-')
    this.partsCount = this.parts.length

    // set has next and has prev flags
    this.updateFlags(0)
  }

  getHyphenated () {
    return this.hyphenated
  }

  get (index) {
    if (index > this.partsCount || index < 0) throw new Error('Invalid index!')

    // update current index and return requested part
    this.currentIndex = index
    return this.parts[index]
  }

  updateFlags (index) {
    // set next flags
    this.hasNextFlag = (index < this.partsCount - 1)
    this.hasPrevFlag = (index > 0)
    // console.log('== parts count: ' + partsCount + ' / index: ' + index + ' / hasNext: ', hasNext)
  }

  hasNext () {
    return this.hasNextFlag
  }

  hasPrev () {
    return this.hasPrevFlag
  }

  next () {
    // console.log('== next: hasNext?', hasNext)
    if (!this.hasNext()) return false

    var nextIndex = this.currentIndex + 1
    this.updateFlags(nextIndex)
    this.currentIndex = nextIndex
    return this.parts[nextIndex]
  }

  lookAhead () {
    if (!this.hasNext()) return false
    return this.parts[this.currentIndex + 1]
  }

  lookBack () {
    if (!this.hasPrev) return false
    return this.parts[this.currentIndex - 1]
  }

  current () {
    return this.parts[this.currentIndex]
  }

  getAll () {
    return this.parts
  }
}
