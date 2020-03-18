import {
  insertRowToAnnotationsTable, insertRowToImagesTable,
  changeAllImagesTableRowsToDefault, changeAnnotationRowToDefault,
} from '../style';
import validateCOCOJSONFormat from '../formatValidators/COCOJSONValidator';

const ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE = 'Only one annotation file is allowed per dataset (app version 1.0)';
let allImagesValidated = true;

function validateExistingImages(datasetObject) {
  datasetObject.imageFiles.forEach((imageFile) => {
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
      annotationFile.body.redundancy = true;
    }
    insertRowToAnnotationsTable(name, validationResult);
  });
}

function checkAnnotationAlreadyInTable(validationResult, fileName, datasetObject) {
  const { validAnnotationFiles, activeAnnotationFile } = datasetObject;
  if (!validationResult.error) {
    reValidateExistingAnnotations(validAnnotationFiles, datasetObject);
    return validationResult;
  }
  if (validAnnotationFiles.length > 0) {
    if (activeAnnotationFile && activeAnnotationFile.newlyActive) {
      changeAnnotationRowToDefault(activeAnnotationFile.body.fileMetaData.name);
      activeAnnotationFile.newlyActive = false;
      // re-evaluate the existing images
      // try to create a test case for another json object to make sure this is cascaded correctly
      // see when two valid ones are turned into null, all objects should be set to default
    }
    return { error: true, message: validationResult.message };
  }
  if (allImagesValidated) {
    changeAllImagesTableRowsToDefault();
    allImagesValidated = false;
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
      validationResult, fileName, datasetObject,
    );
    insertRowToAnnotationsTable(fileName, newValidationResult);
    if (!validationResult.error) {
      validateExistingImages(datasetObject);
      allImagesValidated = true;
    }
  }
}

export { updateCOCOJSONTables as default };
