// Copyright (c) 2017 Sean Warren. All Rights Reserved.

/**
 * @class VectorInputReader
 *
 * @classdesc The Class containing all of the VectorInputReader Logic.
 * @memberof Utilities, DecimalHexidecimalConvertor
 * @param  {number} input The Vector Value to Decode.
 */
function VectorInputReader(input) {
  VectorInputReaderInput = input;
  VectorInputReaderColor = [];
  VectorInputReaderInputMoves = [];

  VectorInputReader.DecimalHexidecimalConvertor = Object.create(
    DecimalHexidecimalConvertor.prototype);
  VectorInputReader.Utilities = Object.create(Utilities.prototype);
}

/**
* VectorInputReader.prototype.clearCommand - Creates the Clear Command
* @memberof VectorInputReader
* @return {string} The Clear Command
*/

VectorInputReader.prototype.clearCommand = () => 'CLR;\n';

/**
* VectorInputReader.prototype.penCommand  - Creates the Pen Commands
* @memberof VectorInputReader
* @param  {array} input The Array of The Commands
* @param  {number} index The Index in the Array.
* @return {string} The Pen Commands
*/

VectorInputReader.prototype.penCommand = (array, index) => {
  const pen = VectorInputReader.DecimalHexidecimalConvertor.decodeHex(
    array[index + 1], array[index + 2]);
  return `PEN${pen ? ' DOWN\n' : ' UP\n'}`;
};

/**
* VectorInputReader.prototype.polorCommand  - Creates the Color Commands
* @memberof VectorInputReader
* @param  {array} input The Array of The Commands
* @param  {number} index The Index in the Array.
* @return {string} The Color Commands
*/

VectorInputReader.prototype.colorCommand = (array, index) => {
  const r = VectorInputReader.DecimalHexidecimalConvertor.decodeHex(
    array[index + 1], array[index + 2]);
  const g = VectorInputReader.DecimalHexidecimalConvertor.decodeHex(
    array[index + 3], array[index + 4]);
  const b = VectorInputReader.DecimalHexidecimalConvertor.decodeHex(
    array[index + 5], array[index + 6]);
  const a = VectorInputReader.DecimalHexidecimalConvertor.decodeHex(
    array[index + 7], array[index + 8]);
  VectorInputReaderColor.push({ r, g, b, a });
  return `CO ${r} ${g} ${b} ${a}\n`;
};

/**
* VectorInputReader.prototype.createMoveCommands  - Creates the Move
* @memberof VectorInputReader
* @param  {array} array The Array of The Commands
* @param  {array} previousValues The Previous Move Commands
* @return {string} The Moves
*/

VectorInputReader.prototype.createMoveCommands = (array, previousValues) => {
  let tempString = '';
  let outputString = '';
  let cameFromOutOfBounds = false;
  let wentOutOfBounds = false;
  let currentPenX = Number(previousValues[0].hiByte);
  let currentPenY = Number(previousValues[0].loByte);
  VectorInputReaderInputMoves.push({ 0: currentPenX, 1: currentPenY });
  let oldPenX = currentPenX;
  let oldPenY = currentPenY;

  array.forEach((itemInArray) => {
    const currentX = itemInArray[0];
    const currentY = itemInArray[1];
    let currentScreenX = 0;
    let currentScreenY = 0;
    cameFromOutOfBounds = false;
    tempString = '';

    currentPenX += Number(currentX);
    currentPenY += Number(currentY);
    currentScreenX = currentPenX;
    currentScreenY = currentPenY;

    if ((currentPenX < -8192 || currentPenX > 8191
    || currentPenY < -8192 || currentPenY > 8191
    ) && !wentOutOfBounds) {
      wentOutOfBounds = true;
      tempString += '\nPEN UP;\nMV ';
    } else if (wentOutOfBounds) {
      wentOutOfBounds = false;
      cameFromOutOfBounds = true;
      tempString += '\nPEN DOWN;\nMV ';

      if (oldPenX > 8191) {
        currentScreenX = '8191';
        currentScreenY = VectorInputReader.Utilities.calculateYValue(
        oldPenX, oldPenY, currentPenX, currentPenY, currentScreenX);
      } else if (oldPenX < -8192) {
        currentScreenX = '-8191';
        currentScreenY = VectorInputReader.Utilities.calculateYValue(
        oldPenX, oldPenY, currentPenX, currentPenY, currentScreenX);
      }
    }
    if (tempString.length > 0) {
      if (cameFromOutOfBounds) {
        currentScreenX = 8191;
        oldPenY += oldPenX;
        oldPenX += oldPenX;
        currentScreenY = VectorInputReader.Utilities.calculateYValue(
        oldPenX, oldPenY, currentPenX, currentPenY, currentScreenX);
      }
      if (currentPenX > 8191 || currentPenX < -8192) {
        currentScreenX = currentPenX > 8191 ? 8191 : -8192;
        currentScreenY = VectorInputReader.Utilities.calculateYValue(
        oldPenX, oldPenY, currentPenX, currentPenY, currentScreenX);
      }
      if (currentPenY > 8191 || currentPenY < -8192) {
        currentScreenY = currentPenY > 8191 ? 8191 : -8192;
        currentScreenX = VectorInputReader.Utilities.calculateXValue(
        oldPenX, oldPenY, currentPenX, currentPenY, currentScreenY);
      }
    }

    oldPenX = itemInArray[0];
    oldPenY = itemInArray[1];

    VectorInputReaderInputMoves.push({ 0: currentScreenX, 1: currentScreenY, 2: tempString });
    outputString += `(${currentScreenX}, ${currentScreenY}); ${tempString}`;
  });
  if (cameFromOutOfBounds) {
    VectorInputReaderInputMoves.push({ 0: currentPenX, 1: currentPenY });

    outputString += ` (${currentPenX},  ${currentPenY}); `;
  }
  return outputString;
};

/**
* VectorInputReader.prototype.moveCommand  - Creates the Move Commands
* @memberof VectorInputReader
* @param  {array} array The Array of The Commands
* @param  {number} index The Index in the Array
* @param  {string} pen The Pen Orientation
* @param  {array} previousValues The Previous Move Commands
* @return {string} The Moves Commands
*/

VectorInputReader.prototype.moveCommand = (array, index, pen, previousValues) => {
  const outputString = [];

  if (pen === 'U') {
    const hiByte = VectorInputReader.DecimalHexidecimalConvertor.decodeHex(
    array[index + 1], array[index + 2]);
    const loByte = VectorInputReader.DecimalHexidecimalConvertor.decodeHex(
    array[index + 3], array[index + 4]);
    return {
      commands: `MV (${hiByte}, ${loByte});\n`,
      previousValues: {
        hiByte,
        loByte,
      },
    };
  }
  const moves = VectorInputReader.Utilities.allIndexOf(array, '80');
  const [hi, low] = moves;
  const nArray = array.slice(hi, low).join('').slice(4);
  const convertToArray = nArray.match(/.{1,4}/g);

  convertToArray.forEach((itemInArray) => {
    const [hiByte, lowByte] = VectorInputReader.Utilities.splitAt(2)(itemInArray);
    outputString.push(VectorInputReader.DecimalHexidecimalConvertor.decodeHex(hiByte, lowByte));
  });

  const list = outputString.slice(1);
  const roundedList = list.map((itemInArray) => {
    let item = itemInArray;
    Math.round(item);
    if (item === 8032) {
      item = '8000';
    }
    if (item === -8032) {
      item = '-8000';
    }
    if (item === -5064) {
      item = '-5000';
    }
    if (item === 5064) {
      item = '5000';
    }

    return item;
  });
  const pairedValues = VectorInputReader.Utilities.pairArray(roundedList);
  return {
    commands: `MV ${VectorInputReader.prototype.createMoveCommands(pairedValues, previousValues)}\n`,
  };
};

/**
* VectorInputReader.prototype.parseAdress  -  Parse the Input Adress
* @memberof VectorInputReader
* @param  {string} input The Input String.
* @param  {string} location DOM Location Variable.
* @return {null} Inserts Commands into DOM.
*/

VectorInputReader.prototype.parseAdress = (input, location = 'test') => {
  const convertToArray = input;
  let outputString = '';
  let penOrientation = 'U';
  const previousValues = [];
  convertToArray.forEach((a, index) => {
    if (a === 'F0') {
      outputString += VectorInputReader.prototype.clearCommand();
    }
    if (a === '80') {
      outputString += VectorInputReader.prototype.penCommand(convertToArray, index);
    }
    if (a === 'A0') {
      outputString += VectorInputReader.prototype.colorCommand(convertToArray, index);
    }
    if (a === 'C0') {
      const values = VectorInputReader.prototype.moveCommand(convertToArray
, index, penOrientation, previousValues);
      outputString += values.commands;
      previousValues.push(values.previousValues);
      penOrientation = 'D';
    }
  });

  if (location === 'test') {
    const testData = document.getElementById('testData');
    testData.insertAdjacentHTML('beforeend', `<div id="vectorTitle"> <hr>Parsing: ${VectorInputReaderInput}<hr></div>`);
    testData.insertAdjacentHTML('beforeend', `<pre>${outputString}</pre><hr>`);
  } else {
    if (outputString.includes('Please')) {
      const results = document.getElementById('results');
      results.innerHTML = '<hr>Error Please Enter A Valid Vector Input<hr>';
    } else {
      const results = document.getElementById('results');
      results.innerHTML = `<div id="vectorTitle"> <hr>Parsing: ${VectorInputReaderInput}<hr></div><pre>${outputString}</pre><hr>`;
    }
  }
};
/**
* VectorInputReader.prototype.convertVectorInput  - Converts Vector Input
* @memberof VectorInputReader
* @return {null} Converts Vector Input and Inserts it into the DOM
*/

VectorInputReader.prototype.convertVectorInput = () => {
  let vectorInputData = document.getElementById('vectorInput').value;
  if (vectorInputData === '') {
    const updateData = document.getElementById('vectorInput');
    updateData.value = 'F0A04000417F4000417FC040004000804001C05F205F20804000';
    vectorInputData = 'F0A04000417F4000417FC040004000804001C05F205F20804000';
  }
  VectorInputReaderInput = vectorInputData;
  VectorInputReader.prototype.convertToCommands('results');
};

/**
* VectorInputReader.prototype.convertToCommands -  Convert String to Commands
* @memberof VectorInputReader
* @param  {string} location DOM Location Variable.
* @return {null} Converts string into Commands and Inserts it into DOM
*/

VectorInputReader.prototype.convertToCommands = (location = 'test') => {
  const input = VectorInputReaderInput;
  const convertToArray = input.match(/.{1,2}/g);
  VectorInputReader.prototype.parseAdress(convertToArray, location);
};
