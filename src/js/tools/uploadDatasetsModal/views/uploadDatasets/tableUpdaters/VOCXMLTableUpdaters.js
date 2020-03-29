import {
  insertRowToAnnotationsTable, insertRowToImagesTable, enableFinishButton, disableFinishButton,
  changeAllImagesTableRowsToDefault,
} from '../style';
import validateVGGJSONFormat from '../formatValidators/VOCXMLValidator';
import { IMAGE_FILES_OBJECT, VALID_ANNOTATION_FILES_ARRAY } from '../../../consts';
import { getDatasetObject, updateImageFileErrorStatus } from '../datasetObjectManagers/VOCXMLDatasetObjectManager';

function validateExistingImages(datasetObject) {
  if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length > 0) {
    let foundValid = false;
    Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
      const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
      const validationResult = validateVGGJSONFormat(imageFile);
      if (!validationResult.error) { foundValid = true; }
      const { name } = imageFile.body.fileMetaData;
      insertRowToImagesTable(name, validationResult);
      updateImageFileErrorStatus(name, validationResult.error);
    });
    if (foundValid) {
      enableFinishButton();
    } else {
      disableFinishButton();
    }
  } else {
    changeAllImagesTableRowsToDefault();
    disableFinishButton();
  }
}

function updateVOCXMLTables(parsedObj, validationResult) {
  const datasetObject = getDatasetObject();
  const fileName = parsedObj.body.fileMetaData.name;
  if (parsedObj.fileFormat === 'image') {
    insertRowToImagesTable(fileName, validationResult);
    if (validationResult.valid) { enableFinishButton(); }
  }
  if (parsedObj.fileFormat === 'annotation') {
    validateExistingImages(datasetObject);
    insertRowToAnnotationsTable(fileName, validationResult);
  }
}

export { updateVOCXMLTables as default };
