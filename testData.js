// Copyright (c) 2017 Sean Warren. All Rights Reserved.

const testHexidecimals = ['0A0A', '0029', '3F0F', '4400', '5E7F'];

const testDecimals = ['6111', '340', '-2628', '-255', '7550'];

const vectorInputs = ['F0A04000417F4000417FC040004000804001C05F205F20804000',
  'F090400047684F5057384000A040004000417F417FC040004000804001C05F204000400001400140400040007E405B2C4000804000',
  'F0A0417F40004000417FC067086708804001C0670840004000187818784000804000',
  'F0A0417F41004000417FC067086708804001C067082C3C18782C3C804000'];

document.addEventListener('DOMContentLoaded', () => {
  const Convertor = new DecimalHexidecimalConvertor();
  testDecimals.forEach((itemInArray) => {
    Convertor.testDecimal(itemInArray);
  });
  testHexidecimals.forEach((itemInArray) => {
    Convertor.testHexidecimal(itemInArray);
  });

  vectorInputs.forEach((itemInArray) => {
    const inputReader = new VectorInputReader(itemInArray);
    inputReader.convertToCommands();
  });
});
