import * as UploadDatasetsConsts from '../../../../consts';

const datasetObject = { };
datasetObject[UploadDatasetsConsts.ACTIVE_ANNOTATION_FILE] = null;
datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY] = [];
datasetObject[UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY] = [];
datasetObject[UploadDatasetsConsts.ACTIVE_CLASSES_FILE] = null;
datasetObject[UploadDatasetsConsts.CLASSES_FILES_ARRAY] = [];
datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT] = {};

function clearDatasetObject() {
  datasetObject[UploadDatasetsConsts.CLASSES_FILES_ARRAY] = [];
  datasetObject[UploadDatasetsConsts.ACTIVE_CLASSES_FILE] = null;
  datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY] = [];
  datasetObject[UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY] = [];
  datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT] = {};
}

function getIndexOfFileInArray(fileName, subjectArray) {
  for (let i = 0; i < subjectArray.length; i += 1) {
    if (subjectArray[i].body.fileMetaData.name === fileName) {
      return i;
    }
  }
  return undefined;
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
  } else if (datasetObject[objectName]) {
    delete datasetObject[objectName][fileName];
  }
}

function replaceActiveFileIfRemoving(fileName, arrayName, activeFileName) {
  if (datasetObject[activeFileName]
    && datasetObject[activeFileName].body.fileMetaData.name === fileName) {
    let newActiveAnnotationFile = null;
    for (let i = datasetObject[arrayName].length - 1; i > -1; i -= 1) {
      if (datasetObject[arrayName][i].body.fileMetaData.name !== fileName) {
        newActiveAnnotationFile = datasetObject[arrayName][i];
      }
    }
    datasetObject[activeFileName] = newActiveAnnotationFile;
    if (datasetObject[activeFileName]) {
      datasetObject[activeFileName].newlyActive = true;
    }
  }
}

function addNewClassesFile(fileName, classesFileObj) {
  const existingFileIndex = getIndexOfFileInArray(fileName,
    datasetObject[UploadDatasetsConsts.CLASSES_FILES_ARRAY]);
  if (existingFileIndex === undefined) {
    const classesFiles = datasetObject[UploadDatasetsConsts.CLASSES_FILES_ARRAY];
    classesFiles.push(classesFileObj);
    datasetObject[UploadDatasetsConsts.ACTIVE_CLASSES_FILE] = classesFiles[classesFiles.length - 1];
  } else {
    datasetObject[UploadDatasetsConsts.ACTIVE_CLASSES_FILE] = datasetObject[
      UploadDatasetsConsts.CLASSES_FILES_ARRAY][existingFileIndex];
  }
}

function addClassesFile(classesFileObj, error) {
  const { name } = classesFileObj.body.fileMetaData;
  if (!error) {
    addNewClassesFile(name, classesFileObj);
  } else {
    replaceActiveFileIfRemoving(name, UploadDatasetsConsts.CLASSES_FILES_ARRAY,
      UploadDatasetsConsts.ACTIVE_CLASSES_FILE);
    removeFile(name, UploadDatasetsConsts.CLASSES_FILES_ARRAY);
  }
}

function addFaltyAnnotationFile(fileName, annotationFileObj) {
  if (getIndexOfFileInArray(fileName, datasetObject[
    UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY]) === undefined) {
    datasetObject[UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY].push(annotationFileObj);
  }
}

function addValidAnnotationFileWhenOneAllowed(fileName, annotationFileObj) {
  const existingFileIndex = getIndexOfFileInArray(fileName,
    datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY]);
  if (existingFileIndex === undefined) {
    const annotationFiles = datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY];
    annotationFiles.push(annotationFileObj);
    datasetObject[UploadDatasetsConsts.ACTIVE_ANNOTATION_FILE] = annotationFiles[
      annotationFiles.length - 1];
  } else {
    datasetObject[UploadDatasetsConsts.ACTIVE_ANNOTATION_FILE] = datasetObject[
      UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY][existingFileIndex];
  }
}

function addValidAnnotationFileWhenMultipleAllowed(fileName, annotationFileObj) {
  const existingFileIndex = getIndexOfFileInArray(fileName,
    datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY]);
  if (existingFileIndex === undefined) {
    const annotationFiles = datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY];
    annotationFiles.push(annotationFileObj);
  }
}

function addAnnotationFileWhenOneAllowed(annotationFileObj, error) {
  const { name } = annotationFileObj.body.fileMetaData;
  if (!error) {
    addValidAnnotationFileWhenOneAllowed(name, annotationFileObj);
    removeFile(name, UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY);
  } else {
    replaceActiveFileIfRemoving(name, UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY,
      UploadDatasetsConsts.ACTIVE_ANNOTATION_FILE);
    removeFile(name, UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY);
    addFaltyAnnotationFile(name, annotationFileObj);
  }
}

function addAnnotationFileWhenMultipleAllowed(annotationFileObj, error) {
  const { name } = annotationFileObj.body.fileMetaData;
  if (!error) {
    addValidAnnotationFileWhenMultipleAllowed(name, annotationFileObj);
  } else {
    removeFile(name, UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY);
  }
}

function addAnnotationFileWhenMultipleAllowedInclClasses(annotationFileObj, erroObj) {
  const { name } = annotationFileObj.body.fileMetaData;
  if (!erroObj.error) {
    addValidAnnotationFileWhenMultipleAllowed(name, annotationFileObj);
  } else {
    if (!erroObj.parsingError) {
      addFaltyAnnotationFile(name, annotationFileObj);
    }
    removeFile(name, UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY);
  }
}


function moveAnnotationFileToFaltyArray(file) {
  const { name } = file.body.fileMetaData;
  removeFile(name, UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY);
  datasetObject[UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY].push(file);
}

function moveAnnotationFileToValidArray(file) {
  const { name } = file.body.fileMetaData;
  removeFile(name, UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY);
  datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY].push(file);
}

function isInImagesList(name) {
  return datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][name];
}

function updateImageFileErrorStatus(name, errorStatus) {
  datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][name].error = errorStatus;
}

function addImageFile(imageFileObj, errorObject) {
  if (!isInImagesList(imageFileObj.body.fileMetaData.name)) {
    // the error property is used to draw shapes on valid images only
    imageFileObj.error = errorObject.error;
    imageFileObj.alreadyUploaded = errorObject.alreadyUploaded;
    datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT][
      imageFileObj.body.fileMetaData.name] = imageFileObj;
  }
}

function addFileWhenOneAnnotationFileAllowed(file, errorObject) {
  if (file.fileFormat === UploadDatasetsConsts.IMAGE_FILE_INDICATOR) {
    addImageFile(file, errorObject);
  } else if (file.fileFormat === UploadDatasetsConsts.ANNOTATION_FILE_INDICATOR) {
    addAnnotationFileWhenOneAllowed(file, errorObject.error);
  }
}

function addFileWhenMultipleAnnotationFilesAllowed(file, errorObject) {
  if (file.fileFormat === UploadDatasetsConsts.IMAGE_FILE_INDICATOR) {
    addImageFile(file, errorObject);
  } else if (file.fileFormat === UploadDatasetsConsts.ANNOTATION_FILE_INDICATOR) {
    addAnnotationFileWhenMultipleAllowed(file, errorObject.error);
  }
}

function addFileWhenMultipleAnnotationsInclClasses(file, errorObject) {
  if (file.fileFormat === UploadDatasetsConsts.IMAGE_FILE_INDICATOR) {
    addImageFile(file, errorObject);
  } else if (file.fileFormat === UploadDatasetsConsts.ANNOTATION_FILE_INDICATOR) {
    addAnnotationFileWhenMultipleAllowedInclClasses(file, errorObject);
  } else if (file.fileFormat === UploadDatasetsConsts.CLASSES_FILE_INDICATOR) {
    addClassesFile(file, errorObject.error);
  }
}

function getActiveAnnotationFile() {
  return datasetObject[UploadDatasetsConsts.ACTIVE_ANNOTATION_FILE];
}

function getAnnotationFiles() {
  return datasetObject[UploadDatasetsConsts.VALID_ANNOTATION_FILES_ARRAY];
}

function getFaltyAnnotationFiles() {
  return datasetObject[UploadDatasetsConsts.FALTY_ANNOTATION_FILES_ARRAY];
}

function getImageFiles() {
  return datasetObject[UploadDatasetsConsts.IMAGE_FILES_OBJECT];
}

function getDatasetObject() {
  return datasetObject;
}

const oneAnnotationFileStrategyObjectManager = {
  removeFile,
  addImageFile,
  getImageFiles,
  getDatasetObject,
  clearDatasetObject,
  getAnnotationFiles,
  getFaltyAnnotationFiles,
  getActiveAnnotationFile,
  updateImageFileErrorStatus,
  replaceActiveFileIfRemoving,
  addFile: addFileWhenOneAnnotationFileAllowed,
  addAnnotationFile: addAnnotationFileWhenOneAllowed,
};

const multipleAnnotationFilesStrategyObjectManager = {
  removeFile,
  addImageFile,
  getImageFiles,
  getDatasetObject,
  getAnnotationFiles,
  clearDatasetObject,
  getActiveAnnotationFile,
  getFaltyAnnotationFiles,
  updateImageFileErrorStatus,
  replaceActiveFileIfRemoving,
  addFile: addFileWhenMultipleAnnotationFilesAllowed,
  addAnnotationFile: addAnnotationFileWhenMultipleAllowed,
};

const multipleAnnotationFilesInclClassesStrategyObjectManager = {
  removeFile,
  addImageFile,
  getImageFiles,
  getDatasetObject,
  getAnnotationFiles,
  clearDatasetObject,
  getFaltyAnnotationFiles,
  getActiveAnnotationFile,
  updateImageFileErrorStatus,
  replaceActiveFileIfRemoving,
  moveAnnotationFileToFaltyArray,
  moveAnnotationFileToValidArray,
  addFile: addFileWhenMultipleAnnotationsInclClasses,
  addAnnotationFile: addAnnotationFileWhenMultipleAllowedInclClasses,
};


function buildObjectManagerForOneAnnotationFileStrategy() {
  return { ...oneAnnotationFileStrategyObjectManager };
}

function buildObjectManagerForMultipleAnnotationFilesStrategy() {
  return { ...multipleAnnotationFilesStrategyObjectManager };
}

function buildObjectManagerForMultipleAnnotationFilesInclClassesStrategy() {
  return { ...multipleAnnotationFilesInclClassesStrategyObjectManager };
}

const DatasetObjectManagerBuilder = {
  buildObjectManagerForOneAnnotationFileStrategy,
  buildObjectManagerForMultipleAnnotationFilesStrategy,
  buildObjectManagerForMultipleAnnotationFilesInclClassesStrategy,
};

export { DatasetObjectManagerBuilder as default };
