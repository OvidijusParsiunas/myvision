import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager';
import {
  removeRow, changeAnnotationRowToDefault, disableFinishButton,
  insertRowToImagesTable, changeAllImagesTableRowsToDefault, enableFinishButton,
} from '../style';
import validateCOCOJSONFormat from '../formatValidators/COCOJSONValidator';
import {
  FALTY_ANNOTATION_FILES_ARRAY, IMAGE_FILES_OBJECT,
  ANNOTATIONS_TABLE_INDICATOR, IMAGES_TABLE_INDICATOR,
  ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE, VALID_ANNOTATION_FILES_ARRAY,
} from '../../../consts';

// pontential to move this out into shared validate logic
// can't at the moment because validate is just one default function
function validateExistingImages(datasetObject) {
  let foundValid = false;
  Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
    const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
    const validationResult = validateCOCOJSONFormat(imageFile);
    if (!validationResult.error) { foundValid = true; }
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
    datasetObjectManager.updateImageFileErrorStatus(name, validationResult.error);
  });
  if (foundValid) {
    enableFinishButton();
  } else {
    disableFinishButton();
  }
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
  const datasetObject = datasetObjectManager.getDatasetObject();
  if (tableName === ANNOTATIONS_TABLE_INDICATOR) {
    if (errorMessage) {
      let annotationsArrayName;
      if (errorMessage === ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE) {
        annotationsArrayName = VALID_ANNOTATION_FILES_ARRAY;
      } else {
        annotationsArrayName = FALTY_ANNOTATION_FILES_ARRAY;
      }
      datasetObjectManager.removeFile(fileName, annotationsArrayName);
    } else {
      datasetObjectManager.replaceActiveAnnotationFileIfRemoving(fileName);
      datasetObjectManager.removeFile(fileName, VALID_ANNOTATION_FILES_ARRAY);
      if (datasetObjectManager.getActiveAnnotationFile() !== null) {
        setNewActiveAnnotationFileRow(datasetObjectManager.getActiveAnnotationFile(),
          datasetObject);
      } else {
        disableFinishButton();
        changeAllImagesTableRowsToDefault();
      }
    }
  } else if (tableName === IMAGES_TABLE_INDICATOR) {
    datasetObjectManager.removeFile(fileName, IMAGE_FILES_OBJECT);
    if (Object.keys(datasetObject[IMAGE_FILES_OBJECT])
      .filter((key => !datasetObject[IMAGE_FILES_OBJECT][key].error))
      .length === 0) {
      disableFinishButton();
    }
  }
  removeRow(fileName, tableName);
}

export { removeFileHandler as default };
