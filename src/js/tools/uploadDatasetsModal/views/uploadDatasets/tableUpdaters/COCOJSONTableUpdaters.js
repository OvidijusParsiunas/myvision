import {
  insertRowToAnnotationsTable, insertRowToImagesTable,
  changeAllImagesTableRowsToDefault, changeAnnotationRowToDefault,
} from '../style';
import validateCOCOJSONFormat from '../formatValidators/COCOJSONValidator';
import {
  ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE, VALID_ANNOTATION_FILES_ARRAY,
  IMAGE_FILES_ARRAY, ACTIVE_ANNOTATION_FILE,
} from '../sharedConsts/consts';
import { getDatasetObject } from '../datasetObjectManagers/COCOJSONDatasetObjectManager';

function validateExistingImages(datasetObject) {
  datasetObject[IMAGE_FILES_ARRAY].forEach((imageFile) => {
    const validationResult = validateCOCOJSONFormat(imageFile, datasetObject);
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
  });
}

function reValidateExistingAnnotations(annotationFiles, datasetObject) {
  annotationFiles.forEach((annotationFile) => {
    const validationResult = validateCOCOJSONFormat(annotationFile, datasetObject);
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
    reValidateExistingAnnotations(validAnnotationFiles, datasetObject);
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
  changeAllImagesTableRowsToDefault(datasetObject[IMAGE_FILES_ARRAY]);
  return validationResult;
}

function updateCOCOJSONTables(fileMetaData, validationResult) {
  const datasetObject = getDatasetObject();
  const fileType = fileMetaData.type;
  const fileName = fileMetaData.name;
  if (fileType.startsWith('image/')) {
    // when manually uploading and already uploaded
    // when uploading or changing new annotations file
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
