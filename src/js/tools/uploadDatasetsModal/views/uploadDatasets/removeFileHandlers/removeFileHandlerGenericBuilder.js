import * as UploadDatasetsConsts from '../../../consts';
import * as UploadDatasetsStyle from '../style';

// pontential to move this out into shared validate logic
// can't at the moment because validate is just one default function
function validateExistingImages(datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc) {
  let foundValid = false;
  Object.keys(datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT]).forEach((key) => {
    const imageFile = datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][key];
    const validationResult = validateFormatFunc(imageFile);
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

function setNewActiveAnnotationFileRow(activeAnnotationFile, datasetObject,
  updateImageFileErrorStatusFunc, validateFormatFunc) {
  if (activeAnnotationFile) {
    UploadDatasetsStyle.changeAnnotationRowToDefault(activeAnnotationFile.body.fileMetaData.name);
    activeAnnotationFile.newlyActive = false;
    validateExistingImages(datasetObject, updateImageFileErrorStatusFunc, validateFormatFunc);
  }
}

function removeAnnotationFileWhenMultipleAnnotationFilesAllowed(fileName,
  errorMessage, datasetObject) {
  if (errorMessage) {
    const annotationsArrayName = UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY;
    this.datasetObjectManager.removeFile(fileName, annotationsArrayName);
  } else {
    this.datasetObjectManager.removeFile(fileName,
      UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY);
    if (datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY].length === 0) {
      UploadDatasetsStyle.disableFinishButton();
      UploadDatasetsStyle.changeAllImagesTableRowsToDefault();
    } else {
      validateExistingImages(datasetObject, this.datasetObjectManager.updateImageFileErrorStatus,
        this.validateFormat);
    }
  }
}

function removeAnnotationFileWhenOneAnnotationFileAllowed(fileName, errorMessage, datasetObject) {
  if (errorMessage) {
    let annotationsArrayName;
    if (errorMessage === UploadDatasetsConsts.ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE) {
      annotationsArrayName = UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY;
    } else {
      annotationsArrayName = UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY;
    }
    this.datasetObjectManager.removeFile(fileName, annotationsArrayName);
  } else {
    this.datasetObjectManager.replaceActiveFileIfRemoving(fileName,
      UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY,
      UploadDatasetsConsts.ACTIVE_ANNOTATION_FILE);
    this.datasetObjectManager.removeFile(fileName,
      UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY);
    if (this.datasetObjectManager.getActiveAnnotationFile() !== null) {
      setNewActiveAnnotationFileRow(this.datasetObjectManager.getActiveAnnotationFile(),
        datasetObject, this.datasetObjectManager.updateImageFileErrorStatus, this.validateFormat);
    } else {
      UploadDatasetsStyle.disableFinishButton();
      UploadDatasetsStyle.changeAllImagesTableRowsToDefault();
    }
  }
}

function removeFileHandlerWthClasses(fileName, tableName, errorMessage) {
  const datasetObject = this.datasetObjectManager.getDatasetObject();
  if (tableName === UploadDatasetsConsts.ANNOTATIONS_TABLE_INDICATOR) {
    this.removeAnnotationFileFunc(fileName, errorMessage, datasetObject);
  } else if (tableName === UploadDatasetsConsts.IMAGES_TABLE_INDICATOR) {
    this.datasetObjectManager.removeFile(fileName, UploadDatasetsConsts.IMAGE_FILES_OBJECT);
    if (Object.keys(datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT])
      .filter((key => !datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][key].error))
      .length === 0) {
      UploadDatasetsStyle.disableFinishButton();
    }
  }
  UploadDatasetsStyle.removeRow(fileName, tableName);
}

function buildRemoveFileHandlerForMultipleAnnotationFilesStrategy(datasetObjectManager,
  validateFormat) {
  const removeAnnotationFileFunc = removeAnnotationFileWhenMultipleAnnotationFilesAllowed;
  return removeFileHandlerWthClasses.bind({
    datasetObjectManager, validateFormat, removeAnnotationFileFunc,
  });
}

function buildRemoveFileHandlerForOneAnnotationFileStrategy(datasetObjectManager, validateFormat) {
  const removeAnnotationFileFunc = removeAnnotationFileWhenOneAnnotationFileAllowed;
  return removeFileHandlerWthClasses.bind(
    { datasetObjectManager, validateFormat, removeAnnotationFileFunc },
  );
}

const RemoveFileHandlerGenericBuilder = {
  buildRemoveFileHandlerForOneAnnotationFileStrategy,
  buildRemoveFileHandlerForMultipleAnnotationFilesStrategy,
};

export { RemoveFileHandlerGenericBuilder as default };
