'use strict';

const {readFile} = require(`fs/promises`);
const {DEFAULT_ENCODING} = require(`./constants`);

/**
 * Shuffle items in array
 *
 * @param {array} items
 * @return {array}
 */
const shuffle = (items) => {
  const someArray = items.slice();

  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};


/**
 * Generate random integer
 *
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Read file
 *
 * @param {string} dirFile
 */

const readingFileByLine = async (dirFile) => {
  let content = await readFile(dirFile, {encoding: DEFAULT_ENCODING});
  content = content.split(`\n`);
  content.pop();

  return content;
};

module.exports = {
  shuffle,
  getRandomInt,
  readingFileByLine
};