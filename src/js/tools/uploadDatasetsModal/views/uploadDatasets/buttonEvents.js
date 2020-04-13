import { hideUploadDatasetsViewAssets } from './style';
import { uploadDatasetFilesHandler } from './uploadDatasetFilesHandler';
import { drawShapesAndImages } from './drawShapesAndImages';
import { setAllStatesToDefault } from '../../stateMachine';

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
  setAllStatesToDefault();
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback, removeFileHandlerFunc,
  clearDatasetObjectFunc) {
  window.triggerUploadDatasetFiles = triggerUploadDatasetFiles;
  window.uploadDatasetFilesHandler = uploadDatasetFilesHandler;
  window.drawShapesAndImages = moveToNextView.bind(this, nextViewCallback, clearDatasetObjectFunc);
  window.removeFileFromUploadDatasetFiles = removeFile.bind(this, removeFileHandlerFunc);
}

export { registerButtonEventHandlers as default };
