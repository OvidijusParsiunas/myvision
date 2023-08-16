import {
  CSV_POSTFIX, ANNOTATION_FILE_INDICATOR,
  ACTIVE_ANNOTATION_FILE, IMAGE_FILE_INDICATOR, VALID_ANNOTATION_FILES_ARRAY,
} from '../../../consts';
import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager';
import { getTextFromDictionary } from '../../../../text/languages/language';
import { getReuseAlreadyUploadedImagesState } from '../../../state';
import { getAllImageData } from '../../../../imageList/imageList';
import { checkObjectProperties } from './sharedUtils';

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
    return { error: true, message: getTextFromDictionary('UPLOAD_DATASETS_FORMAT_VALIDATAOR_IMAGE_NOT_SPECIFIED'), alreadyUploaded };
  }
  return { error: false, message: '', alreadyUploaded };
}

function checkAllRows(rows) {
  for (let i = 0; i < rows.length; i += 1) {
    if (rows[i].length !== 8) {
      return { error: true, message: `${getTextFromDictionary('CSV_ATTRIBUTES_1')}${i + 1}${getTextFromDictionary('CSV_ATTRIBUTES_2')}${rows[i].length}${getTextFromDictionary('CSV_ATTRIBUTES_3')}` };
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
      CSV_POSTFIX, getTextFromDictionary('PROPERTIES'));
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
