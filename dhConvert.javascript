// Copyright (c) 2017 Sean Warren. All Rights Reserved.

/**
 * @class DecimalHexidecimalConvertor
 *
 * @classdesc The Class containing all of the DecimalHexidecimalConvertor Logic.
 */
function DecimalHexidecimalConvertor() {}

 /**
 * DecimalHexidecimalConvertor.prototype.padValues - Padding an Input Value
 * @memberof DecimalHexidecimalConvertor
 * @param  {number} num     The number to pad.
 * @param  {number} padding How many numbers to pad.
 * @return {number}         The Padded Number
 */

DecimalHexidecimalConvertor.prototype.padValues = (num, padding) => {
  const len = num.length;
  if (len === padding) {
    return num.toUpperCase();
  }
  const numOfZeros = padding - len;
  return num.toUpperCase() + '0'.repeat(numOfZeros);
};

 /**
 * DecimalHexidecimalConvertor.prototype.encodeDecimal - Encoding a Decimal into
 * *                                                        a Hexidecimal value.
 * @memberof DecimalHexidecimalConvertor
 * @param  {number} unencodedDecimalValue The Decimal Value to Encode.
 * @return {number}                       The Endcoded Hexidecimal Value
 */

DecimalHexidecimalConvertor.prototype.encodeDecimal = (unencodedDecimalValue) => {
  if (unencodedDecimalValue < -8192 || unencodedDecimalValue > 8191) {
    return `You have entered the number '${unencodedDecimalValue}'.<br> Please enter a number between '-8192' and '8191'.`;
  }
  const intermediateDecimal = unencodedDecimalValue += 8192;
  const hiByte = intermediateDecimal & 0x3F80;
  const loByte = intermediateDecimal & 0x007F;
  const combinedBytes = loByte + (hiByte << 1);

  const encodedHex = Number(combinedBytes).toString(16);
  return DecimalHexidecimalConvertor.prototype.padValues(encodedHex, 4);
};


 /**
 * DecimalHexidecimalConvertor.prototype.decodeHex - Decode a Hexidecimal Value
 * *                                                       into a Decimal Value.
 * @memberof DecimalHexidecimalConvertor
 * @param  {number} hiByte  The HiByte to Decode
 * @param  {number} loByte  The LoByte to Decode
 * @return {number}        The Decimal Value
 */
DecimalHexidecimalConvertor.prototype.decodeHex = (hiByte, loByte) => {
  const hByte = parseInt(hiByte, 16);
  const lByte = parseInt(loByte, 16);
  if (hByte > 127 || hByte < 0 || lByte > 127 || lByte < 0) {
    return `You have entered HiByte: ${hByte}, LoByte: ${lByte}.<br> Please enter a Hexidecimal between '0' and '127'.`;
  }
  const combinedValues = DecimalHexidecimalConvertor.prototype.padValues(`${hiByte}${loByte}`, 4);
  const decodeBytes = parseInt(combinedValues, 16);
  const hexValue = decodeBytes.toString(2);
  const hexArray = hexValue.split('');
  hexArray.splice(7, 1);

  const originialValue = parseInt(hexArray.join(''), 2) - 8192;

  return originialValue;
};

/**
 * DecimalHexidecimalConvertor.prototype.validateDecimal - Validates the input
 * * decimal and than encodes the decimal.
 * @memberof DecimalHexidecimalConvertor
 * @return {null}  An Encoded Decimal.
 */

DecimalHexidecimalConvertor.prototype.validateDecimal = () => {
  let data = document.getElementById('decimal').value;
  if (data === '') {
    const updateData = document.getElementById('decimal');
    updateData.value = '0000';
    data = '0000';
  }
  const results = document.getElementById('results');
  const val = DecimalHexidecimalConvertor.prototype.encodeDecimal(Number(`${data}`));
  results.innerHTML = `Decimal Value: ${data} <br> Hexidecimal Value: ${val}`;
};

/**
 * DecimalHexidecimalConvertor.prototype.validateHexidecimal - Validates the input
 * * Hexidecimal and than decodes the Hexidecimal.
 * @memberof DecimalHexidecimalConvertor
 * @return {null}  A Decoded Hexidecimal.
 */

DecimalHexidecimalConvertor.prototype.validateHexidecimal = () => {
  let data = document.getElementById('hexidecimal').value;
  if (data === '') {
    const updateData = document.getElementById('hexidecimal');
    updateData.value = '00';
    data = '00';
  }
  let data1 = document.getElementById('hexidecimal1').value;
  if (data1 === '') {
    const updateData = document.getElementById('hexidecimal1');
    updateData.value = '00';
    data1 = '00';
  }
  const results = document.getElementById('results');
  const val = DecimalHexidecimalConvertor.prototype.decodeHex(data, data1);
  results.innerHTML = `Hi Byte: ${data} <br> Lo Byte: ${data1} <br> Decimal Value: ${val}`;
};

/**
 * DecimalHexidecimalConvertor.prototype.testDecimal - Encode Decimal and insert
 * * into the DOM
 * @memberof DecimalHexidecimalConvertor
 * @param  {number} data The Input Decimal.
 * @return {null}      Decimal Value with Encoded Hexidecimal Value/
 */
DecimalHexidecimalConvertor.prototype.testDecimal = (data) => {
  const val = DecimalHexidecimalConvertor.prototype.encodeDecimal(Number(`${data}`));
  const testData = document.getElementById('testData');
  testData.insertAdjacentHTML('beforeend', `Decimal Value: ${data} <br> Hexidecimal Value: ${val}<p>`);
};

/**
 * DecimalHexidecimalConvertor.prototype.testHexidecimal - Decode the Hexidecimal
 * * and insert in into the dom.
 * @memberof DecimalHexidecimalConvertor
 * @param  {number} input The Input Hexidecimal.
 * @return {null}       The HiByte and LoByte with the Decoded Decimal Value.
 */

DecimalHexidecimalConvertor.prototype.testHexidecimal = (input) => {
  const splitAt = index => it => [it.slice(0, index), it.slice(index)];
  const [hiByte, lowByte] = splitAt(2)(input);
  const val = DecimalHexidecimalConvertor.prototype.decodeHex(hiByte, lowByte);
  const testData = document.getElementById('testData');
  testData.insertAdjacentHTML('beforeend', `HiByte: ${hiByte} <br> LoByte: ${lowByte} <br> Decimal Value: ${val}<p>`);
};
