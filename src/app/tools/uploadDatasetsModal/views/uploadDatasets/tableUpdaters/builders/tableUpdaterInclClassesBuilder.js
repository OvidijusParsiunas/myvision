import {
  ANNOTATION_FILE_INDICATOR, CLASSES_FILES_ARRAY, CLASSES_TABLE_INDICATOR,
  VALID_ANNOTATION_FILES_ARRAY, IMAGE_FILES_OBJECT, IMAGE_FILE_INDICATOR, CLASSES_FILE_INDICATOR,
  ANNOTATIONS_TABLE_INDICATOR, FALTY_ANNOTATION_FILES_ARRAY, ONE_CLASSES_FILE_ALLOWED_ERROR_MESSAGE,
} from '../../../../consts.js';
import {
  insertRowToImagesTable, enableFinishButton, removeRow,
  disableFinishButton, changeAllImagesTableRowsToDefault,
  insertRowToAnnotationsTable, insertRowToClassesTable,
} from '../../style.js';

function validateExistingImages(datasetObject, validateFileFunc, updateImageFileErrorStatusFunc) {
  if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length > 0) {
    let foundValid = false;
    Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
      const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
      const validationResult = validateFileFunc(imageFile);
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
  } else {
    changeAllImagesTableRowsToDefault();
    disableFinishButton();
  }
}

function validateAnnotationsFiles(annotationsArray, filesToBeMovedArray,
  moveWhenFalty, validateFileFunc) {
  let foundValid = false;
  annotationsArray.forEach((annotationFile) => {
    const validationResult = validateFileFunc(annotationFile);
    const { name } = annotationFile.body.fileMetaData;
    insertRowToAnnotationsTable(name, validationResult);
    if (!validationResult.error) {
      foundValid = true;
      if (!moveWhenFalty) { filesToBeMovedArray.push(annotationFile); }
    } else if (moveWhenFalty) {
      filesToBeMovedArray.push(annotationFile);
    }
  });
  return foundValid;
}

function validateExistingAnnotations(datasetObject, validateFileFunc,
  moveAnnotationFileToValidArrayFunc, moveAnnotationFileToFaltyArrayFunc) {
  const filesToBeMovedToFaltyArray = [];
  const filesToBeMovedToValidArray = [];
  const foundValidInValidArray = validateAnnotationsFiles(
    datasetObject[VALID_ANNOTATION_FILES_ARRAY], filesToBeMovedToFaltyArray,
    true, validateFileFunc,
  );
  const foundValidInFaltyArray = validateAnnotationsFiles(
    datasetObject[FALTY_ANNOTATION_FILES_ARRAY], filesToBeMovedToValidArray,
    false, validateFileFunc,
  );
  filesToBeMovedToFaltyArray.forEach((annotationFile) => {
    moveAnnotationFileToFaltyArrayFunc(annotationFile);
  });
  filesToBeMovedToValidArray.forEach((annotationFile) => {
    moveAnnotationFileToValidArrayFunc(annotationFile);
  });
  if (foundValidInValidArray || foundValidInFaltyArray) {
    enableFinishButton();
  } else {
    disableFinishButton();
  }
}

function validateExistingClassesFiles(classesFiles, validateFileFunc) {
  classesFiles.forEach((classesFile) => {
    const validationResult = validateFileFunc(classesFile);
    const { name } = classesFile.body.fileMetaData;
    if (!validationResult.error) {
      validationResult.error = true;
      validationResult.message = ONE_CLASSES_FILE_ALLOWED_ERROR_MESSAGE;
    }
    insertRowToClassesTable(name, validationResult);
  });
}

function removeFileFromAnnotations(fileName, removeFileFunc) {
  if (removeRow(fileName, ANNOTATIONS_TABLE_INDICATOR)) {
    removeFileFunc(fileName, VALID_ANNOTATION_FILES_ARRAY);
    removeFileFunc(fileName, FALTY_ANNOTATION_FILES_ARRAY);
  }
}

function validateAllFiles(validationResult, datasetObject, fileName,
  validateFileFunc, updateImageFileErrorStatusFunc, moveAnnotationFileToValidArrayFunc,
  moveAnnotationFileToFaltyArrayFunc, removeFileFunc) {
  const classFiles = datasetObject[CLASSES_FILES_ARRAY];
  // the general expectation is that class files would not have errors (no validation)
  if (!validationResult.error) {
    removeFileFromAnnotations(fileName, removeFileFunc);
    validateExistingClassesFiles(classFiles, validateFileFunc);
    validateExistingAnnotations(datasetObject, validateFileFunc,
      moveAnnotationFileToValidArrayFunc, moveAnnotationFileToFaltyArrayFunc);
    validateExistingImages(datasetObject, validateFileFunc, updateImageFileErrorStatusFunc);
  }
  return validationResult;
}

function removeFileFromClasses(fileName, removeFileHandlerFunc) {
  if (removeRow(fileName, CLASSES_TABLE_INDICATOR)) {
    removeFileHandlerFunc(fileName, CLASSES_FILE_INDICATOR);
    return true;
  }
  return false;
}

function updateTables(parsedObj, validationResult) {
  const datasetObject = this.datasetObjectManager.getDatasetObject();
  const fileName = parsedObj.body.fileMetaData.name;
  if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
    insertRowToImagesTable(fileName, validationResult);
    if (validationResult.valid) { enableFinishButton(); }
  } else if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
    if (!removeFileFromClasses(fileName, this.removeFileHandler)) {
      validateExistingImages(datasetObject, this.validateFormat,
        this.datasetObjectManager.updateImageFileErrorStatus);
      insertRowToAnnotationsTable(fileName, validationResult);
    }
  } else if (parsedObj.fileFormat === CLASSES_FILE_INDICATOR) {
    const newValidationResult = validateAllFiles(
      validationResult, datasetObject, fileName,
      this.validateFormat,
      this.datasetObjectManager.updateImageFileErrorStatus,
      this.datasetObjectManager.moveAnnotationFileToValidArray,
      this.datasetObjectManager.moveAnnotationFileToFaltyArray,
      this.datasetObjectManager.removeFile,
    );
    // whilst the validateExistingClassesFiles inserts the new class into the table,
    // this overwrites without the error of more than 1 class
    insertRowToClassesTable(fileName, newValidationResult);
  }
}

function buildTableUpdaterInclClassesTable(datasetObjectManager,
  validateFormat, removeFileHandler) {
  return updateTables.bind({ datasetObjectManager, validateFormat, removeFileHandler });
}

const TableUpdaterInclClassesBuilder = {
  buildTableUpdaterInclClassesTable,
};

export { TableUpdaterInclClassesBuilder as default };
