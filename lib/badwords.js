const localList = require('./lang.json').words;
const baseList = require('badwords-list').array;

class Filter {

  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   * @param {string} options.splitRegex - Regular expression used to split a string into words.
   */
  constructor(options = {}) {
    Object.assign(this, {
      list: options.emptyList && [] || Array.prototype.concat.apply(localList, [baseList, options.list || []]),
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /\b/,
      placeHolder: options.placeHolder || '*',
      regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
      replaceRegex: options.replaceRegex || /\w/g
    })
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    var i;
    // Chinese part
    var length = this.list.length;
    for (i = (length - 1); i >= 0; i--) {
        if (string.indexOf(this.list[i]) > -1) {
            return true;
        }
    }
    // English part
    string = string.toLowerCase();

    var words = string.split(" ");
    for (i = 0; i < words.length; i++) {
      var word = words[i].toLowerCase();
      for (let i=0; i < this.list.length; i++) {
        if (word.match(this.list[i]) !== null) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
  replaceWord(string, target) {
    var t = "", i;
    for(i=0; i < target.length; i++){
        t += this.placeHolder;
    }
    return string.replace(new RegExp(target, 'g'), t);
  }

  cleanWord (word) {
    var t = "", i;
    for(i=0; i < word.length; i++){
        t += this.placeHolder;
    }
    return t;
}
  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */

  clean(string) {
    var i;
    this.list.splice(this.list.indexOf("hell"))
    this.list.splice(this.list.indexOf("tit"))
    this.list.splice(this.list.indexOf("cu"))
    // English part
    string = string.toLowerCase();

    var length = this.list.length;
    for (i = 0; i < length; i++) {
        if (string.indexOf(this.list[i]) > -1) {
          string = this.replaceWord(string, this.list[i]);
        } 
    }

    string = this.replaceWholeWord(string)

    return string;
  }

  replaceWholeWord(string) {
    var specialCaterBadword = ""
        
    if (/\bhell\b/i.test(string)) {
      specialCaterBadword = "hell"
    } else if (/\bcu\b/i.test(string)) {
      specialCaterBadword = "cu"
    } else if (/\btit\b/i.test(string)) {
      specialCaterBadword = "tit"
    }

    if (specialCaterBadword.length != 0) {
      var t = "", i;
      for(i=0; i < specialCaterBadword.length; i++){
          t += this.placeHolder;
      }
      return string.replace(new RegExp('\\b'+specialCaterBadword+'\\b', 'g'), t)
    }
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
  addWords() {
    let words = Array.from(arguments);

    this.list.push(...words);

    words
      .map(word => word.toLowerCase())
      .forEach((word) => {
        if (this.exclude.includes(word)) {
          this.exclude.splice(this.exclude.indexOf(word), 1);
        }
      });
  }

  /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
  removeWords() {
    this.exclude.push(...Array.from(arguments).map(word => word.toLowerCase()));
  }
}

module.exports = Filter;
