import {
  ACTIVE_ANNOTATION_FILE, ANNOTATIONS_TABLE_INDICATOR,
  ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE, FALTY_ANNOTATION_FILES_ARRAY,
  IMAGE_FILES_OBJECT, VALID_ANNOTATION_FILES_ARRAY, IMAGES_TABLE_INDICATOR,
} from '../../../../consts.js';
import {
  insertRowToImagesTable, enableFinishButton, disableFinishButton,
  changeAnnotationRowToDefault, changeAllImagesTableRowsToDefault, removeRow,
} from '../../style.js';

// pontential to move this out into shared validate logic
// can't at the moment because validate is just one default function
function validateExistingImages(datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc) {
  let foundValid = false;
  Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
    const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
    const validationResult = validateFormatFunc(imageFile);
    if (!validationResult.error) { foundValid = true; }
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
    updateImageFileErrorStatusFunc(name, validationResult.error);
  });
  if (foundValid) {
    enableFinishButton();
  } else {
    disableFinishButton();
  }
}

function setNewActiveAnnotationFileRow(activeAnnotationFile, datasetObject,
  updateImageFileErrorStatusFunc, validateFormatFunc) {
  if (activeAnnotationFile) {
    changeAnnotationRowToDefault(activeAnnotationFile.body.fileMetaData.name);
    activeAnnotationFile.newlyActive = false;
    validateExistingImages(datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc);
  }
}

function removeAnnotationFileWhenMultipleAnnotationFilesAllowed(fileName,
  errorMessage, datasetObject) {
  if (errorMessage) {
    const annotationsArrayName = VALID_ANNOTATION_FILES_ARRAY;
    this.datasetObjectManager.removeFile(fileName, annotationsArrayName);
  } else {
    this.datasetObjectManager.removeFile(fileName,
      VALID_ANNOTATION_FILES_ARRAY);
    if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length === 0) {
      disableFinishButton();
      changeAllImagesTableRowsToDefault();
    } else {
      validateExistingImages(datasetObject, this.datasetObjectManager.updateImageFileErrorStatus,
        this.validateFormat);
    }
  }
}

function removeAnnotationFileWhenOneAnnotationFileAllowed(fileName, errorMessage, datasetObject) {
  if (errorMessage) {
    let annotationsArrayName;
    if (errorMessage === ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE) {
      annotationsArrayName = VALID_ANNOTATION_FILES_ARRAY;
    } else {
      annotationsArrayName = FALTY_ANNOTATION_FILES_ARRAY;
    }
    this.datasetObjectManager.removeFile(fileName, annotationsArrayName);
  } else {
    this.datasetObjectManager.replaceActiveFileIfRemoving(fileName,
      VALID_ANNOTATION_FILES_ARRAY,
      ACTIVE_ANNOTATION_FILE);
    this.datasetObjectManager.removeFile(fileName,
      VALID_ANNOTATION_FILES_ARRAY);
    if (this.datasetObjectManager.getActiveAnnotationFile() !== null) {
      setNewActiveAnnotationFileRow(this.datasetObjectManager.getActiveAnnotationFile(),
        datasetObject, this.datasetObjectManager.updateImageFileErrorStatus, this.validateFormat);
    } else {
      disableFinishButton();
      changeAllImagesTableRowsToDefault();
    }
  }
}

function removeFileHandler(fileName, tableName, errorMessage) {
  const datasetObject = this.datasetObjectManager.getDatasetObject();
  if (tableName === ANNOTATIONS_TABLE_INDICATOR) {
    this.removeAnnotationFileFunc(fileName, errorMessage, datasetObject);
  } else if (tableName === IMAGES_TABLE_INDICATOR) {
    this.datasetObjectManager.removeFile(fileName, IMAGE_FILES_OBJECT);
    if (Object.keys(datasetObject[IMAGE_FILES_OBJECT])
      .filter((key => !datasetObject[IMAGE_FILES_OBJECT][key].error))
      .length === 0) {
      disableFinishButton();
    }
  }
  removeRow(fileName, tableName);
}

function buildRemoveFileHandlerForMultipleAnnotationFilesStrategy(datasetObjectManager,
  validateFormat) {
  const removeAnnotationFileFunc = removeAnnotationFileWhenMultipleAnnotationFilesAllowed;
  return removeFileHandler.bind({ datasetObjectManager, validateFormat, removeAnnotationFileFunc });
}

function buildRemoveFileHandlerForOneAnnotationFileStrategy(datasetObjectManager, validateFormat) {
  const removeAnnotationFileFunc = removeAnnotationFileWhenOneAnnotationFileAllowed;
  return removeFileHandler.bind({ datasetObjectManager, validateFormat, removeAnnotationFileFunc });
}

const RemoveFileHandlerGenericBuilder = {
  buildRemoveFileHandlerForOneAnnotationFileStrategy,
  buildRemoveFileHandlerForMultipleAnnotationFilesStrategy,
};

export { RemoveFileHandlerGenericBuilder as default };
