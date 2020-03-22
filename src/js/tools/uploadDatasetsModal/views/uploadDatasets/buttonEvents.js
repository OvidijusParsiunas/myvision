import { hideUploadDatasetsViewAssets } from './style';
import { uploadDatasetFilesHandler } from './uploadDatasetFilesHandler';
import removeFile from './removeFileHandler';
import { drawShapesAndImages } from './drawShapesAndImages';

function triggerUploadDatasetFiles() {
  document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger').click();
}

function moveToNextView(nextViewCallback) {
  drawShapesAndImages();
  hideUploadDatasetsViewAssets();
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback) {
  window.triggerUploadDatasetFiles = triggerUploadDatasetFiles;
  window.uploadDatasetFilesHandler = uploadDatasetFilesHandler;
  window.drawShapesAndImages = moveToNextView.bind(this, nextViewCallback);
  window.removeFileFromUploadDatasetFiles = removeFile;
}

export { registerButtonEventHandlers as default };
