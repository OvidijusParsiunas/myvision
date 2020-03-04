import { hideUploadDatasetsViewAssets } from './style';
import uploadDatasetFilesHandler from './uploadDatasetFilesHandler';

// function moveToNextView(nextViewCallback) {
//   hideUploadDatasetsViewAssets();
//   nextViewCallback();
// }

function triggerUploadDatasetFiles() {
  document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger').click();
}

function registerButtonEventHandlers(nextViewCallback) {
  // window.startUploadDatasets = moveToNextView.bind(
  //   this, nextViewCallback,
  // );
  window.triggerUploadDatasetFiles = triggerUploadDatasetFiles;
  window.uploadDatasetFilesHandler = uploadDatasetFilesHandler;
}

export { registerButtonEventHandlers as default };
