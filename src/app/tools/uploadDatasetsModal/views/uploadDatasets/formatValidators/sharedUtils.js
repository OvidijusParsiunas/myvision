import { getTextFromDictionary } from '../../../../text/languages/language';
import { CSV_POSTFIX, XML_POSTFIX, TXT_POSTFIX } from '../../../consts';

type Format = typeof CSV_POSTFIX | typeof XML_POSTFIX | typeof TXT_POSTFIX;
type Type = 'number' | 'string' | 'object' | 'array' | 'array:number' | 'array:object';

function checkNumberOrStringTypeByFormat(subjectVariable: any, format: Format): boolean {
  switch (format) {
    case XML_POSTFIX:
      return typeof subjectVariable['#text'] === 'string' || !Number.isNaN(parseInt(subjectVariable['#text'], 10));
    case CSV_POSTFIX:
    case TXT_POSTFIX:
      return !Number.isNaN(subjectVariable) && typeof subjectVariable === 'number';
    default:
      return false;
  }
}

function checkStringTypeByFormat(subjectVariable: any, format: Format): boolean {
  switch (format) {
    case XML_POSTFIX:
      return typeof subjectVariable['#text'] === 'string';
    default:
      return typeof subjectVariable === 'string';
  }
}

function checkNumberTypeByFormat(subjectVariable: any, format: Format): boolean {
  switch (format) {
    case CSV_POSTFIX:
      return !Number.isNaN(Number.parseInt(subjectVariable, 10)) && typeof Number.parseInt(subjectVariable, 10) === 'number';
    case TXT_POSTFIX:
      return !Number.isNaN(subjectVariable) && typeof subjectVariable === 'number';
    case XML_POSTFIX:
      return !Number.isNaN(parseInt(subjectVariable['#text'], 10));
    default:
      return false;
  }
}

function assertObjectType(expectedType: Type, subjectVariable: any, format: Format): boolean {
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
      return Array.isArray(subjectVariable) && subjectVariable.every((entry) => typeof entry === 'number');
    case 'array:object':
      return Array.isArray(subjectVariable) && subjectVariable.every((entry) => typeof entry === 'object');
    default:
      return true;
  }
}

function checkArrayElements(array: any[], name: string, format: Format, {
  elementsType, length, maxLength, minLength, evenOdd,
}: {
  elementsType?: Type;
  length?: number;
  maxLength?: number;
  minLength?: number;
  evenOdd?: 'even' | 'odd';
}): { error: boolean; message?: string } {
  if (length && array.length !== length) {
    return { error: true, message: `${name} ${getTextFromDictionary('SHARED_ARRAY_CONTAIN')}${length}${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_1')}${array.length}${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_2')}` };
  }
  if (maxLength && array.length > maxLength) {
    return { error: true, message: `${name} ${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_AT_MOST_0')}${maxLength}${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_AT_MOST_1')}${array.length}${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_2')}` };
  }
  if (minLength && array.length < minLength) {
    return { error: true, message: `${name} ${getTextFromDictionary('SHARED_ARRAY_CONTAIN_AT_LEAST')}${minLength}${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_1')}${array.length}${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_2')}` };
  }
  if (evenOdd && ((evenOdd === 'even' && array.length % 2 === 1) || (evenOdd === 'odd' && array.length % 2 === 0))) {
    return { error: true, message: `${name} ${getTextFromDictionary('SHARED_EVEN_NUMBER_OF_ELEMENTS_1')}${array.length}${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_2')}` };
  }
  if (elementsType && !array.every((entry) => assertObjectType(elementsType, entry, format))) {
    return { error: true, message: `${name} ${getTextFromDictionary('SHARED_ELEMENTS_INCORRECT_TYPE')}` };
  }
  if (array.length === 0 && elementsType) {
    return { error: true, message: `${name} ${getTextFromDictionary('SHARED_ARRAY_CONTAIN_AT_LEAST_1')}${elementsType}${getTextFromDictionary('SHARED_ELEMENTS_BUT_FOUND_0')}` };
  }
  return { error: false, message: '' };
}

function checkObjectProperties(requiredProperties: { [key: string]: Type }, subjectObject: any, format: Format, entitiesType: string): { error: boolean; message?: string } {
  const undefinedProperties = Object.keys(requiredProperties).filter((property) => subjectObject[property] === undefined);
  if (undefinedProperties.length > 0) {
    return {
      error: true,
      message: `${getTextFromDictionary('THE_FOLLOWING_HAVE_NOT_BEEN_FOUND')}${entitiesType}${getTextFromDictionary('HAVE_NOT_FOUND')}: ${undefinedProperties.join(', ')}`,
    };
  }
  const nullProperties = Object.keys(requiredProperties).filter((property) => subjectObject[property] === null);
  if (nullProperties.length > 0) {
    return { error: true, message: `${getTextFromDictionary('THE_FOLLOWING_SHORT')}${entitiesType}${getTextFromDictionary('ARE')}null: ${nullProperties}` };
  }
  const incorrectTypeProperties = Object.keys(requiredProperties).filter((property) => !assertObjectType(requiredProperties[property], subjectObject[property], format));
  if (incorrectTypeProperties.length > 0) {
    return { error: true, message: `${getTextFromDictionary('THE_FOLLOWING_SHORT')}${entitiesType}${getTextFromDictionary('CONTAIN_INCORRECT_TYPE')}: ${incorrectTypeProperties}` };
  }
  return { error: false, message: '' };
}

export { assertObjectType, checkObjectProperties, checkArrayElements };
