let fileParserFunc = null;
let tableUpdaterFunc = null;
let formatValidatorFunc = null;
let setDatasetObjectFunc = null;
const datasetObject = { annotationFiles: [], faltyAnnotationFiles: [], imageFiles: [] };

// delete file
// search for file name in the arrays and remove it (if present) + remove from the table
// upon deleting an annotation, switch back to the last one that was working, if none working ->
// reparse all of the broken ones (use splice) and set all images to not have an error

function onFileLoad(fileMetaData, event) {
  const parsedFileObj = fileParserFunc(fileMetaData, event);
  let { errorObj } = parsedFileObj;
  if (!errorObj) {
    errorObj = formatValidatorFunc(parsedFileObj, datasetObject);
  }
  if (parsedFileObj.fileFormat === 'image') {
    datasetObject.imageFiles.push(parsedFileObj);
  } else if (parsedFileObj.fileFormat === 'annotation') {
    if (!errorObj.error) {
      datasetObject.annotationFiles.push(parsedFileObj);
    } else {
      datasetObject.faltyAnnotationFiles.push(parsedFileObj);
    }
  }
  tableUpdaterFunc(fileMetaData, errorObj, datasetObject);
}

function readFile(reader, file) {
  if (file.name.endsWith('.json')) {
    reader.readAsText(file);
  } else {
    reader.readAsDataURL(file);
  }
}

function uploadDatasetFilesHandler(uploadData) {
  if (uploadData.files && uploadData.files.length > 0) {
    for (let i = 0; i < uploadData.files.length; i += 1) {
      const reader = new FileReader();
      reader.onload = onFileLoad.bind(this, uploadData.files[i]);
      readFile(reader, uploadData.files[i]);
    }
    setDatasetObjectFunc(datasetObject);
  }
}

function setFormatValidator(formatValidatorFuncArg) {
  formatValidatorFunc = formatValidatorFuncArg;
}

function setTableUpdater(tableUpdaterFuncArg) {
  tableUpdaterFunc = tableUpdaterFuncArg;
}

function setFileParser(fileParserFuncArg) {
  fileParserFunc = fileParserFuncArg;
}

function initialiseSetDatasetObjectFunc(setDatasetObjectFuncArg) {
  setDatasetObjectFunc = setDatasetObjectFuncArg;
}

export {
  setFileParser, setTableUpdater, setFormatValidator,
  initialiseSetDatasetObjectFunc, uploadDatasetFilesHandler,
};
