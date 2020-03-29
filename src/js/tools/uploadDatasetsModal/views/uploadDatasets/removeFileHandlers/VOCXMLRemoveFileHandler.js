import {
  removeFile, getDatasetObject, updateImageFileErrorStatus,
} from '../datasetObjectManagers/VOCXMLDatasetObjectManager';
import {
  removeRow, disableFinishButton, insertRowToImagesTable, changeAllImagesTableRowsToDefault,
} from '../style';
import validateVOCXMLFormat from '../formatValidators/VOCXMLValidator';
import {
  VALID_ANNOTATION_FILES_ARRAY,
  IMAGE_FILES_OBJECT,
} from '../../../consts';

// functionality here cannot be used for all, will need
// to be moved to atomic COCOJSON file

function validateExistingImages(datasetObject) {
  let foundValid = false;
  Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
    const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
    const validationResult = validateVOCXMLFormat(imageFile);
    if (!validationResult.error) { foundValid = true; }
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
    updateImageFileErrorStatus(name, validationResult.error);
  });
  if (!foundValid) {
    disableFinishButton();
  }
}

function removeFileHandler(fileName, tableName, errorMessage) {
  const datasetObject = getDatasetObject();
  if (tableName === 'annotations') {
    if (errorMessage) {
      const annotationsArrayName = VALID_ANNOTATION_FILES_ARRAY;
      removeFile(fileName, annotationsArrayName);
    } else {
      removeFile(fileName, VALID_ANNOTATION_FILES_ARRAY);
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
  }
  removeRow(fileName, tableName);
}

export { removeFileHandler as default };
