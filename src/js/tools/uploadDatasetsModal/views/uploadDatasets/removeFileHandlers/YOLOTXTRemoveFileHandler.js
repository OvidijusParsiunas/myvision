import {
  removeFile, getDatasetObject, updateImageFileErrorStatus, replaceActiveClassesFileIfRemoving,
  moveAnnotationFileToFaltyArray, moveAnnotationFileToValidArray,
} from '../datasetObjectManagers/YOLOTXTDatasetObjectManager';
import {
  removeRow, disableFinishButton, insertRowToImagesTable, changeAllImagesTableRowsToDefault,
  insertRowToAnnotationsTable, changeClassesRowToDefault, enableFinishButton,
} from '../style';
import validateYOLOTXTFormat from '../formatValidators/YOLOTXTValidator';
import {
  VALID_ANNOTATION_FILES_ARRAY, IMAGE_FILES_OBJECT,
  CLASSES_FILES_ARRAY, FALTY_ANNOTATION_FILES_ARRAY, ACTIVE_CLASSES_FILE,
} from '../../../consts';

// functionality here cannot be used for all, will need
// to be moved to atomic COCOJSON file

function validateExistingImages(datasetObject) {
  if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length > 0) {
    let foundValid = false;
    Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
      const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
      const validationResult = validateYOLOTXTFormat(imageFile);
      if (!validationResult.error) { foundValid = true; }
      const { name } = imageFile.body.fileMetaData;
      insertRowToImagesTable(name, validationResult);
      updateImageFileErrorStatus(name, validationResult.error);
    });
    if (!foundValid) {
      disableFinishButton();
    }
  } else {
    changeAllImagesTableRowsToDefault();
    disableFinishButton();
  }
}

function validateAnnotationsFile(annotationsArray, filesToBeMovedArray, moveWhenFalty) {
  let foundValid = false;
  annotationsArray.forEach((anntoationsFile) => {
    const validationResult = validateYOLOTXTFormat(anntoationsFile);
    const { name } = anntoationsFile.body.fileMetaData;
    insertRowToAnnotationsTable(name, validationResult);
    if (!validationResult.error) {
      foundValid = true;
      if (!moveWhenFalty) { filesToBeMovedArray.push(anntoationsFile); }
    } else if (moveWhenFalty) {
      filesToBeMovedArray.push(anntoationsFile);
    }
  });
  return foundValid;
}

function validateExistingAnnotations(datasetObject) {
  const filesToBeMovedToFaltyArray = [];
  const filesToBeMovedToValidArray = [];
  const foundValidInValidArray = validateAnnotationsFile(
    datasetObject[VALID_ANNOTATION_FILES_ARRAY], filesToBeMovedToFaltyArray, true,
  );
  const foundValidInFaltyArray = validateAnnotationsFile(
    datasetObject[FALTY_ANNOTATION_FILES_ARRAY], filesToBeMovedToValidArray, false,
  );
  filesToBeMovedToFaltyArray.forEach((annotationFile) => {
    moveAnnotationFileToFaltyArray(annotationFile);
  });
  filesToBeMovedToValidArray.forEach((annotationFile) => {
    moveAnnotationFileToValidArray(annotationFile);
  });
  if (!foundValidInValidArray && !foundValidInFaltyArray) {
    disableFinishButton();
  } else {
    enableFinishButton();
  }
}

function setNewActiveClassesFileRow(activeClassesFile, datasetObject) {
  changeClassesRowToDefault(activeClassesFile.body.fileMetaData.name);
  activeClassesFile.newlyActive = false;
  validateExistingAnnotations(datasetObject);
  validateExistingImages(datasetObject);
}

// use consts for table indicators

function removeFileHandler(fileName, tableName, errorMessage) {
  const datasetObject = getDatasetObject();
  if (tableName === 'annotations') {
    removeFile(fileName, VALID_ANNOTATION_FILES_ARRAY);
    removeFile(fileName, FALTY_ANNOTATION_FILES_ARRAY);
    if (!errorMessage) {
      if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length === 0) {
        disableFinishButton();
        changeAllImagesTableRowsToDefault();
      } else {
        validateExistingImages(datasetObject);
      }
    }
  } else if (tableName === 'images') {
    removeFile(fileName, IMAGE_FILES_OBJECT);
    if (Object.keys(datasetObject[IMAGE_FILES_OBJECT])
      .filter((key => !datasetObject[IMAGE_FILES_OBJECT][key].error))
      .length === 0) {
      disableFinishButton();
    }
  } else if (tableName === 'classes') {
    removeFile(fileName, CLASSES_FILES_ARRAY);
    if (!errorMessage) {
      replaceActiveClassesFileIfRemoving(fileName);
      if (datasetObject[ACTIVE_CLASSES_FILE] !== null) {
        setNewActiveClassesFileRow(datasetObject[ACTIVE_CLASSES_FILE], datasetObject);
      } else {
        validateExistingAnnotations(datasetObject);
        validateExistingImages(datasetObject);
      }
    }
  }
  removeRow(fileName, tableName);
}

export { removeFileHandler as default };
