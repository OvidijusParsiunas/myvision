import {
  CLASSES_FILES_ARRAY, FALTY_ANNOTATION_FILES_ARRAY,
  IMAGE_FILES_OBJECT, VALID_ANNOTATION_FILES_ARRAY, IMAGES_TABLE_INDICATOR,
  ACTIVE_CLASSES_FILE, ANNOTATIONS_TABLE_INDICATOR, CLASSES_TABLE_INDICATOR,
} from '../../../../consts.js';
import {
  changeAllImagesTableRowsToDefault, removeRow, insertRowToAnnotationsTable,
  insertRowToImagesTable, enableFinishButton, disableFinishButton, changeClassesRowToDefault,
} from '../../style.js';

function validateExistingImages(datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc) {
  if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length > 0) {
    let foundValid = false;
    Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
      const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
      const validationResult = validateFormatFunc(imageFile);
      if (!validationResult.error) { foundValid = true; }
      const { name } = imageFile.body.fileMetaData;
      insertRowToImagesTable(name, validationResult);
      updateImageFileErrorStatusFunc(name, validationResult.error);
    });
    if (!foundValid) {
      disableFinishButton();
    }
  } else {
    changeAllImagesTableRowsToDefault();
    disableFinishButton();
  }
}

function validateAnnotationsFile(annotationsArray, filesToBeMovedArray, moveWhenFalty,
  validateFormatFunc) {
  let foundValid = false;
  annotationsArray.forEach((annotationsFile) => {
    const validationResult = validateFormatFunc(annotationsFile);
    const { name } = annotationsFile.body.fileMetaData;
    insertRowToAnnotationsTable(name, validationResult);
    if (!validationResult.error) {
      foundValid = true;
      if (!moveWhenFalty) { filesToBeMovedArray.push(annotationsFile); }
    } else if (moveWhenFalty) {
      filesToBeMovedArray.push(annotationsFile);
    }
  });
  return foundValid;
}

function validateExistingAnnotations(datasetObject, moveAnnotationFileToValidArrayFunc,
  moveAnnotationFileToFaltyArrayFunc, validateFormatFunc) {
  const filesToBeMovedToFaltyArray = [];
  const filesToBeMovedToValidArray = [];
  const foundValidInValidArray = validateAnnotationsFile(
    datasetObject[VALID_ANNOTATION_FILES_ARRAY], filesToBeMovedToFaltyArray,
    true, validateFormatFunc,
  );
  const foundValidInFaltyArray = validateAnnotationsFile(
    datasetObject[FALTY_ANNOTATION_FILES_ARRAY], filesToBeMovedToValidArray,
    false, validateFormatFunc,
  );
  filesToBeMovedToFaltyArray.forEach((annotationFile) => {
    moveAnnotationFileToFaltyArrayFunc(annotationFile);
  });
  filesToBeMovedToValidArray.forEach((annotationFile) => {
    moveAnnotationFileToValidArrayFunc(annotationFile);
  });
  if ((!foundValidInValidArray && !foundValidInFaltyArray)
    || !datasetObject[ACTIVE_CLASSES_FILE]) {
    disableFinishButton();
  } else {
    enableFinishButton();
  }
}

function setNewActiveClassesFileRow(activeClassesFile, datasetObject,
  updateImageFileErrorStatusFunc, validateFormatFunc, moveAnnotationFileToValidArrayFunc,
  moveAnnotationFileToFaltyArrayFunc) {
  changeClassesRowToDefault(activeClassesFile.body.fileMetaData.name);
  activeClassesFile.newlyActive = false;
  validateExistingAnnotations(datasetObject, moveAnnotationFileToValidArrayFunc,
    moveAnnotationFileToFaltyArrayFunc, validateFormatFunc);
  validateExistingImages(datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc);
}

function removeFileHandlerWthClasses(fileName, tableName, errorMessage) {
  const datasetObject = this.datasetObjectManager.getDatasetObject();
  if (tableName === ANNOTATIONS_TABLE_INDICATOR) {
    this.datasetObjectManager.removeFile(fileName,
      VALID_ANNOTATION_FILES_ARRAY);
    this.datasetObjectManager.removeFile(fileName,
      FALTY_ANNOTATION_FILES_ARRAY);
    if (!errorMessage) {
      if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length === 0) {
        disableFinishButton();
        changeAllImagesTableRowsToDefault();
      } else {
        validateExistingImages(datasetObject,
          this.datasetObjectManager.updateImageFileErrorStatus,
          this.validateFormat);
      }
    }
  } else if (tableName === IMAGES_TABLE_INDICATOR) {
    this.datasetObjectManager.removeFile(fileName, IMAGE_FILES_OBJECT);
    if (Object.keys(datasetObject[IMAGE_FILES_OBJECT])
      .filter((key => !datasetObject[IMAGE_FILES_OBJECT][key].error))
      .length === 0) {
      disableFinishButton();
    }
  } else if (tableName === CLASSES_TABLE_INDICATOR) {
    this.datasetObjectManager.removeFile(fileName, CLASSES_FILES_ARRAY);
    if (!errorMessage) {
      this.datasetObjectManager.replaceActiveFileIfRemoving(fileName,
        CLASSES_FILES_ARRAY, ACTIVE_CLASSES_FILE);
      if (datasetObject[ACTIVE_CLASSES_FILE] !== null) {
        setNewActiveClassesFileRow(datasetObject[ACTIVE_CLASSES_FILE],
          datasetObject, this.datasetObjectManager.updateImageFileErrorStatus, this.validateFormat,
          this.datasetObjectManager.moveAnnotationFileToValidArray,
          this.datasetObjectManager.moveAnnotationFileToFaltyArray);
      } else {
        validateExistingAnnotations(datasetObject,
          this.datasetObjectManager.moveAnnotationFileToValidArray,
          this.datasetObjectManager.moveAnnotationFileToFaltyArray,
          this.validateFormat);
        validateExistingImages(datasetObject,
          this.datasetObjectManager.updateImageFileErrorStatus,
          this.validateFormat);
      }
    }
  }
  removeRow(fileName, tableName);
}

function buildRemoveFileHandlerInclClasses(datasetObjectManager, validateFormat) {
  return removeFileHandlerWthClasses.bind({ datasetObjectManager, validateFormat });
}

const RemoveFileHandlerInclClassesBuilder = {
  buildRemoveFileHandlerInclClasses,
};

export { RemoveFileHandlerInclClassesBuilder as default };
