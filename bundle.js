(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Syllables = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var vocals = require('./../vocals')('es');

module.exports = function (_ref) {
  var syllable = _ref.syllable;
  var addSyllable = _ref.addSyllable;
  var addToLastSyllable = _ref.addToLastSyllable;
  var addPartial = _ref.addPartial;
  var setPartial = _ref.setPartial;
  var hasSpecialEnding = _ref.hasSpecialEnding;
  var hasNext = _ref.hasNext;
  var part = _ref.part;
  var nextPart = _ref.nextPart;
  var prevPart = _ref.prevPart;

  // add curent part to syllable
  syllable += part;
  setPartial(syllable);
  // console.log('-- part: ' + part + ' / syllable: ' + syllable + ' / has next: ' + hasNext)

  // if it's the end of the word add the current syllable
  if (!hasNext) {
    // avoid lonely consonants at the end
    if (isConsonant(part)) {
      addToLastSyllable(part);
      return;
    }

    addSyllable(syllable);
    return;
  }

  if (isVocal(part)) {
    if (nextPart.length === 1 && isConsonant(nextPart)) {
      addSyllable(syllable);
      return;
    }

    if (nextPart.length === 2) {
      if (hasSpecialEnding(nextPart, ['r', 'l'])) {
        addSyllable(syllable);
        return;
      }

      if (nextPart.match(vocals.doubleConsonants)) {
        addSyllable(syllable);
        return;
      }
    }

    if (isVocal(nextPart)) {
      if (isStrongVocal(part) && isStrongVocal(nextPart)) {
        addSyllable(syllable);
        return;
      }

      if (isStrongVocal(part) || isStrongVocal(nextPart)) {
        if (isAccentedWeakVocal(part) || isAccentedWeakVocal(nextPart)) {
          addSyllable(syllable);
          return;
        }
      }
    }

    return;
  }

  if (isConsonant(part)) {
    if (part.length === 1) return;

    if (part.length === 2) {
      if (hasSpecialEnding(part, ['r', 'l'])) return;
      if (part.match(vocals.doubleConsonants)) return;

      syllable = syllable.slice(0, -1);
      addSyllable(syllable, true);
      setPartial(part[1]);
      return;
    }

    if (part.length === 3) {
      if (hasSpecialEnding(part, ['r', 'l'])) {
        syllable = syllable.replace(part, part.slice(0, 1));
        addSyllable(syllable, true);
        setPartial(part.slice(-2));
        return;
      }

      syllable = syllable.replace(part, part.slice(0, 2));
      addSyllable(syllable, true);
      setPartial(part.slice(-1));
      return;
    }

    if (part.length === 4) {
      syllable = syllable.replace(part, part.slice(0, 2));
      addSyllable(syllable, true);
      setPartial(part.slice(-2));
    }
  }

  function isVocal(str) {
    if (!str) return false;
    return str.match(vocals.default) || str.match(vocals.accented);
  }

  function isStrongVocal(str) {
    if (!str) return false;
    return str.match(vocals.strong) || str.match(vocals.accentedStrong);
  }

  function isAccentedWeakVocal(str) {
    if (!str) return false;
    return str.match(vocals.accentedWeak);
  }

  function isConsonant(str) {
    if (!str) return false;
    return !str.match(vocals.default) && !str.match(vocals.accented);
  }
};

},{"./../vocals":4}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var languages = {
  es: require('./languages/es')
};

module.exports = function () {
  function SyllablesProcessor(lang) {
    _classCallCheck(this, SyllablesProcessor);

    this.lang = lang || 'es';
  }

  _createClass(SyllablesProcessor, [{
    key: 'run',
    value: function run(params) {
      if (!languages[this.lang]) throw new Error('Language ' + this.lang + ' not available yet.');

      return languages[this.lang](params);
    }
  }]);

  return SyllablesProcessor;
}();

},{"./languages/es":1}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Word = require('./word');
var SyllablesProcessor = require('./syllables-processor');

/**
 * Separate passed word in syllables.
 * Rules: http://ponce.inter.edu/acad/cursos/ciencia/lasvi/modulo2.htm
 *
 * @param {string} wordString
 */
module.exports = function () {
  function Syllables(wordString, lang) {
    _classCallCheck(this, Syllables);

    this.wordString = wordString;
    this.lang = lang || 'es';
    this.processor = new SyllablesProcessor(lang);
    this.word = new Word(wordString);
  }

  _createClass(Syllables, [{
    key: 'get',
    value: function get() {
      var syllables = [];
      var syllable = '';

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
        });
      }

      return syllables;

      function addPartial(str) {
        syllable += str;
      }

      function setPartial(str) {
        syllable = str;
      }

      function addSyllable(_syllable_, keepPartial) {
        if (!_syllable_) return;
        syllables.push(_syllable_);
        if (!keepPartial) syllable = '';
      }

      function addToLastSyllable(str) {
        var totalSyllables = syllables.length;
        syllables[totalSyllables - 1] += str;
      }

      function hasSpecialEnding(str, ending) {
        var lastChar = str.slice(-1);
        return ending.indexOf(lastChar) !== -1;
      }
    }
  }]);

  return Syllables;
}();

},{"./syllables-processor":2,"./word":5}],4:[function(require,module,exports){
"use strict";

module.exports = function (lang) {
  var langMap = {
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
  };

  if (!langMap[lang]) throw new Error("Language " + lang + " not available yet.");
  return langMap[lang];
};

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var vocalsGetter = require('./vocals');

module.exports = function () {
  function Word(word, lang) {
    _classCallCheck(this, Word);

    lang = lang || 'es';

    this.word = word;
    this.hyphenated = '';
    this.vocalsRegex = vocalsGetter(lang).all;
    this.parts = [];
    this.partsCount = 0;
    this.currentIndex = -1;
    this.hasNextFlag = false;
    this.hasPrevFlag = false;
    this.init();
  }

  _createClass(Word, [{
    key: 'init',
    value: function init() {
      if (this.word.length === 1) return;

      // separate all vocals
      var temp = this.word.replace(this.vocalsRegex, '-$1-');

      // remove first hyphen
      if (temp[0] === '-') {
        temp = temp.slice(1);
      }

      // remove final hyphen
      if (temp.slice(-1) === '-') temp = temp.slice(0, -1);

      // remove consecutive hyphens
      temp = temp.replace(/--/g, '-');
      this.hyphenated = temp;

      // use an array with all syllable separations
      this.parts = temp.split('-');
      this.partsCount = this.parts.length;

      // set has next and has prev flags
      this.updateFlags(0);
    }
  }, {
    key: 'getHyphenated',
    value: function getHyphenated() {
      return this.hyphenated;
    }
  }, {
    key: 'get',
    value: function get(index) {
      if (index > this.partsCount || index < 0) throw new Error('Invalid index!');

      // update current index and return requested part
      this.currentIndex = index;
      return this.parts[index];
    }
  }, {
    key: 'updateFlags',
    value: function updateFlags(index) {
      // set next flags
      this.hasNextFlag = index < this.partsCount - 1;
      this.hasPrevFlag = index > 0;
      // console.log('== parts count: ' + partsCount + ' / index: ' + index + ' / hasNext: ', hasNext)
    }
  }, {
    key: 'hasNext',
    value: function hasNext() {
      return this.hasNextFlag;
    }
  }, {
    key: 'hasPrev',
    value: function hasPrev() {
      return this.hasPrevFlag;
    }
  }, {
    key: 'next',
    value: function next() {
      // console.log('== next: hasNext?', hasNext)
      if (!this.hasNext()) return false;

      var nextIndex = this.currentIndex + 1;
      this.updateFlags(nextIndex);
      this.currentIndex = nextIndex;
      return this.parts[nextIndex];
    }
  }, {
    key: 'lookAhead',
    value: function lookAhead() {
      if (!this.hasNext()) return false;
      return this.parts[this.currentIndex + 1];
    }
  }, {
    key: 'lookBack',
    value: function lookBack() {
      if (!this.hasPrev) return false;
      return this.parts[this.currentIndex - 1];
    }
  }, {
    key: 'current',
    value: function current() {
      return this.parts[this.currentIndex];
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.parts;
    }
  }]);

  return Word;
}();

},{"./vocals":4}]},{},[3])(3)
});