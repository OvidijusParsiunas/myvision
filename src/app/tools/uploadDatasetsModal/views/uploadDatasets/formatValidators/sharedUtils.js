import { CSV_POSTFIX, XML_POSTFIX, TXT_POSTFIX } from '../../../consts.js';

function checkNumberOrStringTypeByFormat(subjectVariable, format) {
  switch (format) {
    case XML_POSTFIX:
      return typeof subjectVariable['#text'] === 'string' || !Number.isNaN(parseInt(subjectVariable['#text'], 10));
    default:
      return typeof subjectVariable === 'string' || typeof subjectVariable === 'number';
  }
}

function checkStringTypeByFormat(subjectVariable, format) {
  switch (format) {
    case XML_POSTFIX:
      return typeof subjectVariable['#text'] === 'string';
    default:
      return typeof subjectVariable === 'string';
  }
}

function checkNumberTypeByFormat(subjectVariable, format) {
  switch (format) {
    case CSV_POSTFIX:
      return !Number.isNaN(Number.parseInt(subjectVariable, 10)) && typeof Number.parseInt(subjectVariable, 10) === 'number';
    case TXT_POSTFIX:
      return !Number.isNaN(subjectVariable) && typeof subjectVariable === 'number';
    case XML_POSTFIX:
      return !Number.isNaN(parseInt(subjectVariable['#text'], 10));
    default:
      return typeof subjectVariable === 'number';
  }
}

// important - does not check for length
function assertObjectType(expectedType, subjectVariable, format) {
  switch (expectedType) {
    case 'number':
      return checkNumberTypeByFormat(subjectVariable, format);
    case 'string':
      return checkStringTypeByFormat(subjectVariable, format);
    case 'number|string':
      return checkNumberOrStringTypeByFormat(subjectVariable, format);
    case 'object':
      return typeof subjectVariable === 'object';
    case 'array':
      return Array.isArray(subjectVariable);
    case 'array:number':
      return Array.isArray(subjectVariable) && subjectVariable.filter(entry => typeof entry !== 'number').length === 0;
    case 'array:object':
      return Array.isArray(subjectVariable) && subjectVariable.filter(entry => typeof entry !== 'object').length === 0;
    default:
      return true;
  }
}

function checkArrayElements(array, name, format, {
  elementsType, length, maxLength, minLength, evenOdd,
}) {
  if (length && array.length !== length) {
    return { error: true, message: `${name} array must contain ${length} elements but instead found ${array.length}` };
  }
  if (maxLength && array.length > maxLength) {
    return { error: true, message: `${name} array must contain ${maxLength} elements at most but instead found ${array.length}` };
  }
  if (minLength && array.length < minLength) {
    return { error: true, message: `${name} array must contain at least ${minLength} elements but instead found ${array.length}` };
  }
  if (evenOdd && ((evenOdd === 'even' && array.length % 2 === 1) || (evenOdd === 'odd' && array.length % 2 === 0))) {
    return { error: true, message: `${name} array must contain an even number of elements but instead found ${array.length}` };
  }
  if (elementsType && !assertObjectType(elementsType, array, format)) {
    return { error: true, message: `${name} array contains elements of incorrect type` };
  }
  return { error: false, message: '' };
}

function checkObjectProperties(requiredProperties, subjectObject, format, entitiesType) {
  const undefinedProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (subjectObject[property] === undefined) {
      undefinedProperties.push(property);
    }
  });
  if (undefinedProperties.length > 0) {
    return { error: true, message: `The following ${entitiesType} have not been found: ${undefinedProperties.join(', ')}` };
  }
  const nullProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (subjectObject[property] === null) {
      nullProperties.push(property);
    }
  });
  if (nullProperties.length > 0) {
    return { error: true, message: `The following ${entitiesType} are null: ${nullProperties}` };
  }
  const incorrectTypeProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (!assertObjectType(requiredProperties[property], subjectObject[property], format)) {
      incorrectTypeProperties.push(property);
    }
  });
  if (incorrectTypeProperties.length > 0) {
    return { error: true, message: `The following ${entitiesType} contain an incorrect type: ${incorrectTypeProperties}` };
  }
  return { error: false, message: '' };
}

export { assertObjectType, checkObjectProperties, checkArrayElements };
