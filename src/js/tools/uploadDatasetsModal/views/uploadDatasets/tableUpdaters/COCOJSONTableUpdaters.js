import { insertRowToAnnotationsTable, insertRowToImagesTable, changeAllImagesTableRowsToDefault } from '../style';
import validateCOCOJSONFormat from '../formatValidators/COCOJSONValidator';

const ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE = 'Only one annotation file is allowed per dataset (app version 1.0)';
let allImagesValidated = true;

function validateExistingImages(imageFiles, annotationFiles) {
  imageFiles.forEach((imageFile) => {
    const validationResult = validateCOCOJSONFormat(imageFile, annotationFiles);
    const { name } = imageFile.body.fileMetaData;
    insertRowToImagesTable(name, validationResult);
  });
}

function validateExistingAnnotations(annotationFiles) {
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

function checkAnnotationAlreadyInTable(validationResult, annotationFiles) {
  if (!validationResult.error) {
    validateExistingAnnotations(annotationFiles);
    return validationResult;
  }
  if (annotationFiles.length > 0) {
    return { error: true, message: validationResult.message };
  }
  if (allImagesValidated) {
    changeAllImagesTableRowsToDefault();
    allImagesValidated = false;
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
    if (!validationResult.error) {
      validateExistingImages(imageFiles, annotationFiles);
      allImagesValidated = true;
    }
  }
}

export { updateCOCOJSONTables as default };
