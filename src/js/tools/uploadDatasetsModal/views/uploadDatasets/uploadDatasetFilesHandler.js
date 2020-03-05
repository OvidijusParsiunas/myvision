let fileParserFunc = null;
let setDatasetObjectFunc = null;
const datasetObject = {};

function setFileParser(fileParserFuncArg) {
  fileParserFunc = fileParserFuncArg;
}

function onFileLoad(imageMetaData, event) {
  const returnedObj = fileParserFunc(event);
  const { fileFormat, body } = returnedObj;
  datasetObject[fileFormat] = body;
  // const image = new Image();
  // image.src = event.target.result;
  // addImageFromMultiUploadToList(imageMetadata, image);
}

function uploadDatasetFilesHandler(uploadData) {
  if (uploadData.files && uploadData.files.length > 0) {
    for (let i = 0; i < uploadData.files.length; i += 1) {
      const reader = new FileReader();
      reader.onload = onFileLoad.bind(this, uploadData.files[i]);
      reader.readAsDataURL(uploadData.files[i]);
    }
  }
  setDatasetObjectFunc(datasetObject);
}

function initialiseSetDatasetObjectFunc(setDatasetObjectFuncArg) {
  setDatasetObjectFunc = setDatasetObjectFuncArg;
}

export { uploadDatasetFilesHandler, setFileParser, initialiseSetDatasetObjectFunc };
