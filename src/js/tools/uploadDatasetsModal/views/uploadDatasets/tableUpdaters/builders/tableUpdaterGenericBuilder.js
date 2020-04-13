import * as UploadDatasetsConsts from '../../../../consts';
import * as UploadDatasetsStyle from '../../style';

function validateExistingImagesWhenMultipleAnnotationFilesAllowed(datasetObject,
  updateImageFileErrorStatusFunc, validateFileFunc) {
  if (datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY].length > 0) {
    let foundValid = false;
    Object.keys(datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT]).forEach((key) => {
      const imageFile = datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][key];
      const validationResult = validateFileFunc(imageFile);
      if (!validationResult.error) { foundValid = true; }
      const { name } = imageFile.body.fileMetaData;
      UploadDatasetsStyle.insertRowToImagesTable(name, validationResult);
      updateImageFileErrorStatusFunc(name, validationResult.error);
    });
    if (foundValid) {
      UploadDatasetsStyle.enableFinishButton();
    } else {
      UploadDatasetsStyle.disableFinishButton();
    }
  } else {
    UploadDatasetsStyle.changeAllImagesTableRowsToDefault();
    UploadDatasetsStyle.disableFinishButton();
  }
}

function validateExistingImagesWhenOneAnnotationFileAllowed(datasetObject,
  updateImageFileErrorStatusFunc, validateFileFunc) {
  let foundValid = false;
  Object.keys(datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT]).forEach((key) => {
    const imageFile = datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][key];
    const validationResult = validateFileFunc(imageFile);
    if (!validationResult.error) { foundValid = true; }
    const { name } = imageFile.body.fileMetaData;
    UploadDatasetsStyle.insertRowToImagesTable(name, validationResult);
    updateImageFileErrorStatusFunc(name, validationResult.error);
  });
  if (foundValid) {
    UploadDatasetsStyle.enableFinishButton();
  } else {
    UploadDatasetsStyle.disableFinishButton();
  }
}

function reValidateExistingAnnotations(annotationFiles, validateFileFunc) {
  annotationFiles.forEach((annotationFile) => {
    const validationResult = validateFileFunc(annotationFile);
    const { name } = annotationFile.body.fileMetaData;
    if (!validationResult.error) {
      validationResult.error = true;
      validationResult.message = UploadDatasetsConsts.ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE;
    }
    UploadDatasetsStyle.insertRowToAnnotationsTable(name, validationResult);
  });
}

function checkAnnotationAlreadyInTable(validationResult, datasetObject,
  updateImageFileErrorStatusFunc, validateFileFunc) {
  const activeAnnotationFile = datasetObject[UploadDatasetsConsts.ACTIVE_ANNOTATION_FILE];
  const validAnnotationFiles = datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY];
  if (!validationResult.error) {
    reValidateExistingAnnotations(validAnnotationFiles, validateFileFunc);
    validateExistingImagesWhenOneAnnotationFileAllowed(datasetObject,
      updateImageFileErrorStatusFunc, validateFileFunc);
    return validationResult;
  }
  if (validAnnotationFiles.length > 0) {
    if (activeAnnotationFile && activeAnnotationFile.newlyActive) {
      UploadDatasetsStyle.changeAnnotationRowToDefault(activeAnnotationFile.body.fileMetaData.name);
      activeAnnotationFile.newlyActive = false;
      validateExistingImagesWhenOneAnnotationFileAllowed(datasetObject,
        updateImageFileErrorStatusFunc, validateFileFunc);
    }
    return { error: true, message: validationResult.message };
  }
  UploadDatasetsStyle.changeAllImagesTableRowsToDefault();
  return validationResult;
}

function updateAnnotationTableWhenOneAnnotationFileAllowed(fileName, validationResult,
  datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc) {
  const newValidationResult = checkAnnotationAlreadyInTable(
    validationResult, datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc,
  );
  // whilst the reValidateExistingAnnotations inserts the new annotation,
  // this overwrites it if it has been incorrectly set with an error
  UploadDatasetsStyle.insertRowToAnnotationsTable(fileName, newValidationResult);
}

function updateAnnotationTableWhenMultipleAnnotationFilesAllowed(fileName, validationResult,
  datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc) {
  validateExistingImagesWhenMultipleAnnotationFilesAllowed(datasetObject,
    updateImageFileErrorStatusFunc, validateFormatFunc);
  // whilst the reValidateExistingAnnotations inserts the new annotation,
  // this overwrites it if it has been incorrectly set with an error
  UploadDatasetsStyle.insertRowToAnnotationsTable(fileName, validationResult);
}

function updateTables(parsedObj, validationResult) {
  const datasetObject = this.datasetObjectManager.getDatasetObject();
  const fileName = parsedObj.body.fileMetaData.name;
  if (parsedObj.fileFormat === UploadDatasetsConsts.IMAGE_FILE_INDICATOR) {
    UploadDatasetsStyle.insertRowToImagesTable(fileName, validationResult);
    if (validationResult.valid) { UploadDatasetsStyle.enableFinishButton(); }
  }
  if (parsedObj.fileFormat === UploadDatasetsConsts.ANNOTATION_FILE_INDICATOR) {
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
