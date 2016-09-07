const parseArgs = require('minimist')
const Syllables = require('./modules/syllables')

const args = parseArgs(process.argv.slice(2))['_']
if (!args.length) {
  console.log('USAGE: npm start [word] [lang]\n')
  process.exit()
}

const word = args[0]
const lang = args[1] || 'es'
const syllables = new Syllables(word, lang).get()
const syllablesString = syllables.join('-')
console.log(`${word}: ${syllablesString}\n`)
