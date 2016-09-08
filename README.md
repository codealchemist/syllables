# syllables
Splits Spanish words into syllables.

### Running from the command line
`npm start [word]`

or

`node src/index.js [word]`

### Examples
`npm start Luisa` --> `Luisa: Lui-sa`

`node src/index.js Uruguay` --> `Uruguay: U-ru-guay`

### Programmatic usage

You can require `syllables.js` in your project and use it programmatically:

`new Syllables('amplitud').get()` --> `['am', 'pli', 'tud']`

### Client side usage

Syllables provides a browserified bundle that runs in the browser.

You can install it using Bower and use it programmatically as shown in the previous example:

`bower install syllables --save`

### Test
`npm test` tests coding style and runs unit tests

`npm run test-watch` runs unit tests and watches for changes to retest

### Available languages
Right now the only available language is Spanish, but if someone wants to collaborate it would be great to add support for more!

Looking at `src/modules/languages/es.js` and `src/modules/vocals.js` is the place to start for creating a new language.

### Language reference

[Spanish](http://ponce.inter.edu/acad/cursos/ciencia/lasvi/modulo2.htm)
