import { insertRowToAnnotationsTable, changeAllAnnotationsTableRowsToHaveError, insertRowToImagesTable } from '../style';
import validateCOCOJSONFormat from '../formatValidators/COCOJSONValidator';

const ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE = 'Only one annotation file is allowed per dataset (app version 1.0)';

function validateExistingImages(imageFiles, annotationFiles) {
  imageFiles.forEach((imageFile) => {
    const validationResult = validateCOCOJSONFormat(imageFile, annotationFiles);
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
  });
}

function checkAnnotationAlreadyInTable(validationResult, annotationFiles) {
  if (!validationResult.error) {
    changeAllAnnotationsTableRowsToHaveError(ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE);
    return validationResult;
  }
  if (annotationFiles.length > 0) {
    return { error: true, message: validationResult.message };
  }
  return validationResult;
}

function updateCOCOJSONTables(fileMetaData, validationResult, annotationFiles, imageFiles) {
  const fileType = fileMetaData.type;
  const fileName = fileMetaData.name;
  if (fileType.startsWith('image/')) {
    insertRowToImagesTable(fileName, validationResult);
  }
  if (fileName.endsWith('.json')) {
    const newValidationResult = checkAnnotationAlreadyInTable(validationResult, annotationFiles);
    insertRowToAnnotationsTable(fileName, newValidationResult);
    if (!validationResult.error) { validateExistingImages(imageFiles, annotationFiles); }
  }
}

export { updateCOCOJSONTables as default };
