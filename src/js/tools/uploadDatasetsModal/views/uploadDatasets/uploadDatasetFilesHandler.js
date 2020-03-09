let fileParserFunc = null;
let tableUpdaterFunc = null;
let setDatasetObjectFunc = null;
const datasetObject = {};
let fileIndex = 0;

function onFileLoad(fileMetaData, event) {
  const returnedObj = fileParserFunc(fileMetaData, event);
  datasetObject[fileIndex] = returnedObj;
  tableUpdaterFunc(fileMetaData);
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
  uploadDatasetFilesHandler, setTableUpdater,
  initialiseSetDatasetObjectFunc, setFileParser,
};
