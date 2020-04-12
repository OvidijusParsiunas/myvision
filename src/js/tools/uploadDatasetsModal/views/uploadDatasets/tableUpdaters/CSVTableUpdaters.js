import {
  insertRowToAnnotationsTable, insertRowToImagesTable, enableFinishButton,
  changeAllImagesTableRowsToDefault, changeAnnotationRowToDefault, disableFinishButton,
} from '../style';
import validateCSVFormat from '../formatValidators/CSVValidator';
import {
  ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE, VALID_ANNOTATION_FILES_ARRAY,
  ACTIVE_ANNOTATION_FILE, IMAGE_FILES_OBJECT, ANNOTATION_FILE_INDICATOR, IMAGE_FILE_INDICATOR,
} from '../../../consts';
import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager';

// pontential to move this out into shared validate logic
// can't at the moment because validate is just one default function
function validateExistingImages(datasetObject) {
  let foundValid = false;
  Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
    const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
    const validationResult = validateCSVFormat(imageFile);
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

function reValidateExistingAnnotations(annotationFiles) {
  annotationFiles.forEach((annotationFile) => {
    const validationResult = validateCSVFormat(annotationFile);
    const { name } = annotationFile.body.fileMetaData;
    if (!validationResult.error) {
      validationResult.error = true;
      validationResult.message = ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE;
    }
    insertRowToAnnotationsTable(name, validationResult);
  });
}

function checkAnnotationAlreadyInTable(validationResult, datasetObject) {
  const activeAnnotationFile = datasetObject[ACTIVE_ANNOTATION_FILE];
  const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
  if (!validationResult.error) {
    reValidateExistingAnnotations(validAnnotationFiles);
    validateExistingImages(datasetObject);
    return validationResult;
  }
  if (validAnnotationFiles.length > 0) {
    if (activeAnnotationFile && activeAnnotationFile.newlyActive) {
      changeAnnotationRowToDefault(activeAnnotationFile.body.fileMetaData.name);
      activeAnnotationFile.newlyActive = false;
      validateExistingImages(datasetObject);
    }
    return { error: true, message: validationResult.message };
  }
  changeAllImagesTableRowsToDefault();
  return validationResult;
}

function updateCSVTables(parsedObj, validationResult) {
  const datasetObject = datasetObjectManager.getDatasetObject();
  const fileName = parsedObj.body.fileMetaData.name;
  if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
    insertRowToImagesTable(fileName, validationResult);
    if (validationResult.valid) { enableFinishButton(); }
  }
  if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
    const newValidationResult = checkAnnotationAlreadyInTable(
      validationResult, datasetObject,
    );
    // whilst the reValidateExistingAnnotations inserts the new annotation,
    // this overwrites it if it has been incorrectly set with an error
    insertRowToAnnotationsTable(fileName, newValidationResult);
  }
}

export { updateCSVTables as default };
