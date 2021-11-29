import { hideUploadDatasetsViewAssets } from './style.js';
import { uploadDatasetFilesHandler } from './uploadDatasetFilesHandler.js';
import { drawShapesAndImages } from './drawShapesAndImages.js';

function triggerUploadDatasetFiles() {
  document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger').click();
}

function removeFile(removeFileHandlerFunc, fileName, objectName) {
  removeFileHandlerFunc(fileName, objectName);
}

function moveToNextView(nextViewCallback, clearDatasetObjectFunc) {
  drawShapesAndImages();
  hideUploadDatasetsViewAssets();
  clearDatasetObjectFunc();
  nextViewCallback(false);
}

function goBackToSelectFormatView(selectFormatViewCallback, clearDatasetObjectFunc) {
  hideUploadDatasetsViewAssets();
  clearDatasetObjectFunc();
  selectFormatViewCallback();
}

function registerButtonEventHandlers(nextViewCallback, removeFileHandlerFunc,
  clearDatasetObjectFunc, selectFormatViewCallback) {
  window.triggerUploadDatasetFiles = triggerUploadDatasetFiles;
  window.uploadDatasetFilesHandler = uploadDatasetFilesHandler;
  window.drawShapesAndImages = moveToNextView.bind(this, nextViewCallback, clearDatasetObjectFunc);
  window.removeFileFromUploadDatasetFiles = removeFile.bind(this, removeFileHandlerFunc);
  window.goBackToSelectFormatView = goBackToSelectFormatView.bind(this,
    selectFormatViewCallback, clearDatasetObjectFunc);
}

export { registerButtonEventHandlers as default };
