const datasetObject = { validAnnotationFiles: [], faltyAnnotationFiles: [], imageFiles: [] };

// should valid ones that have become falty due to a new one be inserted into falty (preferrably not)
// what happens when the valid one becomes invalid and there are other valid ones out there (delete)
// check x being smaller
/*
  float: left;
  padding-top: 6px;
  margin-right: 5px;
  cursor: pointer;
  width: 7px;
  padding-bottom: 7px;
*/

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
  if (getIndexOfFileInArray(fileName, datasetObject.validAnnotationFiles) === undefined) {
    datasetObject.validAnnotationFiles.push(annotationFileObj);
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
}

function addAnnotationFile(annotationFileObj, error) {
  const { name } = annotationFileObj.body.fileMetaData;
  if (!error) {
    addValidAnnotationFile(name, annotationFileObj);
    removeFile(name, 'faltyAnnotationFiles');
  } else {
    addFaltyAnnotationsFile(name, annotationFileObj);
    removeFile(name, 'validAnnotationFiles');
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

export {
  getAnnotationFiles, getImageFiles, removeFile,
  addAnnotationFile, addImageFile, getFaltyAnnotationFiles,
};
