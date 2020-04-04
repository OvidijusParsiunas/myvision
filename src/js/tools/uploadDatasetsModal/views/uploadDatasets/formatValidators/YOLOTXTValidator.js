import { VALID_ANNOTATION_FILES_ARRAY, ACTIVE_CLASSES_FILE } from '../../../consts';
import { getDatasetObject } from '../datasetObjectManagers/VOCXMLDatasetObjectManager';
import { getAllImageData } from '../../../../imageList/imageList';
import { getReuseAlreadyUploadedImagesState } from '../stateManager';

function isImageAlreadyUploaded(newImageName) {
  const images = getAllImageData();
  for (let i = 0; i < images.length; i += 1) {
    if (newImageName === images[i].name) {
      return true;
    }
  }
  return false;
}

function validateImageFile(parsedObj, validAnnotationFiles) {
  const imageName = parsedObj.body.fileMetaData.name;
  const parsedImageName = imageName.substring(0, imageName.indexOf('.'));
  const alreadyUploaded = getReuseAlreadyUploadedImagesState()
    ? isImageAlreadyUploaded(imageName) : false;
  if (validAnnotationFiles.length > 0) {
    for (let i = 0; i < validAnnotationFiles.length; i += 1) {
      const annotationName = validAnnotationFiles[i].body.fileMetaData.name;
      const parsedAnnotationName = annotationName.substring(0, annotationName.indexOf('.xml'));
      if (parsedImageName === parsedAnnotationName) {
        return {
          error: false, message: '', alreadyUploaded, valid: true,
        };
      }
    }
    return { error: true, message: 'This image is not specified in any of the valid annotations file(s)', alreadyUploaded };
  }
  return { error: false, message: '', alreadyUploaded };
}

// important - does not check for length
function assertType(expectedType, subjectVariable) {
  switch (expectedType) {
    case 'number':
      return !Number.isNaN(subjectVariable) && typeof subjectVariable === 'number';
    case 'string':
      return typeof subjectVariable === 'string';
    case 'number|string':
      return typeof subjectVariable === 'string' || typeof subjectVariable === 'number';
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

function checkObjectProperties(requiredProperties, subjectObject) {
  const undefinedProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (subjectObject[property] === undefined) {
      undefinedProperties.push(property);
    }
  });
  if (undefinedProperties.length > 0) {
    return { error: true, message: `The following attributes have not been found: ${undefinedProperties.join(', ')}` };
  }
  const nullProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (subjectObject[property] === null) {
      nullProperties.push(property);
    }
  });
  if (nullProperties.length > 0) {
    return { error: true, message: `The following attributes are null: ${nullProperties}` };
  }
  const incorrectTypeProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (!assertType(requiredProperties[property], subjectObject[property])) {
      incorrectTypeProperties.push(property);
    }
  });
  if (incorrectTypeProperties.length > 0) {
    return { error: true, message: `The following attributes contain an incorrect type: ${incorrectTypeProperties}` };
  }
  return { error: false, message: '' };
}

function checkObject(object, validators) {
  for (let i = 0; i < validators.length; i += 1) {
    const result = validators[i](object.annotationData);
    if (result.error) {
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkAllRows(rows) {
  for (let i = 0; i < rows.length; i += 1) {
    const attributes = rows[i];
    const annotationFields = {};
    annotationFields['class (1)'] = attributes[0];
    annotationFields['x (2)'] = attributes[1];
    annotationFields['y (3)'] = attributes[2];
    annotationFields['width (4)'] = attributes[3];
    annotationFields['height (5)'] = attributes[4];
    const requiredProperties = {
      'class (1)': 'number', 'x (2)': 'number', 'y (3)': 'number', 'width (4)': 'number', 'height (5)': 'number',
    };
    const result = checkObjectProperties(requiredProperties, annotationFields);
    if (result.error) {
      result.message += ` -> on row ${i + 1}`;
      return result;
    }
  }
  return { error: false, message: '' };
}

// check if setCurrentAnnotationFilesToInactive is actually doing something for other formats
// as the active property may not be used

// set warning on x:
// If this file belongs in the annotations table,
// make sure that each row contains exactly 5 attributes: class x y width height

function validateAgainstActiveClassesFile(parsedObj, activeClassesFile) {
  console.log('validate');
}

function validateAnnotationsFile(parsedObj, activeClassesFile) {
  const validators = [
    checkAllRows,
  ];
  const validationResult = checkObject(parsedObj.body, validators);
  if (!validationResult.error && activeClassesFile) {
    validateAgainstActiveClassesFile(parsedObj, activeClassesFile);
  }
  return validationResult;
}

function validateYOLOTXTFormat(parsedObj, errorObj) {
  if (!errorObj) {
    const datasetObject = getDatasetObject();
    const activeClassesFile = datasetObject[ACTIVE_CLASSES_FILE];
    const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    if (parsedObj.fileFormat === 'annotation') {
      return validateAnnotationsFile(parsedObj, activeClassesFile);
    }
    if (parsedObj.fileFormat === 'image') {
      return validateImageFile(parsedObj, validAnnotationFiles);
    }
    // do not need any validation for a classes file
    if (parsedObj.fileFormat === 'classes') {
      return { error: false, message: '' };
    }
  }
  if (getReuseAlreadyUploadedImagesState() && parsedObj.fileFormat === 'image') {
    const imageName = parsedObj.body.fileMetaData.name;
    if (isImageAlreadyUploaded(imageName)) {
      return { error: false, message: '', alreadyUploaded: true };
    }
  }
  return errorObj;
}

export { validateYOLOTXTFormat as default };
