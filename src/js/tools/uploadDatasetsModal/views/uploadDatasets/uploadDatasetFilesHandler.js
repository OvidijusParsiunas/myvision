import { insertRowToImagesTable } from './style';

let fileParserFunc = null;
let setDatasetObjectFunc = null;
const datasetObject = {};
let fileIndex = 0;

function onFileLoad(imageMetaData, event) {
  const returnedObj = fileParserFunc(imageMetaData, event);
  datasetObject[fileIndex] = returnedObj;
  insertRowToImagesTable(datasetObject[fileIndex].body.fileMetaData.name);
  fileIndex += 1;
}

function uploadDatasetFilesHandler(uploadData) {
  if (uploadData.files && uploadData.files.length > 0) {
    for (let i = 0; i < uploadData.files.length; i += 1) {
      const reader = new FileReader();
      reader.onload = onFileLoad.bind(this, uploadData.files[i]);
      reader.readAsDataURL(uploadData.files[i]);
    }
    setDatasetObjectFunc(datasetObject);
  }
}

function setFileParser(fileParserFuncArg) {
  fileParserFunc = fileParserFuncArg;
}

function initialiseSetDatasetObjectFunc(setDatasetObjectFuncArg) {
  setDatasetObjectFunc = setDatasetObjectFuncArg;
}

export { uploadDatasetFilesHandler, setFileParser, initialiseSetDatasetObjectFunc };
