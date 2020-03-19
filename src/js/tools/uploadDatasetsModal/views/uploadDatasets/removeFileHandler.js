import {
  removeFile, replaceActiveAnnotationFileIfRemoving, getDatasetObject, getActiveAnnotationFile,
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
  IMAGE_FILES_ARRAY,
} from './sharedConsts/consts';

function validateExistingImages(datasetObject) {
  datasetObject[IMAGE_FILES_ARRAY].forEach((imageFile) => {
    const validationResult = validateCOCOJSONFormat(imageFile, datasetObject);
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
  });
}

function setNewActiveAnnotationFileRow(activeAnnotationFile, datasetObject) {
  if (activeAnnotationFile) {
    changeAnnotationRowToDefault(activeAnnotationFile.body.fileMetaData.name);
    activeAnnotationFile.newlyActive = false;
    validateExistingImages(datasetObject);
  }
}

function removeFileHandler(fileName, tableName, errorMessage) {
  let dataObjectArrayName;
  if (tableName === 'annotations') {
    if (errorMessage) {
      if (errorMessage === ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE) {
        dataObjectArrayName = VALID_ANNOTATION_FILES_ARRAY;
      } else {
        dataObjectArrayName = FALTY_ANNOTATION_FILES_ARRAY;
      }
      removeFile(fileName, dataObjectArrayName);
    } else {
      dataObjectArrayName = VALID_ANNOTATION_FILES_ARRAY;
      replaceActiveAnnotationFileIfRemoving(fileName);
      removeFile(fileName, dataObjectArrayName);
      if (getActiveAnnotationFile() !== null) {
        setNewActiveAnnotationFileRow(getActiveAnnotationFile(), getDatasetObject());
      } else {
        changeAllImagesTableRowsToDefault();
      }
    }
  } else if (tableName === 'images') {
    dataObjectArrayName = IMAGE_FILES_ARRAY;
    removeFile(fileName, dataObjectArrayName);
  }
  removeRow(fileName, tableName);
}

export { removeFileHandler as default };
