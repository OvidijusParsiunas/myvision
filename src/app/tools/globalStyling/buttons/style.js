import IS_FIREFOX from '../../utils/browserType';

function applyStylingToElementsArray(elementsArray, property, value) {
  for (let i = 0; i < elementsArray.length; i += 1) {
    elementsArray[i].style[property] = value;
  }
}

function applyLargeScreenButtonsStyle(buttonElements) {
  buttonElements.labellerModalSubmitButtonElement.style.paddingBottom = '4px';
  buttonElements.labellerModalCancelButtonElement.style.paddingBottom = '4px';
  applyStylingToElementsArray(buttonElements.buttonClassElements, 'lineHeight', 1.35);
  applyStylingToElementsArray(buttonElements.popupLabelButtonClassElements, 'paddingTop', '6px');
  applyStylingToElementsArray(buttonElements.popupLabelDisabledButtonClassElements, 'paddingTop', '6px');
  if (IS_FIREFOX) {
    buttonElements.exportDatasetsPopupExportButton.style.paddingTop = '5px';
    buttonElements.exportDatasetsPopupExportButton.style.paddingBottom = '7px';
  } else {
    buttonElements.exportDatasetsPopupExportButton.style.paddingTop = '6px';
  }
}

function applySmallScreenButtonsStyle(buttonElements, screenSizeDelta) {
  buttonElements.labellerModalSubmitButtonElement.style.paddingBottom = `${5 / screenSizeDelta}px`;
  buttonElements.labellerModalCancelButtonElement.style.paddingBottom = `${5 / screenSizeDelta}px`;
  applyStylingToElementsArray(buttonElements.buttonClassElements, 'lineHeight', 'initial');
  applyStylingToElementsArray(buttonElements.popupLabelButtonClassElements, 'paddingTop', `${7 / screenSizeDelta}px`);
  applyStylingToElementsArray(buttonElements.popupLabelDisabledButtonClassElements, 'paddingTop', `${7 / screenSizeDelta}px`);
  buttonElements.exportDatasetsPopupExportButton.style.paddingTop = `${6 / screenSizeDelta}px`;
  if (!IS_FIREFOX) buttonElements.welcomeModalStartButton.style.marginTop = `${3.5 / screenSizeDelta}px`;
}

function getButtonElements() {
  const buttons = {};
  buttons.welcomeModalStartButton = document.getElementById('welcome-modal-start-button');
  buttons.labellerModalSubmitButtonElement = document.getElementById('labeller-modal-submit-button');
  buttons.labellerModalCancelButtonElement = document.getElementById('labeller-modal-cancel-button');
  buttons.buttonClassElements = document.getElementsByClassName('buttons');
  buttons.popupLabelButtonClassElements = document.getElementsByClassName('popup-label-button');
  buttons.popupLabelDisabledButtonClassElements = document.getElementsByClassName('popup-label-button-disabled');
  buttons.exportDatasetsPopupExportButton = document.getElementById('export-datasets-popup-export-button');
  return buttons;
}

function setButtonsStyle(screenSizeDelta) {
  const buttonElements = getButtonElements();
  if (screenSizeDelta > 1.000001) {
    applySmallScreenButtonsStyle(buttonElements, screenSizeDelta);
  } else {
    applyLargeScreenButtonsStyle(buttonElements, screenSizeDelta);
  }
}

export { setButtonsStyle as default };
