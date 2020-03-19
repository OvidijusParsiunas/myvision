let addFileFunc = null;
let fileParserFunc = null;
let tableUpdaterFunc = null;
let formatValidatorFunc = null;

function onFileLoad(fileMetaData, event) {
  const parsedFileObj = fileParserFunc(fileMetaData, event);
  let { errorObj } = parsedFileObj;
  if (!errorObj) {
    errorObj = formatValidatorFunc(parsedFileObj);
  }
  addFileFunc(parsedFileObj, errorObj.error);
  tableUpdaterFunc(fileMetaData, errorObj);
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
  }
}

function setFormatValidator(formatValidatorFuncArg) {
  formatValidatorFunc = formatValidatorFuncArg;
}

function setTableUpdater(tableUpdaterFuncArg) {
  tableUpdaterFunc = tableUpdaterFuncArg;
}

function setAddFile(addFileFuncArg) {
  addFileFunc = addFileFuncArg;
}

function setFileParser(fileParserFuncArg) {
  fileParserFunc = fileParserFuncArg;
}

export {
  setFileParser, setTableUpdater, setFormatValidator, uploadDatasetFilesHandler, setAddFile,
};
