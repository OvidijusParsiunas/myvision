import {
  IMAGE_FILE_INDICATOR, VALID_ANNOTATION_FILES_ARRAY,
  XML_POSTFIX, TAGS_STRING, ANNOTATION_FILE_INDICATOR,
} from '../../../consts.js';
import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager.js';
import { getAllImageData } from '../../../../imageList/imageList.js';
import { getReuseAlreadyUploadedImagesState } from '../../../state.js';
import { checkObjectProperties } from './sharedUtils.js';

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

function checkbndBoxTag(object) {
  const requiredProperties = {
    xmin: 'number', ymin: 'number', xmax: 'number', ymax: 'number',
  };
  const result = checkObjectProperties(requiredProperties, object,
    XML_POSTFIX, TAGS_STRING);
  if (result.error) { return result; }
  return { error: false, message: '' };
}

function checkObjectTagChildTags(parsedObj) {
  const requiredProperties = { name: 'number|string', bndbox: 'object' };
  const objectTag = parsedObj.annotation.object;
  if (Array.isArray(objectTag)) {
    for (let i = 0; i < objectTag.length; i += 1) {
      const object = objectTag[i];
      let result = checkObjectProperties(requiredProperties, object,
        XML_POSTFIX, TAGS_STRING);
      if (result.error) { return result; }
      result = checkbndBoxTag(object.bndbox);
      if (result.error) { return result; }
    }
  } else {
    let result = checkObjectProperties(requiredProperties, objectTag,
      XML_POSTFIX, TAGS_STRING);
    if (result.error) { return result; }
    result = checkbndBoxTag(objectTag.bndbox);
    if (result.error) { return result; }
  }
  return { error: false, message: '' };
}

function checkObjectTag(parsedObj) {
  const requiredProperties = { object: 'object|array' };
  return checkObjectProperties(requiredProperties, parsedObj.annotation,
    XML_POSTFIX, TAGS_STRING);
}

function checkParentTag(parsedObj) {
  const requiredProperties = { annotation: 'object' };
  return checkObjectProperties(requiredProperties, parsedObj,
    XML_POSTFIX, TAGS_STRING);
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
    const datasetObject = datasetObjectManager.getDatasetObject();
    const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
      return validateAnnotationsFile(parsedObj, validAnnotationFiles);
    }
    if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
      return validateImageFile(parsedObj, validAnnotationFiles);
    }
  }
  if (getReuseAlreadyUploadedImagesState()
    && parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
    const imageName = parsedObj.body.fileMetaData.name;
    if (isImageAlreadyUploaded(imageName)) {
      return { error: false, message: '', alreadyUploaded: true };
    }
  }
  return errorObj;
}

export { validateVOCXMLFormat as default };
