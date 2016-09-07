const chai = require('chai')
const expect = chai.expect

// ------------------------------

const Syllables = require('./../../src/modules/syllables')

describe('Syllables', function (done) {
  it('should be defined', function () {
    expect(Syllables).to.not.be.undefined
  })

  it('consonants between two vocals should be grouped with the vocal to the right', function () {
    expect(new Syllables('hola').get()).to.eql(['ho', 'la'])
    expect(new Syllables('uso').get()).to.eql(['u', 'so'])
    expect(new Syllables('comida').get()).to.eql(['co', 'mi', 'da'])
    expect(new Syllables('música').get()).to.eql(['mú', 'si', 'ca'])
    expect(new Syllables('zapato').get()).to.eql(['za', 'pa', 'to'])
  })

  it('two consonants between two vocals should be grouped one with each vocal', function () {
    expect(new Syllables('arte').get()).to.eql(['ar', 'te'])
    expect(new Syllables('contento').get()).to.eql(['con', 'ten', 'to'])
    expect(new Syllables('gimnasta').get()).to.eql(['gim', 'nas', 'ta'])
  })

  // if the second consonant is "r" or "l"
  // both consonants are grouped with the vocal to the right
  it('two consonants between two vocals special cases', function () {
    expect(new Syllables('abrigo').get()).to.eql(['a', 'bri', 'go'])
    expect(new Syllables('aplauso').get()).to.eql(['a', 'plau', 'so'])
    expect(new Syllables('regla').get()).to.eql(['re', 'gla'])
  })

  it('should separate three consonants between vocals', function () {
    expect(new Syllables('inspección').get()).to.eql(['ins', 'pec', 'ción'])
    expect(new Syllables('transmitir').get()).to.eql(['trans', 'mi', 'tir'])
  })

  it('should separate three consonants between vocals, exceptions', function () {
    expect(new Syllables('desprecio').get()).to.eql(['des', 'pre', 'cio'])
    expect(new Syllables('amplitud').get()).to.eql(['am', 'pli', 'tud'])
  })

  it('should separate four consonants between vocals', function () {
    expect(new Syllables('monstruo').get()).to.eql(['mons', 'truo'])
    expect(new Syllables('obstrucción').get()).to.eql(['obs', 'truc', 'ción'])
  })

  // double consonants represent a single phoneme
  it('should not separate double consonants', function () {
    expect(new Syllables('arroyo').get()).to.eql(['a', 'rro', 'yo'])
    expect(new Syllables('allanamiento').get()).to.eql(['a', 'lla', 'na', 'mien', 'to'])
    expect(new Syllables('cachorro').get()).to.eql(['ca', 'cho', 'rro'])
    expect(new Syllables('pecho').get()).to.eql(['pe', 'cho'])
  })

  // diptongo
  it('should not separate strong vocals from weak vocals', function () {
    expect(new Syllables('Luisa').get()).to.eql(['Lui', 'sa'])
    expect(new Syllables('viento').get()).to.eql(['vien', 'to'])
    expect(new Syllables('ruiseñor').get()).to.eql(['rui', 'se', 'ñor'])
    expect(new Syllables('petunia').get()).to.eql(['pe', 'tu', 'nia'])
    expect(new Syllables('traición').get()).to.eql(['trai', 'ción'])
  })

  // triptongo
  it('should not separate strong vocals between two weak vocals', function () {
    expect(new Syllables('Uruguay').get()).to.eql(['U', 'ru', 'guay'])
    expect(new Syllables('despreciáis').get()).to.eql(['des', 'pre', 'ciáis'])
    expect(new Syllables('semiautomático').get()).to.eql(['se', 'miau', 'to', 'má', 'ti', 'co'])
    expect(new Syllables('biauricular').get()).to.eql(['biau', 'ri', 'cu', 'lar'])
  })

  // hiato
  it('should separate strong vocals', function () {
    expect(new Syllables('leal').get()).to.eql(['le', 'al'])
    expect(new Syllables('teatro').get()).to.eql(['te', 'a', 'tro'])
    expect(new Syllables('aéreo').get()).to.eql(['a', 'é', 're', 'o'])
    expect(new Syllables('reo').get()).to.eql(['re', 'o'])
    expect(new Syllables('boa').get()).to.eql(['bo', 'a'])
  })

  // hiato, when weak vocal is accented
  it('should separate strong vocals, special cases', function () {
    expect(new Syllables('María').get()).to.eql(['Ma', 'rí', 'a'])
    expect(new Syllables('caía').get()).to.eql(['ca', 'í', 'a'])
    expect(new Syllables('maíz').get()).to.eql(['ma', 'íz'])
    expect(new Syllables('baúl').get()).to.eql(['ba', 'úl'])
    expect(new Syllables('salía').get()).to.eql(['sa', 'lí', 'a'])
    expect(new Syllables('oía').get()).to.eql(['o', 'í', 'a'])
  })

  it('should handle other special cases', function () {
    expect(new Syllables('Mayagüez').get()).to.eql(['Ma', 'ya', 'güez'])
    expect(new Syllables('güimo').get()).to.eql(['güi', 'mo'])
    expect(new Syllables('güiro').get()).to.eql(['güi', 'ro'])
    expect(new Syllables('guerra').get()).to.eql(['gue', 'rra'])
    expect(new Syllables('guirnalda').get()).to.eql(['guir', 'nal', 'da'])
    expect(new Syllables('guitarra').get()).to.eql(['gui', 'ta', 'rra'])
  })
})
