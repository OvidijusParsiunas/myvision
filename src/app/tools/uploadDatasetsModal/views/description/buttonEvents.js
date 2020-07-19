import { hideDescriptionViewAssets } from './style';

function moveToNextView(nextViewCallback) {
  hideDescriptionViewAssets();
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback) {
  window.moveToSelectFormatView = moveToNextView.bind(
    this, nextViewCallback,
  );
}

export { registerButtonEventHandlers as default };
