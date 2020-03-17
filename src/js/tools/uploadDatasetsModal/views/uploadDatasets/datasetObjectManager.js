const datasetObject = { annotationFiles: [], faltyAnnotationFiles: [], imageFiles: [] };

// should valid ones that have become falty due to a new one be inserted into falty (preferrably not)
// what happens when the valid one becomes invalid and there are other valid ones out there

function removeFile(fileName, arrayName) {
  const subjectArray = datasetObject[arrayName];
  let foundIndex;
  for (let i = 0; i < subjectArray.length; i += 1) {
    if (subjectArray[i].body.fileMetaData.name === fileName) {
      foundIndex = i;
      break;
    }
  }
  if (foundIndex !== undefined) {
    subjectArray.splice(
      foundIndex, 1,
    );
  }
}

function addAnnotationFile(annotationFileObj, error) {
  const { name } = annotationFileObj.body.fileMetaData;
  if (!error) {
    datasetObject.annotationFiles.push(annotationFileObj);
    removeFile(name, 'faltyAnnotationFiles');
  } else {
    datasetObject.faltyAnnotationFiles.push(annotationFileObj);
    removeFile(name, 'annotationFiles');
  }
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
  getAnnotationFiles, getImageFiles, removeFile,
  addAnnotationFile, addImageFile, getFaltyAnnotationFiles,
};
