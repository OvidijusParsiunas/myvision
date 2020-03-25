import {
  removeFile, replaceActiveAnnotationFileIfRemoving, getDatasetObject,
  getActiveAnnotationFile, updateImageFileErrorStatus,
} from './datasetObjectManagers/COCOJSONDatasetObjectManager';
import {
  removeRow, changeAnnotationRowToDefault,
  insertRowToImagesTable, changeAllImagesTableRowsToDefault,
} from './style';
import validateCOCOJSONFormat from './formatValidators/COCOJSONValidator';
import {
  ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE,
  VALID_ANNOTATION_FILES_ARRAY,
  FALTY_ANNOTATION_FILES_ARRAY,
  IMAGE_FILES_OBJECT,
} from './sharedConsts/consts';

function validateExistingImages(datasetObject) {
  Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
    const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
    const validationResult = validateCOCOJSONFormat(imageFile);
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
    updateImageFileErrorStatus(name, validationResult.error);
  });
}

function setNewActiveAnnotationFileRow(activeAnnotationFile, datasetObject) {
  if (activeAnnotationFile) {
    changeAnnotationRowToDefault(activeAnnotationFile.body.fileMetaData.name);
    activeAnnotationFile.newlyActive = false;
    validateExistingImages(datasetObject);
  }
}

// functionality here cannot be used for all, will need
// to be moved to atomic COCOJSON file

function removeFileHandler(fileName, tableName, errorMessage) {
  if (tableName === 'annotations') {
    if (errorMessage) {
      let annotationsArrayName;
      if (errorMessage === ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE) {
        annotationsArrayName = VALID_ANNOTATION_FILES_ARRAY;
      } else {
        annotationsArrayName = FALTY_ANNOTATION_FILES_ARRAY;
      }
      removeFile(fileName, annotationsArrayName);
    } else {
      replaceActiveAnnotationFileIfRemoving(fileName);
      removeFile(fileName, VALID_ANNOTATION_FILES_ARRAY);
      if (getActiveAnnotationFile() !== null) {
        setNewActiveAnnotationFileRow(getActiveAnnotationFile(), getDatasetObject());
      } else {
        changeAllImagesTableRowsToDefault();
      }
    }
  } else if (tableName === 'images') {
    removeFile(fileName, IMAGE_FILES_OBJECT);
  }
  removeRow(fileName, tableName);
}

export { removeFileHandler as default };
