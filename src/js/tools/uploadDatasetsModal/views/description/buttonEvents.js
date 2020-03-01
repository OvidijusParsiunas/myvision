import { hideDescriptionViewAssets } from './style';

function moveToNextView(nextViewCallback) {
  hideDescriptionViewAssets();
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback) {
  window.startUploadDatasets = moveToNextView.bind(
    this, nextViewCallback,
  );
}

export { registerButtonEventHandlers as default };
