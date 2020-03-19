import { VALID_ANNOTATION_FILES_ARRAY, FALTY_ANNOTATION_FILES_ARRAY, IMAGE_FILES_ARRAY } from '../sharedConsts/consts';

const datasetObject = { activeAnnotationFile: null };
datasetObject[VALID_ANNOTATION_FILES_ARRAY] = [];
datasetObject[FALTY_ANNOTATION_FILES_ARRAY] = [];
datasetObject[IMAGE_FILES_ARRAY] = [];

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
    datasetObject.activeAnnotationFile = annotationFiles[annotationFiles.length - 1];
  } else {
    datasetObject.activeAnnotationFile = datasetObject[
      VALID_ANNOTATION_FILES_ARRAY][existingFileIndex];
  }
}

function removeFile(fileName, arrayName) {
  const subjectArray = datasetObject[arrayName];
  const foundIndex = getIndexOfFileInArray(fileName, subjectArray);
  if (foundIndex !== undefined) {
    subjectArray.splice(
      foundIndex, 1,
    );
  }
  return foundIndex;
}

function replaceActiveAnnotationFileIfSame(fileName) {
  if (datasetObject.activeAnnotationFile
    && datasetObject.activeAnnotationFile.body.fileMetaData.name === fileName) {
    let newActiveAnnotationFile = null;
    for (let i = datasetObject[VALID_ANNOTATION_FILES_ARRAY].length - 1; i > -1; i -= 1) {
      if (datasetObject[VALID_ANNOTATION_FILES_ARRAY][i].body.fileMetaData.name !== fileName) {
        newActiveAnnotationFile = datasetObject[VALID_ANNOTATION_FILES_ARRAY][i];
      }
    }
    datasetObject.activeAnnotationFile = newActiveAnnotationFile;
    if (datasetObject.activeAnnotationFile) {
      datasetObject.activeAnnotationFile.newlyActive = true;
    }
  }
}

function addAnnotationFile(annotationFileObj, error) {
  const { name } = annotationFileObj.body.fileMetaData;
  if (!error) {
    addValidAnnotationFile(name, annotationFileObj);
    removeFile(name, FALTY_ANNOTATION_FILES_ARRAY);
  } else {
    replaceActiveAnnotationFileIfSame(name);
    removeFile(name, VALID_ANNOTATION_FILES_ARRAY);
    addFaltyAnnotationsFile(name, annotationFileObj);
  }
}

function addImageFile(imageFileObj) {
  datasetObject[IMAGE_FILES_ARRAY].push(imageFileObj);
}

function getAnnotationFiles() {
  return datasetObject[VALID_ANNOTATION_FILES_ARRAY];
}

function getFaltyAnnotationFiles() {
  return datasetObject[FALTY_ANNOTATION_FILES_ARRAY];
}

function getImageFiles() {
  return datasetObject[IMAGE_FILES_ARRAY];
}

function getDatasetObject() {
  return datasetObject;
}

export {
  getAnnotationFiles, getImageFiles, removeFile, getDatasetObject,
  addAnnotationFile, addImageFile, getFaltyAnnotationFiles,
};
