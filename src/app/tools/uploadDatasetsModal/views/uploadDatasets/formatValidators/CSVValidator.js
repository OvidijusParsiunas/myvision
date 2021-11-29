import {
  CSV_POSTFIX, PROPERTIES_STRING, ACTIVE_ANNOTATION_FILE,
  ANNOTATION_FILE_INDICATOR, IMAGE_FILE_INDICATOR, VALID_ANNOTATION_FILES_ARRAY,
} from '../../../consts.js';
import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager.js';
import { getAllImageData } from '../../../../imageList/imageList.js';
import { getReuseAlreadyUploadedImagesState } from '../../../state.js';
import { checkObjectProperties } from './sharedUtils.js';

function checkObject(JSONObject, validators) {
  for (let i = 0; i < validators.length; i += 1) {
    const result = validators[i](JSONObject.annotationData);
    if (result.error) {
      return result;
    }
  }
  return { error: false, message: '' };
}

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

function validateImageFile(parsedObj, validAnnotationFiles, activeAnnotationFile) {
  const imageName = parsedObj.body.fileMetaData.name;
  const alreadyUploaded = getReuseAlreadyUploadedImagesState()
    ? isImageAlreadyUploaded(imageName) : false;
  if (validAnnotationFiles.length > 0) {
    const { annotationData } = activeAnnotationFile.body;
    for (let i = 0; i < annotationData.length; i += 1) {
      if (imageName === annotationData[i][0]) {
        return {
          error: false, message: '', alreadyUploaded, valid: true,
        };
      }
    }
    return { error: true, message: 'This image is not specified in the annotations file(s)', alreadyUploaded };
  }
  return { error: false, message: '', alreadyUploaded };
}

function checkAllRows(rows) {
  for (let i = 0; i < rows.length; i += 1) {
    if (rows[i].length !== 8) {
      return { error: true, message: `Row ${i + 1} contains ${rows[i].length} attributes, but the expected number is 8` };
    }
    const attributes = rows[i];
    const annotationFields = {};
    annotationFields['filename(1)'] = attributes[0];
    annotationFields['width(2)'] = attributes[1];
    annotationFields['height(3)'] = attributes[2];
    annotationFields['class(4)'] = attributes[3];
    annotationFields['xmin(5)'] = attributes[4];
    annotationFields['ymin(6)'] = attributes[5];
    annotationFields['xmax(7)'] = attributes[6];
    annotationFields['ymax(8)'] = attributes[7];
    const requiredProperties = {
      'filename(1)': 'string',
      'width(2)': 'number',
      'height(3)': 'number',
      'class(4)': 'number|string',
      'xmin(5)': 'number',
      'ymin(6)': 'number',
      'xmax(7)': 'number',
      'ymax(8)': 'number',
    };
    const result = checkObjectProperties(requiredProperties, annotationFields,
      CSV_POSTFIX, PROPERTIES_STRING);
    if (result.error) {
      result.message += ` -> on row ${i + 1}`;
      return result;
    }
  }
  return { error: false, message: '' };
}

function validateAnnotationsFile(parsedObj, validAnnotationFiles) {
  const validators = [
    checkAllRows,
  ];
  const validationResult = checkObject(parsedObj.body, validators);
  if (!validationResult.error) {
    setCurrentAnnotationFilesToInactive(validAnnotationFiles);
    parsedObj.active = true;
  }
  return validationResult;
}

function validateCSVFormat(parsedObj, errorObj) {
  if (!errorObj) {
    const datasetObject = datasetObjectManager.getDatasetObject();
    const activeAnnotationFile = datasetObject[ACTIVE_ANNOTATION_FILE];
    const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
      return validateAnnotationsFile(parsedObj, validAnnotationFiles);
    }
    if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
      return validateImageFile(parsedObj, validAnnotationFiles, activeAnnotationFile);
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

export { validateCSVFormat as default };
