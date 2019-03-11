/**
 * Create pseudo enum type from string.
 *
 *  input: 'aa bb cc', prefix = '.'
 *
 *  output: {
 *      AA: '.aa',
 *      BB: '.bb',
 *      CC: '.cc'
 * }
 */
export function EnumFromString(str, prefix = '') {
  const obj = {};
  const seen_keys = [];
  for (let key of str.trim().split(/ +/)) {
    // validation
    if (key in obj) {
      // obj properties
      throw new Error(`'${key}' is a not valid value`);
    } else if (seen_keys.includes(key)) {
      // duplicated words in an input string
      throw new Error(`'${key}' is not an unique word in input string`);
    } else {
      seen_keys.push(key);
    }

    obj[key.toUpperCase()] = `${prefix}${key}`;
  }
  return obj;
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Convert time in milliseconds to MM:SS format. Max time is 59:59
 * @example
 * // returns 00:01
 * timeMSToMMSS(1000)
 * @example
 * // returns 01:00
 * timeMSToMMSS(60000)
 * @param {*} milliseconds
 */
export function timeMSToMMSS(milliseconds) {
  let seconds;
  let minutes;
  const formatting = int_ => (int_ < 10 ? '0' + int_ : int_);

  if (milliseconds >= 60 * 60 * 1000) {
    minutes = 59;
    seconds = 59;
  } else {
    seconds = formatting(parseInt((milliseconds / 1000) % 60));
    minutes = formatting(parseInt((milliseconds / (1000 * 60)) % 60));
  }

  return `${minutes}:${seconds}`;
}
