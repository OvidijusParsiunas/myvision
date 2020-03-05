import { hideUploadDatasetsViewAssets } from './style';
import { uploadDatasetFilesHandler, initialiseSetDatasetObjectFunc } from './uploadDatasetFilesHandler';

// function moveToNextView(nextViewCallback) {
//   hideUploadDatasetsViewAssets();
//   nextViewCallback();
// }

function triggerUploadDatasetFiles() {
  document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger').click();
}

function registerButtonEventHandlers(nextViewCallback, setDatasetObject) {
  // window.startUploadDatasets = moveToNextView.bind(
  //   this, nextViewCallback,
  // );
  initialiseSetDatasetObjectFunc(setDatasetObject);
  window.triggerUploadDatasetFiles = triggerUploadDatasetFiles;
  window.uploadDatasetFilesHandler = uploadDatasetFilesHandler;
}

export { registerButtonEventHandlers as default };
