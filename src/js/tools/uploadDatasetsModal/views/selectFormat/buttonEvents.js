import { hideSelectFormatViewAssets } from './style';

function moveToNextView(nextViewCallback) {
  hideSelectFormatViewAssets();
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback) {
  window.startUploadDatasets = moveToNextView.bind(
    this, nextViewCallback,
  );
}

export { registerButtonEventHandlers as default };
