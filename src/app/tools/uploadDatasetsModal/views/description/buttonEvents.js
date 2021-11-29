import { hideDescriptionViewAssets } from './style.js';

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
