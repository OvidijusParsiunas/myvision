import {
  VALID_ANNOTATION_FILES_ARRAY, CLASSES_FILES_ARRAY, ACTIVE_CLASSES_FILE, IMAGE_FILES_OBJECT,
} from '../../../consts';

const datasetObject = { };
datasetObject[CLASSES_FILES_ARRAY] = [];
datasetObject[ACTIVE_CLASSES_FILE] = null;
datasetObject[VALID_ANNOTATION_FILES_ARRAY] = [];
datasetObject[IMAGE_FILES_OBJECT] = {};

function getIndexOfFileInArray(fileName, subjectArray) {
  for (let i = 0; i < subjectArray.length; i += 1) {
    if (subjectArray[i].body.fileMetaData.name === fileName) {
      return i;
    }
  }
  return undefined;
}

function addValidAnnotationFile(fileName, annotationFileObj) {
  const existingFileIndex = getIndexOfFileInArray(fileName,
    datasetObject[VALID_ANNOTATION_FILES_ARRAY]);
  if (existingFileIndex === undefined) {
    const annotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    annotationFiles.push(annotationFileObj);
  }
}

function removeFile(fileName, objectName) {
  if (Array.isArray(datasetObject[objectName])) {
    const subjectArray = datasetObject[objectName];
    const foundIndex = getIndexOfFileInArray(fileName, subjectArray);
    if (foundIndex !== undefined) {
      subjectArray.splice(
        foundIndex, 1,
      );
    }
  } else {
    delete datasetObject[objectName][fileName];
  }
}

function replaceActiveClassesFileIfRemoving(fileName) {
  if (datasetObject[ACTIVE_CLASSES_FILE]
    && datasetObject[ACTIVE_CLASSES_FILE].body.fileMetaData.name === fileName) {
    let newActiveClassesFile = null;
    for (let i = datasetObject[CLASSES_FILES_ARRAY].length - 1; i > -1; i -= 1) {
      if (datasetObject[CLASSES_FILES_ARRAY][i].body.fileMetaData.name !== fileName) {
        newActiveClassesFile = datasetObject[CLASSES_FILES_ARRAY][i];
      }
    }
    datasetObject[ACTIVE_CLASSES_FILE] = newActiveClassesFile;
    if (datasetObject[ACTIVE_CLASSES_FILE]) {
      datasetObject[ACTIVE_CLASSES_FILE].newlyActive = true;
    }
  }
}

function addClassesFile(classesFileObj, error) {
  const { name } = classesFileObj.body.fileMetaData;
  if (!error) {
    addValidAnnotationFile(name, classesFileObj);
    // check if need to remove the falty one, probably do, but double check
    // that it does not cause two fields to be drawn on the table
    // when valid is drawn again
  } else {
    removeFile(name, VALID_ANNOTATION_FILES_ARRAY);
  }
}

function clearDatasetObject() {
  datasetObject[VALID_ANNOTATION_FILES_ARRAY] = [];
  datasetObject[IMAGE_FILES_OBJECT] = {};
}

function addAnnotationFile(annotationFileObj, error) {
  const { name } = annotationFileObj.body.fileMetaData;
  if (!error) {
    addValidAnnotationFile(name, annotationFileObj);
  } else {
    removeFile(name, VALID_ANNOTATION_FILES_ARRAY);
  }
}

function isInImagesList(name) {
  return datasetObject[IMAGE_FILES_OBJECT][name];
}

function updateImageFileErrorStatus(name, errorStatus) {
  datasetObject[IMAGE_FILES_OBJECT][name].error = errorStatus;
}

function addImageFile(imageFileObj, errorObject) {
  if (!isInImagesList(imageFileObj.body.fileMetaData.name)) {
    // the error property is used to draw shapes on valid images only
    imageFileObj.error = errorObject.error;
    imageFileObj.alreadyUploaded = errorObject.alreadyUploaded;
    datasetObject[IMAGE_FILES_OBJECT][imageFileObj.body.fileMetaData.name] = imageFileObj;
  }
}

function addFile(file, errorObject) {
  if (file.fileFormat === 'image') {
    addImageFile(file, errorObject);
  } else if (file.fileFormat === 'annotation') {
    addAnnotationFile(file, errorObject.error);
  } else if (file.format === 'classes') {
    addClassesFile(file, errorObject.error);
  }
}

function getAnnotationFiles() {
  return datasetObject[VALID_ANNOTATION_FILES_ARRAY];
}

function getImageFiles() {
  return datasetObject[IMAGE_FILES_OBJECT];
}

function getDatasetObject() {
  return datasetObject;
}

export {
  addAnnotationFile, getImageFiles, removeFile, getDatasetObject, addFile,
  getAnnotationFiles, addImageFile, clearDatasetObject, updateImageFileErrorStatus,
  replaceActiveClassesFileIfRemoving,
};
