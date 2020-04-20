import { disableFormatOptionsTextIfNoBoundingBoxes, hideExportLabelsPopUp, displayExportLabelsPopUp } from '../facadeWorkersUtils/exportDatasetsPopup/style';
import { getExportDatasetsPopUpOpenState } from '../../../stateMachine';
import { windowHasScrollbar } from '../../../globalStyling/style';

function validateFullPopUpVisible(popupLabelParentElement) {
  if (windowHasScrollbar()) {
    popupLabelParentElement.style.top = '';
    popupLabelParentElement.style.bottom = '5px';
  } else {
    popupLabelParentElement.style.bottom = '';
  }
}

function calculateElementOffset(el) {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function setPopUpPosition(exportLabelsPopupParentElement, exportDatasetsButton) {
  const divOffset = calculateElementOffset(exportDatasetsButton);
  exportLabelsPopupParentElement.style.top = `${divOffset.top}px`;
  exportLabelsPopupParentElement.style.left = '65px';
}

function toggleExportDatasetsPopUp() {
  const exportLabelsPopupParentElement = document.getElementById('export-labels-popup-parent');
  const exportDatasetsButton = document.getElementById('exportDatasetsButton');
  if (!getExportDatasetsPopUpOpenState()) {
    disableFormatOptionsTextIfNoBoundingBoxes();
    setPopUpPosition(exportLabelsPopupParentElement, exportDatasetsButton);
    displayExportLabelsPopUp();
    validateFullPopUpVisible(exportLabelsPopupParentElement);
  } else {
    hideExportLabelsPopUp();
  }
}

export { toggleExportDatasetsPopUp as default };
