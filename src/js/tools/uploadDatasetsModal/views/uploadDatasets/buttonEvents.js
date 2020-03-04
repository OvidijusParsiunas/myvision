import { hideUploadDatasetsViewAssets } from './style';

// function moveToNextView(nextViewCallback) {
//   hideUploadDatasetsViewAssets();
//   nextViewCallback();
// }

function triggerDatasetUpload() {
  document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger').click();
}

function registerButtonEventHandlers(nextViewCallback) {
  // window.startUploadDatasets = moveToNextView.bind(
  //   this, nextViewCallback,
  // );
  window.triggerDatasetUpload = triggerDatasetUpload;
}

export { registerButtonEventHandlers as default };
