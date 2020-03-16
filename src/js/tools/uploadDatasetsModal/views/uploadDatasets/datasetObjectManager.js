const datasetObject = { annotationFiles: [], faltyAnnotationFiles: [], imageFiles: [] };

function addAnnotationFile(annotationFileObj) {
  datasetObject.annotationFiles.push(annotationFileObj);
}

function addFaltyAnnotationFile(faltyAnnotationFileObj) {
  datasetObject.faltyAnnotationFiles.push(faltyAnnotationFileObj);
}

function addImageFile(imageFileObj) {
  datasetObject.imageFiles.push(imageFileObj);
}

export { addAnnotationFile, addFaltyAnnotationFile, addImageFile };
