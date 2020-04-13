import { hideSelectFormatViewAssets, selectFormat } from './style';
import { setFormatState } from '../../stateMachine';

function moveToNextView(nextViewCallback) {
  hideSelectFormatViewAssets();
  nextViewCallback();
}

function setFormat(format, targetElement) {
  selectFormat(targetElement);
  setFormatState(format);
}

function registerButtonEventHandlers(nextViewCallback) {
  window.moveToUploadDatasetsView = moveToNextView.bind(
    this, nextViewCallback,
  );
  window.selectUploadDatasetsFormat = setFormat;
}

export { registerButtonEventHandlers as default };
