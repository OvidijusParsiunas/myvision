import {
  VALID_ANNOTATION_FILES_ARRAY, FALTY_ANNOTATION_FILES_ARRAY,
  ACTIVE_ANNOTATION_FILE, IMAGE_FILES_OBJECT,
} from '../sharedConsts/consts';

const datasetObject = { };
datasetObject[ACTIVE_ANNOTATION_FILE] = null;
datasetObject[VALID_ANNOTATION_FILES_ARRAY] = [];
datasetObject[FALTY_ANNOTATION_FILES_ARRAY] = [];
datasetObject[IMAGE_FILES_OBJECT] = {};

function getIndexOfFileInArray(fileName, subjectArray) {
  for (let i = 0; i < subjectArray.length; i += 1) {
    if (subjectArray[i].body.fileMetaData.name === fileName) {
      return i;
    }
  }
  return undefined;
}

function addFaltyAnnotationsFile(fileName, annotationFileObj) {
  if (getIndexOfFileInArray(fileName, datasetObject[FALTY_ANNOTATION_FILES_ARRAY]) === undefined) {
    datasetObject[FALTY_ANNOTATION_FILES_ARRAY].push(annotationFileObj);
  }
}

function addValidAnnotationFile(fileName, annotationFileObj) {
  const existingFileIndex = getIndexOfFileInArray(fileName,
    datasetObject[VALID_ANNOTATION_FILES_ARRAY]);
  if (existingFileIndex === undefined) {
    const annotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    annotationFiles.push(annotationFileObj);
    datasetObject[ACTIVE_ANNOTATION_FILE] = annotationFiles[annotationFiles.length - 1];
  } else {
    datasetObject[ACTIVE_ANNOTATION_FILE] = datasetObject[
      VALID_ANNOTATION_FILES_ARRAY][existingFileIndex];
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

function replaceActiveAnnotationFileIfRemoving(fileName) {
  if (datasetObject[ACTIVE_ANNOTATION_FILE]
    && datasetObject[ACTIVE_ANNOTATION_FILE].body.fileMetaData.name === fileName) {
    let newActiveAnnotationFile = null;
    for (let i = datasetObject[VALID_ANNOTATION_FILES_ARRAY].length - 1; i > -1; i -= 1) {
      if (datasetObject[VALID_ANNOTATION_FILES_ARRAY][i].body.fileMetaData.name !== fileName) {
        newActiveAnnotationFile = datasetObject[VALID_ANNOTATION_FILES_ARRAY][i];
      }
    }
    datasetObject[ACTIVE_ANNOTATION_FILE] = newActiveAnnotationFile;
    if (datasetObject[ACTIVE_ANNOTATION_FILE]) {
      datasetObject[ACTIVE_ANNOTATION_FILE].newlyActive = true;
    }
  }
}

function addAnnotationFile(annotationFileObj, error) {
  const { name } = annotationFileObj.body.fileMetaData;
  if (!error) {
    addValidAnnotationFile(name, annotationFileObj);
    removeFile(name, FALTY_ANNOTATION_FILES_ARRAY);
  } else {
    replaceActiveAnnotationFileIfRemoving(name);
    removeFile(name, VALID_ANNOTATION_FILES_ARRAY);
    addFaltyAnnotationsFile(name, annotationFileObj);
  }
}

function isInImagesList(name) {
  return datasetObject[IMAGE_FILES_OBJECT][name];
}

function updateImageFileErrorStatus(name, errorStatus) {
  datasetObject[IMAGE_FILES_OBJECT][name].body.error = errorStatus;
}

function addImageFile(imageFileObj, errorObject) {
  if (!isInImagesList(imageFileObj.body.fileMetaData.name)) {
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
  }
}

function getActiveAnnotationFile() {
  return datasetObject[ACTIVE_ANNOTATION_FILE];
}

function getAnnotationFiles() {
  return datasetObject[VALID_ANNOTATION_FILES_ARRAY];
}

function getFaltyAnnotationFiles() {
  return datasetObject[FALTY_ANNOTATION_FILES_ARRAY];
}

function getImageFiles() {
  return datasetObject[IMAGE_FILES_OBJECT];
}

function getDatasetObject() {
  return datasetObject;
}

export {
  getAnnotationFiles, getImageFiles, removeFile, getDatasetObject, getActiveAnnotationFile, addFile,
  addAnnotationFile, addImageFile, getFaltyAnnotationFiles, replaceActiveAnnotationFileIfRemoving,
  updateImageFileErrorStatus,
};
