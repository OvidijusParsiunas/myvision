import {
  insertRowToAnnotationsTable, insertRowToImagesTable,
  changeAllImagesTableRowsToDefault, changeAnnotationRowToDefault,
} from '../style';
import validateCOCOJSONFormat from '../formatValidators/COCOJSONValidator';
import {
  ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE, VALID_ANNOTATION_FILES_ARRAY,
  ACTIVE_ANNOTATION_FILE, IMAGE_FILES_OBJECT,
} from '../sharedConsts/consts';
import { getDatasetObject, updateImageFileErrorStatus } from '../datasetObjectManagers/COCOJSONDatasetObjectManager';

function validateExistingImages(datasetObject) {
  Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
    const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
    const validationResult = validateCOCOJSONFormat(imageFile);
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
    updateImageFileErrorStatus(name, validationResult.error);
  });
}

function reValidateExistingAnnotations(annotationFiles) {
  annotationFiles.forEach((annotationFile) => {
    const validationResult = validateCOCOJSONFormat(annotationFile);
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

function updateCOCOJSONTables(fileMetaData, validationResult) {
  const datasetObject = getDatasetObject();
  const fileType = fileMetaData.type;
  const fileName = fileMetaData.name;
  if (fileType.startsWith('image/')) {
    insertRowToImagesTable(fileName, validationResult);
  }
  if (fileName.endsWith('.json')) {
    const newValidationResult = checkAnnotationAlreadyInTable(
      validationResult, datasetObject,
    );
    // whilst the reValidateExistingAnnotations inserts the new annotation,
    // this overwrites it if it has been incorrectly set with an error
    insertRowToAnnotationsTable(fileName, newValidationResult);
  }
}

export { updateCOCOJSONTables as default };
