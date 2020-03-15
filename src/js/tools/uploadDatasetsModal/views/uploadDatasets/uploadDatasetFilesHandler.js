let fileParserFunc = null;
let tableUpdaterFunc = null;
let formatValidatorFunc = null;
let setDatasetObjectFunc = null;
const datasetObject = { annotationFiles: [], imageFiles: [], imagesValidated: false };
let fileIndex = 0;

function validateExistingImages() {
  datasetObject.imageFiles.forEach((imageFile) => {
    const validationResult = formatValidatorFunc(imageFile, datasetObject);
    const { fileMetaData } = imageFile.body;
    tableUpdaterFunc(fileMetaData, validationResult);
  });
}

function onFileLoad(fileMetaData, event) {
  const parsedFileObj = fileParserFunc(fileMetaData, event);
  let { errorObj } = parsedFileObj;
  if (!errorObj) {
    errorObj = formatValidatorFunc(parsedFileObj, datasetObject);
  }
  tableUpdaterFunc(fileMetaData, errorObj);
  if (parsedFileObj.fileFormat === 'image') {
    datasetObject.imageFiles[fileIndex] = parsedFileObj;
  } else if (!errorObj.error) {
    datasetObject.annotationFiles[fileIndex] = parsedFileObj;
    validateExistingImages();
  }
  fileIndex += 1;
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
