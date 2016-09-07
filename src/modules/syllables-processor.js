const languages = {
  es: require('./languages/es')
}

module.exports = class SyllablesProcessor {
  constructor (lang) {
    this.lang = lang || 'es'
  }

  run (params) {
    if (!languages[this.lang]) throw new Error(`Language ${this.lang} not available yet.`)

    return languages[this.lang](params)
  }
}
