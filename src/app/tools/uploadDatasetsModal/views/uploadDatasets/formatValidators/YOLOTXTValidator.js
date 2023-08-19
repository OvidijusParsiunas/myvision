import datasetObjectManager from '../datasetObjectManagers/YOLOTXTDatasetObjectManager';
import { getTextFromDictionary } from '../../../../text/languages/language';
import { getReuseAlreadyUploadedImagesState } from '../../../state';
import { getAllImageData } from '../../../../imageList/imageList';
import { checkObjectProperties } from './sharedUtils';
import {
  IMAGE_FILE_INDICATOR, VALID_ANNOTATION_FILES_ARRAY, ACTIVE_CLASSES_FILE,
  TXT_POSTFIX, ANNOTATION_FILE_INDICATOR, CLASSES_FILE_INDICATOR,
} from '../../../consts';

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
      const parsedAnnotationName = annotationName.substring(0, annotationName.indexOf('.txt'));
      if (parsedImageName === parsedAnnotationName) {
        return {
          error: false, message: '', alreadyUploaded, valid: true,
        };
      }
    }
    return { error: true, message: getTextFromDictionary('IMAGE_NOT_VALID_IN_ANNOTATIONS'), alreadyUploaded };
  }
  return { error: false, message: '', alreadyUploaded };
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
    const result = checkObjectProperties(requiredProperties, annotationFields,
      TXT_POSTFIX, getTextFromDictionary('ATTRIBUTES'));
    if (result.error) {
      result.message += ` -> ${getTextFromDictionary('YOLO_ROW_1')}${i + 1}${getTextFromDictionary('YOLO_ROW_2')}`;
      return result;
    }
  }
  return { error: false, message: '' };
}

// check if setCurrentAnnotationFilesToInactive is actually doing something for other formats
// as the active property may not be used

function validateAnnotationsAgainstActiveClassesFile(parsedObj, activeClassesFile) {
  const { annotationData } = parsedObj.body;
  const numberOfClasses = activeClassesFile.body.annotationData.length;
  for (let i = 0; i < annotationData.length; i += 1) {
    if (Math.abs(annotationData[i][0]) > numberOfClasses - 1) {
      return { error: true, message: `${getTextFromDictionary('YOLO_CLASS_1')}${annotationData[i][0]}, ${getTextFromDictionary('YOLO_CLASS_2')}${numberOfClasses}${getTextFromDictionary('YOLO_CLASS_3')}` };
    }
  }
  return { error: false, message: '', valid: true };
}

function validateAnnotationsFile(parsedObj, activeClassesFile) {
  const validators = [
    checkAllRows,
  ];
  const validationResult = checkObject(parsedObj.body, validators);
  if (!validationResult.error && activeClassesFile) {
    return validateAnnotationsAgainstActiveClassesFile(parsedObj, activeClassesFile);
  }
  return validationResult;
}

function validateYOLOTXTFormat(parsedObj, errorObj) {
  if (!errorObj) {
    const datasetObject = datasetObjectManager.getDatasetObject();
    const activeClassesFile = datasetObject[ACTIVE_CLASSES_FILE];
    const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
      return validateAnnotationsFile(parsedObj, activeClassesFile);
    }
    if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
      return validateImageFile(parsedObj, validAnnotationFiles);
    }
    // do not need any validation for a classes file
    if (parsedObj.fileFormat === CLASSES_FILE_INDICATOR) {
      return { error: false, message: '' };
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

export { validateYOLOTXTFormat as default };
