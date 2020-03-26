import { hideUploadDatasetsViewAssets } from './style';
import { uploadDatasetFilesHandler } from './uploadDatasetFilesHandler';
import removeFile from './removeFileHandler';
import { drawShapesAndImages } from './drawShapesAndImages';
import { clearDatasetObject } from './datasetObjectManagers/COCOJSONDatasetObjectManager';
import { setAllStatesToDefault } from './stateManager';

function triggerUploadDatasetFiles() {
  document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger').click();
}

function moveToNextView(nextViewCallback) {
  drawShapesAndImages();
  hideUploadDatasetsViewAssets();
  clearDatasetObject();
  setAllStatesToDefault();
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback) {
  window.triggerUploadDatasetFiles = triggerUploadDatasetFiles;
  window.uploadDatasetFilesHandler = uploadDatasetFilesHandler;
  window.drawShapesAndImages = moveToNextView.bind(this, nextViewCallback);
  window.removeFileFromUploadDatasetFiles = removeFile;
}

export { registerButtonEventHandlers as default };
