import * as uploadDatasetsConsts from '../../../consts';
import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager';
import { getAllImageData } from '../../../../imageList/imageList';
import { getReuseAlreadyUploadedImagesState } from '../stateManager';
import { checkObjectProperties } from './sharedUtils';

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
    uploadDatasetsConsts.XML_POSTFIX, uploadDatasetsConsts.TAGS_STRING);
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
        uploadDatasetsConsts.XML_POSTFIX, uploadDatasetsConsts.TAGS_STRING);
      if (result.error) { return result; }
      result = checkbndBoxTag(object.bndbox);
      if (result.error) { return result; }
    }
  } else {
    let result = checkObjectProperties(requiredProperties, objectTag,
      uploadDatasetsConsts.XML_POSTFIX, uploadDatasetsConsts.TAGS_STRING);
    if (result.error) { return result; }
    result = checkbndBoxTag(objectTag.bndbox);
    if (result.error) { return result; }
  }
  return { error: false, message: '' };
}

function checkObjectTag(parsedObj) {
  const requiredProperties = { object: 'object|array' };
  return checkObjectProperties(requiredProperties, parsedObj.annotation,
    uploadDatasetsConsts.XML_POSTFIX, uploadDatasetsConsts.TAGS_STRING);
}

function checkParentTag(parsedObj) {
  const requiredProperties = { annotation: 'object' };
  return checkObjectProperties(requiredProperties, parsedObj,
    uploadDatasetsConsts.XML_POSTFIX, uploadDatasetsConsts.TAGS_STRING);
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
    const validAnnotationFiles = datasetObject[uploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY];
    if (parsedObj.fileFormat === uploadDatasetsConsts.ANNOTATION_FILE_INDICATOR) {
      return validateAnnotationsFile(parsedObj, validAnnotationFiles);
    }
    if (parsedObj.fileFormat === uploadDatasetsConsts.IMAGE_FILE_INDICATOR) {
      return validateImageFile(parsedObj, validAnnotationFiles);
    }
  }
  if (getReuseAlreadyUploadedImagesState()
    && parsedObj.fileFormat === uploadDatasetsConsts.IMAGE_FILE_INDICATOR) {
    const imageName = parsedObj.body.fileMetaData.name;
    if (isImageAlreadyUploaded(imageName)) {
      return { error: false, message: '', alreadyUploaded: true };
    }
  }
  return errorObj;
}

export { validateVOCXMLFormat as default };
