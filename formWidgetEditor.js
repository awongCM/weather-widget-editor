'use strict';

var isTitleValid = function (value) {
  // allow letters, commas, numbers and spaces
  var commaDelimitedRegEx = /^[A-Za-z0-9,\s]+$/;
  return commaDelimitedRegEx.test(value);
};

var areUnitsValid = function (value) {
  //allow metric or imperial onlly
  return (value === 'metric') || (value === 'imperial'); 
};

var isShowWindValid = function (value) {
  //either true or false

  return (value.toLowerCase() === 'true' || value.toLowerCase() === 'false');
};

module.exports = {
  isTitleValid: isTitleValid,
  areUnitsValid: areUnitsValid,
  isShowWindValid: isShowWindValid
};
