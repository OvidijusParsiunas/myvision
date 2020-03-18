const datasetObject = {
  activeAnnotationFile: null,
  validAnnotationFiles: [],
  faltyAnnotationFiles: [],
  imageFiles: [],
};

// should valid ones that have become falty due to a new one be inserted into falty (preferrably not)
// what happens when the valid one becomes invalid and there are other valid ones out there (delete)
// check x being smaller

function getIndexOfFileInArray(fileName, subjectArray) {
  for (let i = 0; i < subjectArray.length; i += 1) {
    if (subjectArray[i].body.fileMetaData.name === fileName) {
      return i;
    }
  }
  return undefined;
}

function addFaltyAnnotationsFile(fileName, annotationFileObj) {
  if (getIndexOfFileInArray(fileName, datasetObject.faltyAnnotationFiles) === undefined) {
    datasetObject.faltyAnnotationFiles.push(annotationFileObj);
  }
}

function addValidAnnotationFile(fileName, annotationFileObj) {
  const existingFileIndex = getIndexOfFileInArray(fileName, datasetObject.validAnnotationFiles);
  if (existingFileIndex === undefined) {
    const annotationFiles = datasetObject.validAnnotationFiles;
    annotationFiles.push(annotationFileObj);
    datasetObject.activeAnnotationFile = annotationFiles[annotationFiles.length - 1];
  } else {
    datasetObject.activeAnnotationFile = datasetObject.validAnnotationFiles[existingFileIndex];
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
    for (let i = datasetObject.validAnnotationFiles.length - 1; i > -1; i -= 1) {
      if (datasetObject.validAnnotationFiles[i].body.fileMetaData.name !== fileName) {
        newActiveAnnotationFile = datasetObject.validAnnotationFiles[i];
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
    removeFile(name, 'faltyAnnotationFiles');
  } else {
    replaceActiveAnnotationFileIfSame(name);
    removeFile(name, 'validAnnotationFiles');
    addFaltyAnnotationsFile(name, annotationFileObj);
  }
}

function addImageFile(imageFileObj) {
  datasetObject.imageFiles.push(imageFileObj);
}

function getAnnotationFiles() {
  return datasetObject.validAnnotationFiles;
}

function getFaltyAnnotationFiles() {
  return datasetObject.faltyAnnotationFiles;
}

function getImageFiles() {
  return datasetObject.imageFiles;
}

function getDatasetObject() {
  return datasetObject;
}

export {
  getAnnotationFiles, getImageFiles, removeFile, getDatasetObject,
  addAnnotationFile, addImageFile, getFaltyAnnotationFiles,
};
