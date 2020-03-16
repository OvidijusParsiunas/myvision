const datasetObject = { annotationFiles: [], faltyAnnotationFiles: [], imageFiles: [] };

function addAnnotationFile(annotationFileObj) {
  datasetObject.annotationFiles.push(annotationFileObj);
}

function removeAnnotationFile(fileName) {
  console.log(datasetObject.annotationFiles);
  // list.splice( list.indexOf('foo'), 1 );
}

function addFaltyAnnotationFile(faltyAnnotationFileObj) {
  datasetObject.faltyAnnotationFiles.push(faltyAnnotationFileObj);
}

function addImageFile(imageFileObj) {
  datasetObject.imageFiles.push(imageFileObj);
}

function getAnnotationFiles() {
  return datasetObject.annotationFiles;
}

function getFaltyAnnotationFiles() {
  return datasetObject.faltyAnnotationFiles;
}

function getImageFiles() {
  return datasetObject.imageFiles;
}

export {
  getAnnotationFiles, getFaltyAnnotationFiles, getImageFiles,
  addAnnotationFile, addFaltyAnnotationFile, addImageFile, removeAnnotationFile,
};
