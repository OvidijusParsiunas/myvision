import { IMAGE_FILE_INDICATOR } from '../../consts';
import { getAcceptedFileFormat } from './style';
import parseFile from './fileParser';

let addFileFunc = null;
let tableUpdaterFunc = null;
let formatValidatorFunc = null;

function onFileLoad(fileMetaData, event) {
  const parsedFileObj = parseFile(fileMetaData, event);
  let { errorObj } = parsedFileObj;
  errorObj = formatValidatorFunc(parsedFileObj, errorObj);
  addFileFunc(parsedFileObj, errorObj);
  tableUpdaterFunc(parsedFileObj, errorObj);
}

function readFile(reader, file) {
  if (file.name.endsWith('.json') || file.name.endsWith('.csv')
    || file.name.endsWith('.xml') || file.name.endsWith('.txt')) {
    reader.readAsText(file);
  } else {
    reader.readAsDataURL(file);
  }
}

function validateFileFormat(file) {
  const fileNameSegments = file.name.split('.');
  const fileExtension = fileNameSegments[fileNameSegments.length - 1];
  return getAcceptedFileFormat().includes(fileExtension) || file.type.includes('image/');
}

function uploadDatasetFilesHandler(uploadData, event) {
  if (uploadData.files && uploadData.files.length > 0) {
    for (let i = 0; i < uploadData.files.length; i += 1) {
      if (validateFileFormat(uploadData.files[i])) {
        const reader = new FileReader();
        reader.onload = onFileLoad.bind(this, uploadData.files[i]);
        readFile(reader, uploadData.files[i]);
      }
    }
  }
  event.target.value = ''; // resetting to prevent Chrome issue of not being able to upload same file twice
}

function addAlreadyUploadedImages(images) {
  images.forEach((image) => {
    const parsedFileObj = {
      fileFormat: IMAGE_FILE_INDICATOR,
      body: { fileMetaData: { name: image.name }, imageElement: image.data },
    };
    const errorObj = { error: false, message: '', alreadyUploaded: true };
    addFileFunc(parsedFileObj, errorObj);
    tableUpdaterFunc(parsedFileObj, errorObj);
  });
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

export {
  setTableUpdater, setFormatValidator, setAddFile,
  uploadDatasetFilesHandler, addAlreadyUploadedImages,
};
