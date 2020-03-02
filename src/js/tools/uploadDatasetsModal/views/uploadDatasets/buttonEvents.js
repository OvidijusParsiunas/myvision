import { hideUploadDatasetsViewAssets } from './style';

function moveToNextView(nextViewCallback) {
  hideUploadDatasetsViewAssets();
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback) {
  // window.startUploadDatasets = moveToNextView.bind(
  //   this, nextViewCallback,
  // );
}

export { registerButtonEventHandlers as default };
