import { VALID_ANNOTATION_FILES_ARRAY, ANNOTATION_FILE_INDICATOR, IMAGE_FILE_INDICATOR } from '../../../consts';
import { getDatasetObject } from '../datasetObjectManagers/VOCXMLDatasetObjectManager';
import { getAllImageData } from '../../../../imageList/imageList';
import { getReuseAlreadyUploadedImagesState } from '../stateManager';

function setCurrentAnnotationFilesToInactive(annotationFiles) {
  annotationFiles.forEach((annotationFile) => {
    annotationFile.active = false;
  });
}

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
      return !Number.isNaN(parseInt(subjectVariable['#text'], 10));
    case 'string':
      return typeof subjectVariable['#text'] === 'string';
    case 'number|string':
      return typeof subjectVariable['#text'] === 'string' || !Number.isNaN(parseInt(subjectVariable['#text'], 10));
    case 'object':
      return typeof subjectVariable === 'object';
    case 'array':
      return Array.isArray(subjectVariable);
    case 'object|array':
      return typeof subjectVariable === 'object' || Array.isArray(subjectVariable);
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
    return { error: true, message: `The following tag(s) have not been found: ${undefinedProperties.join(', ')}` };
  }
  const nullProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (subjectObject[property] === null) {
      nullProperties.push(property);
    }
  });
  if (nullProperties.length > 0) {
    return { error: true, message: `The following tag(s) are null: ${nullProperties}` };
  }
  const incorrectTypeProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (!assertType(requiredProperties[property], subjectObject[property])) {
      incorrectTypeProperties.push(property);
    }
  });
  if (incorrectTypeProperties.length > 0) {
    return { error: true, message: `The following tag(s) contain an incorrect type: ${incorrectTypeProperties}` };
  }
  return { error: false, message: '' };
}

function checkbndBoxTag(object) {
  const requiredProperties = {
    xmin: 'number', ymin: 'number', xmax: 'number', ymax: 'number',
  };
  const result = checkObjectProperties(requiredProperties, object);
  if (result.error) { return result; }
  return { error: false, message: '' };
}

function checkObjectTagChildTags(parsedObj) {
  const requiredProperties = { name: 'number|string', bndbox: 'object' };
  const objectTag = parsedObj.annotation.object;
  if (Array.isArray(objectTag)) {
    for (let i = 0; i < objectTag.length; i += 1) {
      const object = objectTag[i];
      let result = checkObjectProperties(requiredProperties, object);
      if (result.error) { return result; }
      result = checkbndBoxTag(object.bndbox);
      if (result.error) { return result; }
    }
  } else {
    let result = checkObjectProperties(requiredProperties, objectTag);
    if (result.error) { return result; }
    result = checkbndBoxTag(objectTag.bndbox);
    if (result.error) { return result; }
  }
  return { error: false, message: '' };
}

function checkObjectTag(parsedObj) {
  const requiredProperties = { object: 'object|array' };
  return checkObjectProperties(requiredProperties, parsedObj.annotation);
}

function checkParentTag(parsedObj) {
  const requiredProperties = { annotation: 'object' };
  return checkObjectProperties(requiredProperties, parsedObj);
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

function validateAnnotationsFile(parsedObj, validAnnotationFiles) {
  const validators = [
    checkParentTag,
    checkObjectTag,
    checkObjectTagChildTags,
  ];
  const validationResult = checkObject(parsedObj.body, validators);
  if (!validationResult.error) {
    setCurrentAnnotationFilesToInactive(validAnnotationFiles);
    parsedObj.active = true;
  }
  return validationResult;
}

function validateVOCXMLFormat(parsedObj, errorObj) {
  if (!errorObj) {
    const datasetObject = getDatasetObject();
    const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
      return validateAnnotationsFile(parsedObj, validAnnotationFiles);
    }
    if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
      return validateImageFile(parsedObj, validAnnotationFiles);
    }
  }
  if (getReuseAlreadyUploadedImagesState() && parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
    const imageName = parsedObj.body.fileMetaData.name;
    if (isImageAlreadyUploaded(imageName)) {
      return { error: false, message: '', alreadyUploaded: true };
    }
  }
  return errorObj;
}

export { validateVOCXMLFormat as default };
