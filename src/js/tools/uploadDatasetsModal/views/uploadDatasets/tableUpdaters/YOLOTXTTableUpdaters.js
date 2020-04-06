import {
  insertRowToAnnotationsTable, insertRowToImagesTable, enableFinishButton, insertRowToClassesTable,
  changeAllImagesTableRowsToDefault, disableFinishButton, removeRow,
} from '../style';
import validateYOLOTXTFormat from '../formatValidators/YOLOTXTValidator';
import {
  ONE_CLASSES_FILE_ALLOWED_ERROR_MESSAGE, VALID_ANNOTATION_FILES_ARRAY, ANNOTATIONS_TABLE_INDICATOR,
  IMAGE_FILES_OBJECT, CLASSES_FILES_ARRAY, FALTY_ANNOTATION_FILES_ARRAY, CLASSES_TABLE_INDICATOR,
  ANNOTATION_FILE_INDICATOR, CLASSES_FILE_INDICATOR, IMAGE_FILE_INDICATOR,
} from '../../../consts';
import {
  getDatasetObject, updateImageFileErrorStatus, removeFile,
  moveAnnotationFileToFaltyArray, moveAnnotationFileToValidArray,
} from '../datasetObjectManagers/YOLOTXTDatasetObjectManager';
import removeFileHandler from '../removeFileHandlers/YOLOTXTRemoveFileHandler';

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

function validateAnnotationsFiles(annotationsArray, filesToBeMovedArray, moveWhenFalty) {
  let foundValid = false;
  annotationsArray.forEach((annotationFile) => {
    const validationResult = validateYOLOTXTFormat(annotationFile);
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

function validateExistingAnnotations(datasetObject) {
  const filesToBeMovedToFaltyArray = [];
  const filesToBeMovedToValidArray = [];
  const foundValidInValidArray = validateAnnotationsFiles(
    datasetObject[VALID_ANNOTATION_FILES_ARRAY], filesToBeMovedToFaltyArray, true,
  );
  const foundValidInFaltyArray = validateAnnotationsFiles(
    datasetObject[FALTY_ANNOTATION_FILES_ARRAY], filesToBeMovedToValidArray, false,
  );
  filesToBeMovedToFaltyArray.forEach((annotationFile) => {
    moveAnnotationFileToFaltyArray(annotationFile);
  });
  filesToBeMovedToValidArray.forEach((annotationFile) => {
    moveAnnotationFileToValidArray(annotationFile);
  });
  if (foundValidInValidArray || foundValidInFaltyArray) {
    enableFinishButton();
  } else {
    disableFinishButton();
  }
}

function validateExistingClassesFiles(classesFiles) {
  classesFiles.forEach((classesFile) => {
    const validationResult = validateYOLOTXTFormat(classesFile);
    const { name } = classesFile.body.fileMetaData;
    if (!validationResult.error) {
      validationResult.error = true;
      validationResult.message = ONE_CLASSES_FILE_ALLOWED_ERROR_MESSAGE;
    }
    insertRowToClassesTable(name, validationResult);
  });
}

function removeFileFromAnnotations(fileName) {
  if (removeRow(fileName, ANNOTATIONS_TABLE_INDICATOR)) {
    removeFile(fileName, VALID_ANNOTATION_FILES_ARRAY);
    removeFile(fileName, FALTY_ANNOTATION_FILES_ARRAY);
  }
}

function validateAllFiles(validationResult, datasetObject, fileName) {
  const classFiles = datasetObject[CLASSES_FILES_ARRAY];
  // the general expectation is that class files would not have errors (no validation)
  if (!validationResult.error) {
    removeFileFromAnnotations(fileName);
    validateExistingClassesFiles(classFiles);
    validateExistingAnnotations(datasetObject);
    validateExistingImages(datasetObject);
  }
  return validationResult;
}

function removeFileFromClasses(fileName) {
  if (removeRow(fileName, CLASSES_TABLE_INDICATOR)) {
    removeFileHandler(fileName, CLASSES_FILE_INDICATOR);
    return true;
  }
  return false;
}

function updateYOLOTXTTables(parsedObj, validationResult) {
  const datasetObject = getDatasetObject();
  const fileName = parsedObj.body.fileMetaData.name;
  if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
    insertRowToImagesTable(fileName, validationResult);
    if (validationResult.valid) { enableFinishButton(); }
  } else if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
    if (!removeFileFromClasses(fileName)) {
      validateExistingImages(datasetObject);
      insertRowToAnnotationsTable(fileName, validationResult);
    }
  } else if (parsedObj.fileFormat === CLASSES_FILE_INDICATOR) {
    const newValidationResult = validateAllFiles(validationResult, datasetObject, fileName);
    // whilst the validateExistingClassesFiles inserts the new class into the table,
    // this overwrites without the error of more than 1 class
    insertRowToClassesTable(fileName, newValidationResult);
  }
}

export { updateYOLOTXTTables as default };
