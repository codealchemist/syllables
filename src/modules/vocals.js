module.exports = (lang) => {
  const langMap = {
    es: {
      all: /([aeiouáéíóúü])/ig,
      default: /([aeiou])/i,
      accented: /([áéíóúü])/i,
      strong: /([aeoáéó])/i,
      accentedStrong: /([áéó])/i,
      nonAccentedStrong: /([aeo])/i,
      weak: /([iuíú])/i,
      accentedWeak: /([íú])/i,
      nonAccentedWeak: /([iu])/i,
      doubleConsonants: /(ch)|(rr)|(ll)/
    }
  }

  if (!langMap[lang]) throw new Error(`Language ${lang} not available yet.`)
  return langMap[lang]
}
