import * as UploadDatasetsStyle from '../style';
import * as UploadDatasetsConsts from '../../../consts';

// functionality here cannot be used for all, will need
// to be moved to atomic COCOJSON file

function validateExistingImages(datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc) {
  if (datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY].length > 0) {
    let foundValid = false;
    Object.keys(datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT]).forEach((key) => {
      const imageFile = datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][key];
      const validationResult = validateFormatFunc(imageFile);
      if (!validationResult.error) { foundValid = true; }
      const { name } = imageFile.body.fileMetaData;
      UploadDatasetsStyle.insertRowToImagesTable(name, validationResult);
      updateImageFileErrorStatusFunc(name, validationResult.error);
    });
    if (!foundValid) {
      UploadDatasetsStyle.disableFinishButton();
    }
  } else {
    UploadDatasetsStyle.changeAllImagesTableRowsToDefault();
    UploadDatasetsStyle.disableFinishButton();
  }
}

function validateAnnotationsFile(annotationsArray, filesToBeMovedArray, moveWhenFalty,
  validateFormatFunc) {
  let foundValid = false;
  annotationsArray.forEach((annotationsFile) => {
    const validationResult = validateFormatFunc(annotationsFile);
    const { name } = annotationsFile.body.fileMetaData;
    UploadDatasetsStyle.insertRowToAnnotationsTable(name, validationResult);
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
    datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY], filesToBeMovedToFaltyArray,
    true, validateFormatFunc,
  );
  const foundValidInFaltyArray = validateAnnotationsFile(
    datasetObject[UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY], filesToBeMovedToValidArray,
    false, validateFormatFunc,
  );
  filesToBeMovedToFaltyArray.forEach((annotationFile) => {
    moveAnnotationFileToFaltyArrayFunc(annotationFile);
  });
  filesToBeMovedToValidArray.forEach((annotationFile) => {
    moveAnnotationFileToValidArrayFunc(annotationFile);
  });
  if ((!foundValidInValidArray && !foundValidInFaltyArray)
    || !datasetObject[UploadDatasetsConsts.ACTIVE_CLASSES_FILE]) {
    UploadDatasetsStyle.disableFinishButton();
  } else {
    UploadDatasetsStyle.enableFinishButton();
  }
}

function setNewActiveClassesFileRow(activeClassesFile, datasetObject,
  updateImageFileErrorStatusFunc, validateFormatFunc, moveAnnotationFileToValidArrayFunc,
  moveAnnotationFileToFaltyArrayFunc) {
  UploadDatasetsStyle.changeClassesRowToDefault(activeClassesFile.body.fileMetaData.name);
  activeClassesFile.newlyActive = false;
  validateExistingAnnotations(datasetObject, moveAnnotationFileToValidArrayFunc,
    moveAnnotationFileToFaltyArrayFunc, validateFormatFunc);
  validateExistingImages(datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc);
}

function removeFileHandlerWthClasses(fileName, tableName, errorMessage) {
  const datasetObject = this.datasetObjectManager.getDatasetObject();
  if (tableName === UploadDatasetsConsts.ANNOTATIONS_TABLE_INDICATOR) {
    this.datasetObjectManager.removeFile(fileName,
      UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY);
    this.datasetObjectManager.removeFile(fileName,
      UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY);
    if (!errorMessage) {
      if (datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY].length === 0) {
        UploadDatasetsStyle.disableFinishButton();
        UploadDatasetsStyle.changeAllImagesTableRowsToDefault();
      } else {
        validateExistingImages(datasetObject,
          this.datasetObjectManager.updateImageFileErrorStatus,
          this.validateFormat);
      }
    }
  } else if (tableName === UploadDatasetsConsts.IMAGES_TABLE_INDICATOR) {
    this.datasetObjectManager.removeFile(fileName, UploadDatasetsConsts.IMAGE_FILES_OBJECT);
    if (Object.keys(datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT])
      .filter((key => !datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][key].error))
      .length === 0) {
      UploadDatasetsStyle.disableFinishButton();
    }
  } else if (tableName === UploadDatasetsConsts.CLASSES_TABLE_INDICATOR) {
    this.datasetObjectManager.removeFile(fileName, UploadDatasetsConsts.CLASSES_FILES_ARRAY);
    if (!errorMessage) {
      this.datasetObjectManager.replaceActiveFileIfRemoving(fileName,
        UploadDatasetsConsts.CLASSES_FILES_ARRAY, UploadDatasetsConsts.ACTIVE_CLASSES_FILE);
      if (datasetObject[UploadDatasetsConsts.ACTIVE_CLASSES_FILE] !== null) {
        setNewActiveClassesFileRow(datasetObject[UploadDatasetsConsts.ACTIVE_CLASSES_FILE],
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
  UploadDatasetsStyle.removeRow(fileName, tableName);
}

function buildRemoveFileHandlerInclClasses(datasetObjectManager, validateFormat) {
  return removeFileHandlerWthClasses.bind({ datasetObjectManager, validateFormat });
}

const RemoveFileHandlerInclClassesBuilder = {
  buildRemoveFileHandlerInclClasses,
};

export { RemoveFileHandlerInclClassesBuilder as default };
