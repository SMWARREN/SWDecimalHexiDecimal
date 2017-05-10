// Copyright (c) 2017 Sean Warren. All Rights Reserved.

/**
 * @class Utilities
 *
 * @classdesc The Class containing all of the Utilities Logic.
 */

function Utilities() {}

/**
* Utilities.prototype.splitAt - Splits a value into seperate lists
* @memberof Utilities
* @param  {number} index     The value of the split.
* @param  {array} splitArray The array with the value.
* @return {array}         A split list.
*/

Utilities.prototype.splitAt = index => splitArray => [splitArray.slice(0, index),
  splitArray.slice(index)];

/**
* Utilities.prototype.calculateYValue - Calculate Y Value Using Slope
* @memberof Utilities
* @param  {number} oldPenX     The old Pen X Value.
* @param  {number} oldPenY     The old Pen Y Value.
* @param  {number} currentPenX The new Pen X Value.
* @param  {number} currentPenY The new Pen Y Value.
* @param  {number} x - The X value for Y Value.
* @returns {number} - The Y Value.
*/

Utilities.prototype.calculateYValue = (oldPenX, oldPenY, currentPenX, currentPenY, x) => {
  const fy = currentPenY - oldPenY;
  const fx = currentPenX - oldPenX;
  const m = parseFloat(fy / fx);
  const b1 = m * oldPenX;
  const b = parseFloat(oldPenY - b1);
  const y = parseFloat((m * x) + b);
  return Math.round(isNaN(y) ? 0 : y);
};

/**
* Utilities.prototype.calculateXalue - Calculate X Value Using Slope
* @memberof Utilities
* @param  {number} oldPenX     The old Pen X Value.
* @param  {number} oldPenY     The old Pen Y Value.
* @param  {number} currentPenX The new Pen X Value.
* @param  {number} currentPenY The new Pen Y Value.
* @param  {number} Y - The Y value for X Value.
* @returns {number} - The X Value.
*/

Utilities.prototype.calculateXValue = (oldPenX, oldPenY, currentPenX, currentPenY, y) => {
  const fy = currentPenY - oldPenY;
  const fx = currentPenX - oldPenX;
  const m = parseFloat(fy / fx);
  const b = parseFloat(oldPenY - m * oldPenX);
  const x = parseFloat((y - b) / m);
  return Math.round(isNaN(x) ? 0 : x);
};

/**
* Utilities.prototype.allIndexOf - Find all instances of string
* @memberof Utilities
* @param  {array}  str     The Search Array.
* @param  {string} toSearch The String to Search For in the Array.
* @return {array}         An array with a list of occurence locations.
*/

Utilities.prototype.allIndexOf = (str, toSearch) => {
  const indices = [];
  for (let pos = str.indexOf(toSearch); pos !== -1; pos = str.indexOf(toSearch, pos + 1)) {
    indices.push(pos);
  }
  return indices;
};

/**
* Utilities.prototype.pairArray - Combined the values to Decode
* @memberof Utilities
* @param  {array}  arrayToPair     The Array to Pair.
* @return {array}         An array with paired Values.
*/

Utilities.prototype.pairArray = (arrayToPair) => {
  const temp = arrayToPair.slice();
  const arr = [];
  while (temp.length) {
    arr.push(temp.splice(0, 2));
  }
  return arr;
};
