import { removeFile, getDatasetObject, updateImageFileErrorStatus } from '../datasetObjectManagers/YOLOTXTDatasetObjectManager';
import {
  removeRow, disableFinishButton, insertRowToImagesTable, changeAllImagesTableRowsToDefault,
  insertRowToAnnotationsTable,
} from '../style';
import validateYOLOTXTFormat from '../formatValidators/YOLOTXTValidator';
import { VALID_ANNOTATION_FILES_ARRAY, IMAGE_FILES_OBJECT, CLASSES_FILES_ARRAY } from '../../../consts';

// functionality here cannot be used for all, will need
// to be moved to atomic COCOJSON file

function validateExistingImages(datasetObject) {
  if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length > 0) {
    let foundValid = false;
    Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
      const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
      const validationResult = validateYOLOTXTFormat(imageFile);
      if (!validationResult.error) { foundValid = true; }
      const { name } = imageFile.body.fileMetaData;
      insertRowToImagesTable(name, validationResult);
      updateImageFileErrorStatus(name, validationResult.error);
    });
    if (!foundValid) {
      disableFinishButton();
    }
  } else {
    changeAllImagesTableRowsToDefault();
    disableFinishButton();
  }
}

function validateExistingAnnotations(datasetObject) {
  if (datasetObject[CLASSES_FILES_ARRAY].length > 0) {
    let foundValid = false;
    datasetObject[VALID_ANNOTATION_FILES_ARRAY].forEach((anntoationsFile, index, arrayObject) => {
      const validationResult = validateYOLOTXTFormat(anntoationsFile);
      const { name } = anntoationsFile.body.fileMetaData;
      insertRowToAnnotationsTable(name, validationResult);
      if (validationResult.error) {
        // arrayObject.splice(index, 1);
      } else {
        foundValid = true;
      }
    });
    // think about this
    if (!foundValid) {
      disableFinishButton();
    }
  } else {
    changeAllImagesTableRowsToDefault();
    disableFinishButton();
  }
}

// use consts for table indicators

function removeFileHandler(fileName, tableName, errorMessage) {
  const datasetObject = getDatasetObject();
  if (tableName === 'annotations') {
    removeFile(fileName, VALID_ANNOTATION_FILES_ARRAY);
    if (!errorMessage) {
      if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length === 0) {
        disableFinishButton();
        changeAllImagesTableRowsToDefault();
      } else {
        validateExistingImages(datasetObject);
      }
    }
  } else if (tableName === 'images') {
    removeFile(fileName, IMAGE_FILES_OBJECT);
    if (Object.keys(datasetObject[IMAGE_FILES_OBJECT]).length === 0) {
      disableFinishButton();
    }
  } else if (tableName === 'classes') {
    removeFile(fileName, CLASSES_FILES_ARRAY);
    if (!errorMessage) {
      if (datasetObject[CLASSES_FILES_ARRAY].length === 0) {
        disableFinishButton();
        changeAllImagesTableRowsToDefault();
      } else {
        validateExistingImages(datasetObject);
        validateExistingAnnotations(datasetObject);
      }
    }
  }
  removeRow(fileName, tableName);
}

export { removeFileHandler as default };
