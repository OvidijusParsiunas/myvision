import {
  VALID_ANNOTATION_FILES_ARRAY, IMAGE_FILES_OBJECT, IMAGE_FILE_INDICATOR,
  ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE, ACTIVE_ANNOTATION_FILE, ANNOTATION_FILE_INDICATOR,
} from '../../../../consts.js';
import {
  insertRowToImagesTable, enableFinishButton,
  disableFinishButton, changeAllImagesTableRowsToDefault,
  insertRowToAnnotationsTable, changeAnnotationRowToDefault,
} from '../../style.js';

function validateExistingImagesWhenMultipleAnnotationFilesAllowed(datasetObject,
  updateImageFileErrorStatusFunc, validateFileFunc) {
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

function validateExistingImagesWhenOneAnnotationFileAllowed(datasetObject,
  updateImageFileErrorStatusFunc, validateFileFunc) {
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
}

function reValidateExistingAnnotations(annotationFiles, validateFileFunc) {
  annotationFiles.forEach((annotationFile) => {
    const validationResult = validateFileFunc(annotationFile);
    const { name } = annotationFile.body.fileMetaData;
    if (!validationResult.error) {
      validationResult.error = true;
      validationResult.message = ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE;
    }
    insertRowToAnnotationsTable(name, validationResult);
  });
}

function checkAnnotationAlreadyInTable(validationResult, datasetObject,
  updateImageFileErrorStatusFunc, validateFileFunc) {
  const activeAnnotationFile = datasetObject[ACTIVE_ANNOTATION_FILE];
  const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
  if (!validationResult.error) {
    reValidateExistingAnnotations(validAnnotationFiles, validateFileFunc);
    validateExistingImagesWhenOneAnnotationFileAllowed(datasetObject,
      updateImageFileErrorStatusFunc, validateFileFunc);
    return validationResult;
  }
  if (validAnnotationFiles.length > 0) {
    if (activeAnnotationFile && activeAnnotationFile.newlyActive) {
      changeAnnotationRowToDefault(activeAnnotationFile.body.fileMetaData.name);
      activeAnnotationFile.newlyActive = false;
      validateExistingImagesWhenOneAnnotationFileAllowed(datasetObject,
        updateImageFileErrorStatusFunc, validateFileFunc);
    }
    return { error: true, message: validationResult.message };
  }
  changeAllImagesTableRowsToDefault();
  return validationResult;
}

function updateAnnotationTableWhenOneAnnotationFileAllowed(fileName, validationResult,
  datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc) {
  const newValidationResult = checkAnnotationAlreadyInTable(
    validationResult, datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc,
  );
  // whilst the reValidateExistingAnnotations inserts the new annotation,
  // this overwrites it if it has been incorrectly set with an error
  insertRowToAnnotationsTable(fileName, newValidationResult);
}

function updateAnnotationTableWhenMultipleAnnotationFilesAllowed(fileName, validationResult,
  datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc) {
  validateExistingImagesWhenMultipleAnnotationFilesAllowed(datasetObject,
    updateImageFileErrorStatusFunc, validateFormatFunc);
  // whilst the reValidateExistingAnnotations inserts the new annotation,
  // this overwrites it if it has been incorrectly set with an error
  insertRowToAnnotationsTable(fileName, validationResult);
}

function updateTables(parsedObj, validationResult) {
  if (!parsedObj.body) return;
  const fileName = parsedObj.body.fileMetaData.name;
  const datasetObject = this.datasetObjectManager.getDatasetObject();
  if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
    insertRowToImagesTable(fileName, validationResult);
    if (validationResult.valid) { enableFinishButton(); }
  }
  if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
    this.updateAnnotationTableFunc(fileName, validationResult, datasetObject,
      this.datasetObjectManager.updateImageFileErrorStatus, this.validateFormat);
  }
}

function buildTableUpdaterForMultipleAnnotationFilesStrategy(datasetObjectManager,
  validateFormat) {
  const updateAnnotationTableFunc = updateAnnotationTableWhenMultipleAnnotationFilesAllowed;
  return updateTables.bind(
    { datasetObjectManager, validateFormat, updateAnnotationTableFunc },
  );
}

function buildTableUpdaterForOneAnnotationFileStrategy(datasetObjectManager, validateFormat) {
  const updateAnnotationTableFunc = updateAnnotationTableWhenOneAnnotationFileAllowed;
  return updateTables.bind(
    { datasetObjectManager, validateFormat, updateAnnotationTableFunc },
  );
}

const TableUpdaterGenericBuilder = {
  buildTableUpdaterForOneAnnotationFileStrategy,
  buildTableUpdaterForMultipleAnnotationFilesStrategy,
};

export { TableUpdaterGenericBuilder as default };
