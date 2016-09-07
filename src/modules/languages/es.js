const vocals = require('./../vocals')('es')

module.exports = ({syllable, addSyllable, addToLastSyllable, addPartial, setPartial, hasSpecialEnding, hasNext, part, nextPart, prevPart}) => {
  // add curent part to syllable
  syllable += part
  setPartial(syllable)
  // console.log('-- part: ' + part + ' / syllable: ' + syllable + ' / has next: ' + hasNext)

  // if it's the end of the word add the current syllable
  if (!hasNext) {
    // avoid lonely consonants at the end
    if (isConsonant(part)) {
      addToLastSyllable(part)
      return
    }

    addSyllable(syllable)
    return
  }

  if (isVocal(part)) {
    if (nextPart.length === 1 && isConsonant(nextPart)) {
      addSyllable(syllable)
      return
    }

    if (nextPart.length === 2) {
      if (hasSpecialEnding(nextPart, ['r', 'l'])) {
        addSyllable(syllable)
        return
      }

      if (nextPart.match(vocals.doubleConsonants)) {
        addSyllable(syllable)
        return
      }
    }

    if (isVocal(nextPart)) {
      if (isStrongVocal(part) && isStrongVocal(nextPart)) {
        addSyllable(syllable)
        return
      }

      if (isStrongVocal(part) || isStrongVocal(nextPart)) {
        if (isAccentedWeakVocal(part) || isAccentedWeakVocal(nextPart)) {
          addSyllable(syllable)
          return
        }
      }
    }

    return
  }

  if (isConsonant(part)) {
    if (part.length === 1) return

    if (part.length === 2) {
      if (hasSpecialEnding(part, ['r', 'l'])) return
      if (part.match(vocals.doubleConsonants)) return

      syllable = syllable.slice(0, -1)
      addSyllable(syllable, true)
      setPartial(part[1])
      return
    }

    if (part.length === 3) {
      if (hasSpecialEnding(part, ['r', 'l'])) {
        syllable = syllable.replace(part, part.slice(0, 1))
        addSyllable(syllable, true)
        setPartial(part.slice(-2))
        return
      }

      syllable = syllable.replace(part, part.slice(0, 2))
      addSyllable(syllable, true)
      setPartial(part.slice(-1))
      return
    }

    if (part.length === 4) {
      syllable = syllable.replace(part, part.slice(0, 2))
      addSyllable(syllable, true)
      setPartial(part.slice(-2))
    }
  }

  function isVocal (str) {
    if (!str) return false
    return (str.match(vocals.default) || str.match(vocals.accented))
  }

  function isStrongVocal (str) {
    if (!str) return false
    return (str.match(vocals.strong) || str.match(vocals.accentedStrong))
  }

  function isAccentedWeakVocal (str) {
    if (!str) return false
    return str.match(vocals.accentedWeak)
  }

  function isConsonant (str) {
    if (!str) return false
    return (!str.match(vocals.default) && !str.match(vocals.accented))
  }
}
