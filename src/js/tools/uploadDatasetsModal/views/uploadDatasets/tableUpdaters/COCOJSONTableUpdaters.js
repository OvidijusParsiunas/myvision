import { insertRowToAnnotationsTable, changeAllAnnotationsTableRowsToHaveError, insertRowToImagesTable } from '../style';
import validateCOCOJSONFormat from '../formatValidators/COCOJSONValidator';

const ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE = 'Only one annotation file is allowed per dataset (app version 1.0)';

function validateExistingImages(datasetObject) {
  datasetObject.imageFiles.forEach((imageFile) => {
    const validationResult = validateCOCOJSONFormat(imageFile, datasetObject);
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult, datasetObject);
  });
}

function checkAnnotationAlreadyInTable(validationResult, annotationFiles) {
  if (!validationResult.error) {
    changeAllAnnotationsTableRowsToHaveError(ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE);
    return validationResult;
  }
  if (annotationFiles.length > 0) {
    return { error: true, message: ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE };
  }
  return validationResult;
}

function updateCOCOJSONTables(fileMetaData, validationResult, datasetObject) {
  const fileType = fileMetaData.type;
  const fileName = fileMetaData.name;
  if (fileType.startsWith('image/')) {
    insertRowToImagesTable(fileName, validationResult);
  }
  if (fileName.endsWith('.json')) {
    const newValidationResult = checkAnnotationAlreadyInTable(
      validationResult, datasetObject.annotationFiles,
    );
    insertRowToAnnotationsTable(fileName, newValidationResult);
    if (!validationResult.error) { validateExistingImages(datasetObject); }
  }
}

export { updateCOCOJSONTables as default };
